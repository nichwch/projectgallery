<script lang="ts">
	import { LabelAndPopup, MultiSelectorPopup, SingleSelectorPopup } from 'licks';

	export let data;
	type ProjectEntry = {
		name: string;
		created: string;
		description: string;
		links: { name: string; href: string }[];
		made_with: string[];
		unfinished?: boolean;
	};
	const projects: ProjectEntry[] = data.projects;

	$: allTechnologies = Array.from(
		projects.reduce<Map<string, number>>((prev, curr) => {
			console.log({ prev });
			for (let tech of curr.made_with) {
				prev.set(tech, prev.get(tech) ? prev.get(tech)! + 1 : 1);
			}
			return prev;
		}, new Map()) || []
	).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);

	let selectedTechnologies = new Set<string>();

	const AUTHORS_CHOICE = "author's choice";
	const MOST_RECENT = 'most recent';
	const LEAST_RECENT = 'least recent';
	const SORT_OPTIONS = [AUTHORS_CHOICE, MOST_RECENT, LEAST_RECENT];
	let sort_by: typeof AUTHORS_CHOICE | typeof MOST_RECENT | typeof LEAST_RECENT = AUTHORS_CHOICE;

	const SORT_FUNCTIONS = {
		[AUTHORS_CHOICE]: (a: ProjectEntry, b: ProjectEntry): number => 0,
		[MOST_RECENT]: (a: ProjectEntry, b: ProjectEntry): number =>
			new Date(b.created).getTime() - new Date(a.created).getTime(),
		[LEAST_RECENT]: (a: ProjectEntry, b: ProjectEntry): number =>
			new Date(a.created).getTime() - new Date(b.created).getTime()
	};

	$: derivedProjects = projects
		// filter by tags
		.filter((project) => {
			if (selectedTechnologies.size === 0) return true;
			else {
				const selectedTech = Array.from(selectedTechnologies);
				console.log({ selectedTech });
				console.log(project.made_with);
				for (let tech of selectedTech) {
					if (!project.made_with.includes(tech)) return false;
				}
				return true;
			}
		})
		// respect sort order
		.sort(SORT_FUNCTIONS[sort_by] || SORT_FUNCTIONS[AUTHORS_CHOICE]);

	$: overlappingTechnologies = allTechnologies
		.filter((tech) => {
			for (let project of derivedProjects) {
				if (project.made_with.includes(tech[0])) return true;
			}
			return false;
		})
		.map((tech) => tech[0]);

	let scrollY = 0;
</script>

<svelte:window bind:scrollY />
<div class="mb-20 w-full px-5 box-border lg:w-[36rem] lg:mx-auto">
	<div
		class="mt-5 pt-5 mb-10 sticky top-0 bg-white transition-all pb-2"
		class:border-b-2={scrollY > 10}
		class:border-b-gray-300={scrollY > 10}
	>
		<h1 class="inline-block">My projects</h1>
		<LabelAndPopup
			addLabelClasses="!text-sm !bg-gray-300 hover:!bg-gray-400"
			addWindowClasses="left-[-5.5rem]  md:left-0 !w-72 !p-1 !bg-gray-100"
		>
			<svelte:fragment slot="buttonContent">filters</svelte:fragment>
			<svelte:fragment slot="windowContent">
				<MultiSelectorPopup
					label="tech"
					addLabelClasses="!text-sm"
					addWindowClasses="!w-72 !flex !flex-wrap !gap-1 !text-sm p-1 !bg-gray-100"
					options={overlappingTechnologies}
					bind:selectedOptions={selectedTechnologies}
				/>
				<SingleSelectorPopup
					label="order by"
					addLabelClasses="!text-sm !bg-gray-200 hover:!bg-gray-300"
					addWindowClasses="!min-w-36 !text-sm !p-0 "
					addOptionClasses="!bg-gray-200 hover:!bg-gray-300"
					options={SORT_OPTIONS}
					bind:selection={sort_by}
				/>
			</svelte:fragment>
		</LabelAndPopup>
		<h3 class="italic"><a href="https://nicholaschen.io">back to my main site</a></h3>
		{#if selectedTechnologies.size > 0}
			<div class="text-gray-700 italic">
				showing projects using
				{#each Array.from(selectedTechnologies) as tech, index}
					<span class="text-red-600">
						{tech}{index === selectedTechnologies.size - 1 ? '' : ', '}
					</span>
				{/each}
			</div>
		{/if}
	</div>
	{#each derivedProjects as project}
		<div class="mt-10">
			<div>
				<span class="underline">
					{project.name}
				</span>
				{#if project.unfinished}
					<span class="inline-blockpx-1 text-red-500 font-bold text-sm ml-1">unfinished</span>
				{/if}
				<span class="float-right text-gray-500">
					{project.created}
				</span>
			</div>
			<div class="flex">
				{#each project.links as currlink}
					<span class="mr-2"><a href={currlink.href}>[{currlink.name}]</a></span>
				{/each}
			</div>
			<div>
				{#each project.made_with as tech}
					<span class="inline-block border border-black mr-2 bg-red-300 px-1 text-sm">{tech}</span>
				{/each}
			</div>
			<p class="mt-5">{project.description}</p>
		</div>
	{/each}
</div>
