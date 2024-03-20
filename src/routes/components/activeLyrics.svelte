<script lang="ts">
	import { lyricIndex, lyrics, playingStatus, isLooping, userDetails, songDetails } from '$lib/stores';
	import { text } from 'estimated-read-time';
	import { writable } from 'svelte/store';
	import { onDestroy, onMount } from 'svelte';
	import { updateStatus } from '$lib/discord-api-utils';
  let token = ""
  let speed = 1
  onMount(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
        token = JSON.parse(storedToken)["token"];
    }
    
    const storedSpeed = localStorage.getItem("speed");
    if (storedSpeed) {
        speed = JSON.parse(storedSpeed)["speed"];
    }
});

	function toggleLooping() {
		isLooping.update((value) => !value); // Toggle the looping state
	}

	function updateInfo(status: string) {
		// window.electron.updateStatus(details, status)
		if ($userDetails.id && $songDetails.artist) {
			updateStatus(status, token);
      console.log("status updated")
		}
	}
	// Create a writable store to keep track of the timer interval
	// Create a writable store to keep track of the timer interval
	let timerInterval = writable<number | null>(null);

    function textTime(verse) {
    // Define a reading speed in characters per second (adjust as needed)
    const readingSpeed = 10; // 4 characters per second is an example, you can change it

    // Calculate the estimated time based on the number of characters in the verse
    const estimatedTime = (verse.length / readingSpeed) * 1000; // Convert to milliseconds

    // Calculate the adjusted read time based on the user's speed
    const adjustedReadTime = estimatedTime / speed;

    return Math.max(adjustedReadTime, 1000); // Choose the longer of the adjusted time and a minimum time (e.g., 1 second)
  }

	// Function to start the timer for advancing to the next verse
	function startTimer() {
		clearInterval($timerInterval);
		const currentVerseIndex = $lyricIndex;
		// const readTimeBase = text($lyrics[currentVerseIndex]).seconds * 1000; // Convert to milliseconds
    const readTime = textTime($lyrics[currentVerseIndex], currentVerseIndex);
		if ($playingStatus) {
			timerInterval.set(
				setInterval(() => {
					if ($lyricIndex === currentVerseIndex) {
						// Only advance if the user hasn't manually changed the verse
						nextVerse();
					}
				}, readTime),
			);
		}
	}

	// Function to stop the timer
	function stopTimer() {
		clearInterval($timerInterval);
	}

	// Function to go to the next verse
	function nextVerse() {

		const newIndex = $lyricIndex + 1;
		const shouldLoop = $isLooping;
    updateInfo($lyrics[newIndex]);

		if (newIndex < $lyrics.length) {

			lyricIndex.set(newIndex);
			startTimer();
		} else if (shouldLoop) {
			// Reset to the first verse if looping is enabled
			lyricIndex.set(0);
			startTimer();
		}
	}

	// Function to go to the previous verse
	function prevVerse() {
		const newIndex = $lyricIndex - 1;
		if (newIndex >= 0) {
			lyricIndex.set(newIndex);
			startTimer();
		}
	}

	// Function to seek to a specific verse
	function seekToVerse(index: number) {
		if (index >= 0 && index < $lyrics.length) {
			lyricIndex.set(index);
      updateInfo($lyrics[index]);

			startTimer();
		}
	}

	// Watch for changes in playingStatus and start/stop the timer accordingly
	$: {
		startTimer();
		if ($playingStatus) {
			startTimer();
		} else {
			stopTimer();
		}
	}

  function updateCurrentVerseInfo() {
    if ($userDetails.id && $songDetails.artist) {
      updateInfo($lyrics[$lyricIndex]);
    }
  }

  $: {
    updateCurrentVerseInfo();
  }

  // Ensure initial update when the component is mounted
  onMount(() => {
    updateCurrentVerseInfo(); // Initial update
    startTimer(); // Start the timer when the component is mounted
  });
	// Cleanup the timer when the component is destroyed
	onDestroy(() => {
		stopTimer();
	});
</script>

<div class="mb-24 mt-16 transition-all ease-in-out {$playingStatus ? '' : 'opacity-50'}">
	{#each $lyrics as lyric, index}
		<button
			class="text-left font-circular font-medium leading-normal text-3xl transition-all duration-300 ease-in-out {index <
			$lyricIndex
				? 'text-white opacity-70'
				: index === $lyricIndex
				? 'text-white'
				: 'text-black'}"
			id="song-index-{index}"
			on:click={() => seekToVerse(index)}
		>
			{lyric}
		</button>
	{/each}
</div>

<!-- Add controls for seeking to next and previous verses
<button on:click={prevVerse}>Previous Verse</button>
<button on:click={nextVerse}>Next Verse</button>
 -->
