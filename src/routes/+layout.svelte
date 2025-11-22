<script>
	let { children } = $props();
	import "../app.css";
  import { tools } from "./data.js";
  import favicon from '../lib/assets/favicon.svg';

  for (const tool of tools) {
    console.log(tool.slug);
  }

</script>

<svelte:head>
	<!-- this asset will be inlined as a base64 URL -->
	<link rel="icon" href={favicon} />
</svelte:head>

<div>
	<div class="fixed bg-slate-100 bottom-0 w-full md:w-fit md:top-0 md:right-0">
		<details>
			<summary class="p-2 underline"><p class="font-bold">Menu</p></summary>
			<div class="p-2">
				<nav>
					<ul>
            <li><a href="/">Home</a></li>
            <li><a href="/tools">Tools</a></li>
            <br />
            <p class="font-bold">All Tools:</p>
            {#each tools as tool}
              <li><a href={`/tools/${tool.slug}`}>{tool.title}</a></li>
            {/each}
            <br />
					</ul>
				</nav>
			</div>
		</details>
	</div>
</div>

<div class="m-4">
  {@render children()}
</div>
