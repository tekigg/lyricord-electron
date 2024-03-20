<script>
	import { userDetails } from "$lib/stores";
	import { fly } from "svelte/transition";
    console.log($userDetails.username)
</script>

<div in:fly={{ x: -80, duration: 500 }} out:fly={{ x: 40, duration: 200 }} class="w-full h-50 pb-8 pt-20 justify-center flex flex-col items-center">
    <div class="bg-black/20 h-28 w-28 rounded-full mb-3">
        {#if $userDetails.id}
        <img class="rounded-full" src="https://cdn.discordapp.com/avatars/{$userDetails.id}/{$userDetails.avatar}" />
        {/if}
    </div>
    <div>
        <span class="text-white text-sm" >{$userDetails.global_name ? $userDetails.global_name : 'No User Found ⚠️'}</span>
        <span class="text-white/60 text-sm">{$userDetails.username ? $userDetails.username : ''}</span>
    </div>
</div>