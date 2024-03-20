<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { color } from '$lib/stores';
	
	console.log($page.url.pathname);
	color.set("#101010")

</script>

<div
	in:slide={{ delay: 450, axis: "x" }}
	out:fade={{ duration: 100 }}
	class=" mx-5 h-[100vh] text-left font-circular font-medium leading-normal text-5xl transition-all justify-center duration-300 ease-in-out text-white/70 flex flex-col"
>
	<a class="hover:text-white transition-all" href="{$page.url.pathname}/profile">Profile</a>
	<a class="hover:text-white transition-all" href="{$page.url.pathname}/devtoken">TokenDevTest</a>
	<a class="hover:text-white transition-all" href="{$page.url.pathname}/credits">Credits</a>

</div>
