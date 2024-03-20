<script lang="ts">
	import type { LayoutData } from './$types';

	function closeApp() {
		window.electron.closeApp();
	}

	function minimizeApp() {
		window.electron.minimizeApp();
	}

	import '../app.css';
	// export let data: LayoutData;
	import { page } from '$app/stores';
	import { color, userDetails } from '$lib/stores';
	import close from '$lib/assets/close.svg';
	import minimize from '$lib/assets/minimize.svg';
	import settings from '$lib/assets/settings.svg';
	import home from '$lib/assets/home.svg';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { loginAndValidate } from '$lib/discord-api-utils';
	let originalColor = $color;
	function toggleColorAndRoute(route: string) {
		const currentPath = $page.url.pathname;
		if (currentPath.includes(route)) {
			color.set(originalColor);
			goto('/');
		} else {
			originalColor = $color;
			color.set('#101010');
			goto('/settings');
		}
	}

	onMount(() => {
    const storedToken = localStorage.getItem("token");
	console.log(storedToken)
	try {
        loginAndValidate(JSON.parse(storedToken)["token"])
          .then((user) => {
            userDetails.set(user.user);
			console.log(user.user)
          })
          .catch((error) => {
            userDetails.set({}); // Reset userDetails
            console.error('Login failed:', error);

          });
      } catch (error) {
        userDetails.set({}); // Reset userDetails
        console.error('Login failed:', error);
      }
    });
</script>

<!-- The background -->
<div class="h-screen w-screen">
	<div
		class="h-[99.9%] w-[99.9%] fixed transition-all ease-in-out duration-100 rounded-2xl border border-[#cfd0d0] border-[1px] box-border z-50 pointer-events-none"
	/>
	<div
		style="background-color: {$color};"
		class="h-[99.9%] w-[99.9%] transition-all ease-in-out duration-100 rounded-2xl"
	>
		<div class="overflow-scroll">
			<!-- The gradient on top -->
			<div
				style="--color: {$color}; -webkit-app-region: drag;"
				data-tauri-drag-region
				class="z-30 pointer-events-none fixed flex top-0 left-0 right-0 h-20 mb-24 pt-2 px-2 bg-gradient-to-t from-transparent to-dynamic rounded-2xl mx-1"
			/>

			<!-- The top nav bar  -->
			<div
				style="-webkit-app-region: drag"
				data-tauri-drag-region
				class="z-30 fixed flex top-0 left-0 right-0 h-10 pt-5 px-5 w-full bg-gradient-to-t from-transparent to-dynamic rounded-xl justify-between"
			>
				<div class="h-5 flex pointer-events-auto items-center">
					<div
						class="z-50 titlebar-button cursor-pointer hover:scale-110 transition-all ease-in-out"
						id="close-btn"
						style="-webkit-app-region: no-drag"
						on:click={closeApp}
					>
						<img src={close} alt="close" class="mr-3" />
					</div>
					<div
						class="titlebar-button cursor-pointer flex align-middle h-full w-5 hover:scale-110 transition-all ease-in-out"
						id="minimize-btn"
						style="-webkit-app-region: no-drag"
						on:click={minimizeApp}
					>
						<img class="max-h-60" src={minimize} alt="minimize" />
					</div>
				</div>
				<div>
					<a
						on:click={() => toggleColorAndRoute('settings')}
						class="titlebar-button cursor-pointer rounded-full bg-black/40 flex align-middle h-9 justify-center items-center w-9 hover:scale-[1.2] active:scale-110 transition-all ease-in-out"
						style="-webkit-app-region: no-drag"
					>
					<img
					src={($page.url.pathname.includes("settings") ? home : ($userDetails.id ? `https://cdn.discordapp.com/avatars/${$userDetails.id}/${$userDetails.avatar}` : settings))}
					class="{($userDetails.id && !$page.url.pathname.includes("settings") ? 'w-8 h-8 rounded-full' : 'w-5 h-5')} "
				  />
				  
				  
				  
					</a>
				</div>
			</div>
			<div class="overflow-scroll h-screen">
				<slot />
			</div>
		</div>
	</div>
</div>

<style>
  :global(body) {
    --color: {$color}
    }


</style>
