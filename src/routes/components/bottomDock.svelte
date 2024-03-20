<script>
  import { fade, fly } from "svelte/transition";
  import { backInOut } from "svelte/easing";
  import ProgressBar from "./progressBar.svelte";
  import { searchIndex } from "$lib/stores";
  import Search from "./search.svelte";
  import { focus } from "$lib/stores";
  import { songDetails, inputMode, playingStatus } from "$lib/stores";
  import genius from "$lib/assets/genius.svg"
  import edit from "$lib/assets/edit.svg"
  import pause from "$lib/assets/pause.svg"
  import play from "$lib/assets/play.svg"
  

  let inputRef

  let visible = true;
  let search = "";
  
  function switchFocus() {
    inputMode.set(true)
    focus.set(true)

    inputRef.focus()
  }

  function handleOnFocus() {
    focus.set(true);
    inputRef.focus()

  }

  function handleOnBlur(event) {
    // Check if the event target is the div itself and not its children
    if (event.target === event.currentTarget) {
      if ($songDetails.artist != "") {
      inputMode.set(false)
      }
      focus.set(false);


    }
  }

  // Bind the searchIndex to the value of the input
  $: searchIndex.set(search);

</script>

{#if visible}
  <div
    on:click={handleOnBlur}
    class="w-screen {$focus ? 'h-full' : ''} px-5 pb-5 fixed bottom-0 flex justify-end flex-col z-20"
  >
    <div>
      {#if $focus}
        <!-- The gradient on bottom -->
        <div
          in:fade={{ duration: 100 }}
          out:fade={{ duration: 100 }}
          class="-z-[999] pointer-events-none absolute flex bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-black/70 to-transparent rounded-[1.4rem] transform translate-x-0 translate-y-[1px]"
        />
        <!-- Search panel -->
        <Search />
      {/if}
      <div
        in:fly={{ y: 200, duration: 450, easing: backInOut }}
        out:fly={{ y: 200, duration: 450, easing: backInOut }}
        class="will-change-auto w-full h-20 rounded-xl {$focus
          ? 'bg-black/60'
          : 'bg-black/50'}   shadow-xl backdrop-blur-lg transition-all ease-in-out"
      >
        <div class="w-full h-[96%] flex items-center">
          {#if $inputMode}
            <div class="w-full flex items-center px-3">
              <input
              bind:this={inputRef} 
              id="searchField"
                on:focus={handleOnFocus}
                bind:value={search}
                placeholder="Search Music"
                style="background: none;"
                class="font-circular font-[200] focus:outline-none text-white/90 text-4xl  bg-none w-full h-full bg-opacity-0"
              />
            </div>
            {:else}
            <div class="p-3 w-full h-full flex items-center justify-between">
              <div class="h-full flex items-center">
                 <!-- album cover -->
                <div style="background-image: url({$songDetails.cover.url});" class="w-14 h-14 bg-cover rounded-md mr-3 aspect-square">
                </div>
                <div>
                  <!-- name and platform -->
                  <p  class="text-white font-circular -mb-1 text-sm">{$songDetails.title} · <span class="text-white/50">{$songDetails.artist}</span></p>
                  <img src={genius} class="inline h-3"> <span class="text-[#ffff64] text-sm font-circular">Genius Lyrics</span>
                </div>
              </div>
              <div class="flex h-full">
                <!-- controls -->
                <button on:click={() => switchFocus()}>
                  <img class="h-6 mr-2" src={edit}>

                </button>
                {#if $playingStatus}
                <!-- Show pause button when playingStatus is true -->
                <button on:click={() => playingStatus.set(false) }>
                  <img class="h-6 mr-2" src={pause}>
                </button>
              {:else}
                <!-- Show play button when playingStatus is false -->
                <button on:click={() => playingStatus.set(true) }>
                  <img class="h-6 mr-2" src={play}>
                </button>
              {/if}
              </div>
            </div>
          {/if}
        </div>
        <ProgressBar forceful={$inputMode ? true : false} />
      </div>
    </div>
  </div>
{/if}
