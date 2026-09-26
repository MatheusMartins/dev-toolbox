<script>
	let { children } = $props();
	import "../app.css";
  import { tools } from "./data.js";
  import favicon from '../lib/assets/favicon.svg';

  for (const tool of tools) {
    console.log(tool.slug);
  }

  const URLPREFIX = '/dev-toolbox';

</script>

<svelte:head>
	<!-- this asset will be inlined as a base64 URL -->
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex w-full max-w-full flex-col md:flex-row">
  <div class="m-4 min-w-0 max-w-full grow overflow-x-auto">
    {@render children()}
  </div>

  <div class="w-full min-w-0 max-w-full md:h-full md:w-auto md:min-w-fit">
    <div class="bg-slate-100 bottom-0 w-full md:w-fit md:top-0 md:right-0">
      <details open={true}>
        <summary class="p-2 underline"><p class="font-bold">Menu</p></summary>
        <div class="p-2">
          <nav>
            <ul>
              <li><a href={`${URLPREFIX}/`}>Home</a></li>
              <li><a href={`${URLPREFIX}/tools`}>Tools</a></li>
              <br />
              <p class="font-bold">All Tools:</p>
              {#each tools as tool}
                <li><a href={`${URLPREFIX}/tools/${tool.slug}`}>{tool.title}</a></li>
              {/each}
              <br />
            </ul>
          </nav>
        </div>
      </details>
    </div>
  </div>
</div>