<script lang="ts">
  import SmoothScroll from "$lib/components/SmoothScroll.svelte";
  import ActiveLyrics from "./components/activeLyrics.svelte";
  import BottomDock from "./components/bottomDock.svelte";
  import { lyricIndex, songDetails, lyrics } from "$lib/stores";
  import { fetchLyricsByUrl } from "$lib/api-utils";
  import { fade } from "svelte/transition";

  let isLoading = false;
  let welcomeText = `Welcome to Lyricord!
Type your song lyrics down below
Let's get this party started!`;
  let lyricsSplits = welcomeText.split("\n");

  async function UpdateLyrics() {
    try {
      isLoading = true; // Set isLoading to true before fetching
      const results = await fetchLyricsByUrl($songDetails.url);
      lyricsSplits = results
        .replace(/\[[^\]]*\]/g, "")
        .split("\n")
        .filter((item: string) => item.trim() !== "");
      lyrics.set(lyricsSplits);
      lyricIndex.set(0);
    } catch (error) {
      console.error("Error fetching Genius lyrics:", error);
    } finally {
      isLoading = false; // Set isLoading back to false when fetching is done
    }
  }

  $: UpdateLyrics($songDetails.url);
  $: console.log($lyrics);
</script>

<BottomDock />
{#if !isLoading}
  <div in:fade={{ duration: 200 }} out:fade={{ duration: 200 }} class="px-5">
    <ActiveLyrics lyrics={lyricsSplits} />
    <SmoothScroll elementId="song-index-{$lyricIndex}" />
  </div>
{/if}
