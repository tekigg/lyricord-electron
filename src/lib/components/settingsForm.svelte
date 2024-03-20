<script lang="ts">
	import { loginAndValidate } from '$lib/discord-api-utils';
	import { onMount } from 'svelte';
	import { animate } from 'motion';
	import { fade } from 'svelte/transition';
	import { color, userColor, userDetails, changesDetected } from '$lib/stores';
	import disconnected from '$lib/assets/disconnected.svg';
	import connected from '$lib/assets/connected.svg';

	export let text = 'Option text';
	export let type: 'Input' | 'Toggle' | 'Button' = 'Input';
	export let tooltip = '';
	export let icon = '';
	export let placeholder = '';
	export let disabled = false;
	export let buttonText = '';
	export let borderDotted = false;
	export let password = false;
	export let storageKey = 'config';
	export let regex = '';

	export let inputValue = '';
	export let isConnected = false;

	let isInvalid = false;
	let showTooltip = false;
	let isSwitchOn = false;


	function saveConfig() {
		const config = {
			[storageKey]: type === 'Input' ? inputValue : isSwitchOn,
		};
		localStorage.setItem(storageKey, JSON.stringify(config));

		if (type === 'Input' && storageKey === 'token') {
			try {
				loginAndValidate(inputValue)
					.then((user) => {
						isConnected = true;
						userDetails.set(user.user);
						color.set(user.user.banner_color);
						animate('.connection', { x: [0, -5, 5, 0] }, { duration: 0.5 });
					})
					.catch((error) => {
						isConnected = false;
						userDetails.set({}); // Reset userDetails
						console.error('Login failed:', error);
						color.set('#5F6074');
					});
			} catch (error) {
				isConnected = false;
				userDetails.set({}); // Reset userDetails
				console.error('Login failed:', error);
				color.set('#5F6074');
			}
		}
	}

	function validateInputValue() {
		if (regex) {
			const pattern = new RegExp(regex);

			if (!pattern.test(inputValue)) {
				// Invalid input, handle the validation error here
				console.log('Input value does not match the regex pattern.');
				isInvalid = true;
				// You can also show an error message or perform other actions as needed.
			} else {
				changesDetected.set({
					changed: true,
					isInvalid: false,
					changes: {},
				});
				saveConfig();
			}
		} else {
			saveConfig();
		}
	}

	onMount(() => {
		const storedValue = localStorage.getItem(storageKey);
		if (type === 'Input' && storedValue) {
			inputValue = JSON.parse(storedValue)[storageKey];
		} else if (type === 'Toggle' && storedValue) {
			isSwitchOn = JSON.parse(storedValue)[storageKey] ? true : false;
		}

		if (type === 'Input') {
			saveConfig();
		}
	});

	function handleInputValueChange(event) {
		inputValue = event.target.value;
		validateInputValue();
		// Set changesDetected to true when a change is detected
	}

	function toggleTooltip() {
		showTooltip = !showTooltip;
		saveConfig();
	}

	function toggleSwitch() {
		isSwitchOn = !isSwitchOn;
		saveConfig();
	}

	function typeAction(node) {
		node.type = password ? 'password' : 'text';
	}
</script>

<div
	class="flex justify-between w-full items-center my-2 transition-all {disabled
		? 'opacity-30 pointer-events-none'
		: ''}"
>
	<h3 class="text-white/50 font-[300] text-sm">{text}</h3>
	{#if type === 'Input'}
		<div class="flex justify-center">
			{#if storageKey === 'token'}
				<img
					class="connection h-8 w-8 inline-block -mr-2"
					src={isConnected ? connected : disconnected}
				/>
			{/if}
			<input
				use:typeAction
				bind:value={inputValue}
				on:input={handleInputValueChange}
				{placeholder}
				class="placeholder:text-white/25 rounded-md border {isInvalid
					? 'border-rose-600 bg-rose-600/30'
					: 'border-[#5f5f5f] bg-[#333333]'}  min-w-[10rem] ml-3 p-1 text-white/80 font-thin text-sm focus:ring-1 focus:ring-slate-500 transition-all"
			/>
		</div>
	{:else if type === 'Toggle'}
		<label class="relative inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				on:change={toggleSwitch}
				class="sr-only peer"
				bind:checked={isSwitchOn}
			/>
			<div
				class="w-11 h-6 bg-[#404041] rounded-full peer border border-[#8E8E8E] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1ed760]"
			/>
		</label>
	{:else if type === 'Button'}
		<button
			class="text-[0.8rem] py-[0.3rem] px-3 rounded-full border {borderDotted
				? 'border-dashed'
				: ''} border-[#a4a4a6]"
		>
			<img class="inline-block w-4 h-4 mr-1" src={icon} />
			{buttonText}
		</button>
	{/if}
	{#if tooltip}
		<div class="relative">
			<button on:click={toggleTooltip} class="text-white text-sm underline cursor-pointer">
				{showTooltip ? 'Hide Tooltip' : 'Show Tooltip'}
			</button>
			{#if showTooltip}
				<div
					class="absolute top-8 left-0 bg-gray-900 text-white text-sm p-2 rounded shadow"
				>
					{tooltip}
				</div>
			{/if}
		</div>
	{/if}
</div>
