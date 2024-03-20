<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
	import { page } from '$app/stores';
	import { fade, slide } from 'svelte/transition';
	import { color } from '$lib/stores';
	console.log($page.url.pathname);
	color.set('#101010');
	let passkey = '';




	function onSubmit(event) {
  event.preventDefault();
  console.log('onSubmit called');
}

</script>

<div
	in:slide={{ delay: 450, axis: 'x' }}
	out:fade={{ duration: 100 }}
	class=" mx-5 h-[100vh] text-left font-circular font-medium leading-normal text-3xl transition-all justify-center duration-300 ease-in-out text-white flex flex-col"
>
<form on:submit={onSubmit}>
	<input
	bind:value={passkey} 
		placeholder="Token"
		class="place-content-center placeholder-black/30 bg-slate-400/50 rounded-xl p-3 w-full"
	/>
	<button type="submit" class="hover:text-white transition-all mt-5" >Submit</button>
</form>
</div>
