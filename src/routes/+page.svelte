<script lang="ts">
	import { MultiSelectorPopup } from 'licks';

	export let data;
	type ProjectEntry = {
		name: string;
		created: string;
		description: string;
		links: { name: string; href: string }[];
		made_with: string[];
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
	$: console.log(allTechnologies);
	const selectedTechnologies = new Set<string>();
</script>

<div class="mb-20 w-full mx-5 box-content lg:w-[36rem] lg:mx-auto">
	<div class="mt-5 pt-5 mb-10 sticky top-0 bg-white">
		<div>
			<h1 class="inline-block">My projects</h1>
			<MultiSelectorPopup
				label="tech"
				options={allTechnologies.map((tech) => tech[0])}
				selectedOptions={selectedTechnologies}
			/>
		</div>

		<h3 class="italic"><a href="https://nicholaschen.io">back to my main site</a></h3>
	</div>
	{#each data.projects as project}
		<div class="mt-10">
			<div>
				<span class="underline">
					{project.name}
				</span>
				{#if project.unfinished}
					<span class="inline-blockpx-1 text-red-500 font-bold text-xs ml-1">unfinished</span>
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
					<span class="inline-block border border-black mr-2 bg-red-200 px-1 text-xs">{tech}</span>
				{/each}
			</div>
			<p class="mt-5">{project.description}</p>
		</div>
	{/each}
</div>
