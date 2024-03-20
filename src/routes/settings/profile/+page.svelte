<script lang="ts">
	import getColor from '$lib/getColor';
	import { page } from '$app/stores';
	import { fade, slide, fly } from 'svelte/transition';
	import { color, userColor, userDetails } from '$lib/stores';
	import SettingsForm from '$lib/components/settingsForm.svelte';
	import warningBanner from '$lib/assets/warning-banner.svg';
	import spotify from '$lib/assets/icons/spotify.svg';
	import lastFM from '$lib/assets/icons/lastFm.svg';

	import { onMount } from 'svelte';
	import { authenticateAndFetchUser } from '$lib/discord-api-utils';
	import UserSettings from '$lib/components/userSettings.svelte';
	import Banner from '$lib/components/banner.svelte';
	import { changesDetected } from '$lib/stores';

	import SettingsFormV2 from '$lib/components/settingsFormV2.svelte'

	function saveChanges() {
    // Save your changes here
    // changesDetected.set(false); // Reset changesDetected
  }

	const token = 'YOUR_AUTH_TOKEN'; // Replace with your actual token

	authenticateAndFetchUser(token)
		.then((loginResponse) => {
			// Handle the successful login response
			console.log('Authentication and user retrieval successful:', loginResponse);
		})
		.catch((error) => {
			// Handle the login failure
			console.error('Authentication and user retrieval failed:', error);
		});

	onMount(() => {
		if (!$userDetails.accent_color) {
			color.set($userColor);
		}
	});
</script>

<div
	class="absolute w-[100vw] h-[100vh] bg-gradient-to-b from-transparent to-[#101010] rounded-b-2xl z-0"
/>

<divs
	class="w-screen flex h-screen flex-col text-left font-circular leading-normal text-white relative"
>
	<UserSettings />
	<div
		id="box"
		class=" flex-1 w-full p-5 h-[40vh] bg-black/40 transition-none overflow-scroll rounded-b-2xl pb-28"
	>
		<div in:fly={{ x: -80, duration: 800 }} out:fly={{ x: 40, duration: 100 }}>
			<h1 class="text-xl font-medium">Prefrences</h1>
			<Banner />
			<SettingsFormV2 key="speed" type="Number" regex="^[+]?\d*\.?\d+$" />
			<SettingsFormV2 key="token" type="Input" regex="^[A-Za-z]*$"  />
			<img class="object-cover h-3 w-full rounded-[3px] mt-3 mb-2" src={warningBanner} />
			<img
				class="object-cover blur-md -translate-y-5 -mb-3 animate-pulse h-3 w-full rounded-md"
				src={warningBanner}
			/>
			<!-- <SettingsForm
				text="End lyrics verse with custom string"
				type="Input"
				storageKey="endLyricWith"
				placeholder="/lyr, 🎵, 🎧, etc"
			/>
			<SettingsForm
				text="Emote to go along the status, empty to disable"
				type="Input"
				storageKey="emote"
				placeholder="Emote ID"
			/>
			<SettingsForm
				text="Speed multiplier"
				type="Input"
				storageKey="speed"
				placeholder="Default: 1"
				regex="^\d+(\.\d+)?$"
			/>

			<SettingsForm
				text="Display lyrics on Discord Rich Presence"
				type="Toggle"
				storageKey="rpc"
				disabled={true}
			/>
			<h1 class="text-xl font-medium">Connections</h1>

			<SettingsForm
				text="Display lyrics from your Spotify listening activity"
				type="Button"
				buttonText="Connect Spotify"
				icon={spotify}
			/>
			<SettingsForm
				text="Display lyrics from your LastFM listening activity"
				type="Button"
				buttonText="Connect LastFM"
				icon={lastFM}
				disabled={true}
			/>


			<SettingsForm
				text="Token"
				type="Input"
				storageKey="token"
				placeholder="Discord token here"
				password={true}
			/> -->
		</div>
	</div>
</divs>
