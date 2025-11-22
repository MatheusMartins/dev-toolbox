<script lang="ts">
	let { children } = $props();
	import "../../app.css";
	import { tools } from "../data.js";
	for (const tool of tools) {
		console.log(tool.slug);
	}
</script>

<div>
  {@render children()}
</div>