<script lang="ts">
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	// const { app } = require('electron');
	let ready = false;
	
	let version = window.electron.getAppVersion();
	import { onMount } from 'svelte';
	onMount(() => {
		ready = true;
	});

	$: pathArray = $page.url.pathname.split('/').filter(Boolean);
	$: formattedPath = pathArray
		.map((segment, index) => {
			const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);
			const href = pathArray.slice(0, index + 1).join('/');
			return `<a href="/${href}">${capitalizedSegment}</a>`;
		})
		.join(' 🡒 ');
</script>

{#if ready}
<div
class="fixed w-screen bottom-0 p-5 flex justify-start font-circular font-extralight text-sm text-white/50 z-50"
>
{#key formattedPath}
	<div>v{version}</div>
{/key}
</div>
	<div
		class="fixed w-screen bottom-0 p-5 flex justify-end font-circular font-extralight text-sm text-white/50 z-50"
	>
		{#key formattedPath}
			<div in:fade={{ duration: 200 }}>{@html formattedPath}</div>
		{/key}
	</div>
	<div class="w-full">
		<slot />
	</div>
{/if}
