<script>
	import { fly } from 'svelte/transition';
	import { backInOut } from 'svelte/easing';
	import { changesDetected, config } from '$lib/stores';
	import _ from 'lodash';
	import { get } from 'svelte/store';

	function discard() {
		changesDetected.set({
			isChanged: false,
			isInvalid: false,
			changes: $config,
		});
	}

	function saveData() {
		if (!$changesDetected.isInvalid) {
			config.set($changesDetected.changes);
			discard();
		}
	}


</script>

{#if $changesDetected.isChanged}
	<div
		in:fly={{ y: 100, opacity: 0, duration: 400, easing: backInOut }}
		out:fly={{ y: 100, opacity: 0, duration: 400, easing: backInOut }}
		class="flex p-2 shadow-lg items-center justify-between fixed bottom-0 left-0 right-0 rounded-xl mx-5 my-5 z-50 bg-black/50 backdrop-blur-lg border border-gray-400/50 p-4 text-white text-center"
	>
		<p>Watch out! Unsaved changes detected.</p>
		<div class="flex justify-center">
			<button on:click={() => discard()} class="text-white/50 font-thin mr-4 text-sm">
				Discard
			</button>

			<button
				class="bg-green-600 border border-green-400 p-2 rounded-md"
				on:click={() => saveData()}
			>
				Save Changes
			</button>
		</div>
	</div>
{/if}
