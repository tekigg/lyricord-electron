<script lang="ts">
	import { changesDetected, config } from '$lib/stores';
	import { animate } from 'motion';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	export let text = 'Option text';
	export let type: 'Input' | 'Toggle' | 'Button' | 'Number' = 'Input';
	export let tooltip = '';
	export let icon = '';
	export let placeholder = '';
	export let disabled = false;
	export let buttonText = '';
	export let password = false;
	export let key: 'speed' | 'lyricEnd' | 'token';
	export let regex = '';
	export let allowEmpty = true

	let value = get(config)[key];
	let isInvalid = false;

	onMount(() => {
		changesDetected.set({
			isChanged: false,
			isInvalid: false,
			changes: get(config),
		});
	});

	function updateStore(updates) {
		changesDetected.update((currentConfig) => {
			return { ...currentConfig, ...updates };
		});
	}

	function validateInput(value) {
		const regexPattern = new RegExp(regex);
		if (regexPattern.test(value)) {
			
			updateStore({ isInvalid: false, isChanged: true });
			isInvalid = false;
			return true;
		} else {
			updateStore({ isInvalid: true, isChanged: true });
			console.log(value);
			isInvalid = true;
			return false;
		}
	}

	function handleInputChange(event) {
	let newValue = type === 'Number' ? parseFloat(event.target.value) : String(event.target.value);

	if (newValue) {
		animate(event.target, { x: [0, 1, 0] }, { duration: 0.1 });
	} else {
		animate(event.target, { x: [0, -8, 3, -3, 0] }, { duration: 0.6 });
	}

	let { [key]: configValue } = $config;

	if (newValue !== configValue) {
		if (validateInput(newValue)) {
			console.log('real');
			
		}
		value = newValue;
		const newChanges = { ...$changesDetected.changes, [key]: value };
		updateStore({ changes: newChanges });
	} else {
		updateStore({ isChanged: false });
	}
	console.log($changesDetected.changes[key]);
	console.log(newValue)
}


	$: {
		let { [key]: configValue } = $config;
		if (!$changesDetected.isChanged) {
			value = configValue;
			isInvalid=false
		}
	}

	// $: {
	// 	validateInput(value) ? isInvalid=false : isInvalid=true 
	// }


	// onMount(
	// updateStore()
	// )
</script>
<div class="w-full mb-2 flex justify-between items-center">
<p class="text-white/50 font-[200] text-sm">{text}</p>
<input
	{...{ type }}
	{value}
	placeholder={placeholder}
	disabled={$changesDetected.isInvalid && !isInvalid ? true : false}
	class="placeholder:text-white/25 rounded-md border {$changesDetected.isInvalid && !isInvalid ? 'opacity-30' : ''} {isInvalid
		? 'border-rose-600 bg-rose-600/30 '
		: 'border-[#5f5f5f] bg-[#333333] focus:ring-slate-500 focus:ring-1'} min-w-[10rem] ml-3 p-1 text-white/80 font-thin text-sm   transition-all"
	on:input={handleInputChange}
/>
</div>