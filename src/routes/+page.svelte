<script lang="ts">
	export let data;
	type ProjectEntry = {
		name: string;
		created: string;
		description: string;
		links: { name: string; href: string }[];
		made_with: string[];
	};
	const projects: ProjectEntry[] = data.projects;
</script>

<div class="mt-10 mb-20 w-full mx-5 box-content lg:w-[36rem] lg:mx-auto">
	<div class="mb-10">
		<h1>My projects</h1>

		<h3 class="italic"><a href="https://nicholaschen.io">back to my main site</a></h3>
	</div>
	{#each data.projects as project}
		<div class="mt-10">
			<div>
				<span>
					{project.name}
				</span>
				<span class="float-right">
					{project.created}
				</span>
			</div>
			<div class="flex">
				{#each project.links as currlink}
					<span class="mr-2"><a href={currlink.href}>[{currlink.name}]</a></span>
				{/each}
			</div>
			<p class="mt-5">{project.description}</p>
		</div>
	{/each}
</div>
