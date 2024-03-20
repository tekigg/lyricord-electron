<script lang="ts">
  import { fade } from "svelte/transition";
  import { fly } from "svelte/transition";
  import { searchIndex } from "$lib/stores";
  import searchIdle from "$lib/assets/search-idle.svg";
  import { fetchGeniusLyrics, fetchLyricsByUrl } from "$lib/api-utils";
  import { songDetails, color } from "$lib/stores";
  let geniusResults = []; // To store the fetched Genius lyrics
  let previousSearchQuery = ""; // To store the previous search query
  let searchTimer = null; // Timer to delay the fetch request
  let isLoading = false; // Loading state
  import { focus, inputMode  } from "$lib/stores";
  import ColorThief from "colorthief"



  
  function calculateBackgroundColor(imageUrl) {
    const image = new Image();
    image.crossOrigin = "Anonymous";

    image.onload = function() {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(image);

        // Convert the dominant color to HSL
        const hslColor = rgbToHsl(dominantColor[0], dominantColor[1], dominantColor[2]);

        // Check if the image appears to have vibrant colors
        const isVibrant = hslColor[1] > 20; // Adjust as needed (0-100)

        // Modify the saturation and lightness based on whether it's grayscale or not
        if (!isVibrant) {
            // If it doesn't have vibrant colors, set a toned-down tint of the dominant color
            const targetSaturation = 10; // Adjust as needed (0-100)
            const targetLightness = 40; // Adjust as needed (0-100)
            hslColor[1] = targetSaturation;
            hslColor[2] = targetLightness;
        } else {
            // If it has vibrant colors, modify the saturation and lightness more aggressively
            const targetSaturation = 75; // Adjust as needed (0-100)
            const targetLightness = 65; // Adjust as needed (0-100)
            hslColor[1] = targetSaturation;
            hslColor[2] = targetLightness;
        }

        // Convert the adjusted HSL color back to RGB
        const adjustedColor = hslToRgb(hslColor[0], hslColor[1], hslColor[2]);

        // Convert the adjusted RGB values to a CSS color string
        const backgroundColor = `rgb(${Math.round(adjustedColor[0])}, ${Math.round(adjustedColor[1])}, ${Math.round(adjustedColor[2])})`;

        //
        // Set the background color of an element, e.g., a div or body
        color.set(backgroundColor);

    };

    image.src = imageUrl + "?sdawd=awdawd";
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

// Function to convert HSL to RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
}

  function UpdateSong(song) {
    const details = {
    cover: {
        url: song.image,
},
    title: song.title,
    artist: song.artist,
    url: song.url
}

    inputMode.set(false)
    calculateBackgroundColor(song.image)
    songDetails.set(details)

    focus.set(false)
  }

  // Function to fetch Genius lyrics
  async function fetchGeniusResults(query) {
    try {
      const results = await fetchGeniusLyrics(query);
      geniusResults = results;
    } catch (error) {
      console.error("Error fetching Genius lyrics:", error);
    } finally {
      // Set isLoading to false when fetching is done (whether successful or not)
      isLoading = false;
    }
  }

  // Use a reactive statement to wait for user input to finish
  $: if ($searchIndex && $searchIndex !== previousSearchQuery) {
    // Clear any existing timer
    if (searchTimer) {
      clearTimeout(searchTimer);
    }

    // Set isLoading to true to display "Loading"
    isLoading = true; 

    // Set a timer to delay the fetch request (e.g., 500 milliseconds)
    searchTimer = setTimeout(() => {
      // Call the fetchGeniusResults function after the delay
      fetchGeniusResults($searchIndex);

      // Update the previous search query
      previousSearchQuery = $searchIndex;
    }, 500); // Adjust the delay as needed
  }
</script>

<div
  in:fly={{ y: 50, duration: 200 }}
  out:fly={{ y: 50, duration: 200 }}
  class="w-full rounded-xl mb-5 h-[50vh] bg-black/60 border-[1px] border-black/30 shadow-xl backdrop-blur-lg transition-all ease-in-out"
>
  {#if isLoading}
    <!-- Display "Loading" when fetching is in progress -->
    <div
      in:fade={{ duration: 100 }}
      out:fade={{ duration: 100 }}
      class="w-full h-full flex justify-center p-10"
    >
      <p class="text-white">Loading...</p>
    </div>
  {:else if !$searchIndex}
    <div
      in:fade={{ duration: 100 }}
      out:fade={{ duration: 100 }}
      class="w-full h-full flex justify-center p-10"
    >
      <img src={searchIdle} class="mix-blend- opacity-10" />
    </div>
  {:else}
    <!-- Display the fetched Genius results -->
    <ul class="w-full h-full overflow-scroll p-3">
      {#each geniusResults as result, index}
        <div

          in:fly|global={{ y: 50, duration: 200, delay: index * 100 }}
          out:fade|global={{ duration: 100 }}
        >
          <div
          on:click={() => UpdateSong(result)}
            class="flex cursor-pointer items-center border-white/20 p-3 active:bg-white/70 hover:bg-white/20 rounded-lg"
          >
            <img
              width="64"
              height="64"
              class="h-16 w-16 mr-5 rounded-md"
              src={result.image}
              alt="{result.title} Image"
            />
            <p class="text-white font-circular font-extralight w-full">
              {result.title} ·
              <span class="text-white/50">{result.artist}</span>
            </p>
          </div>
          {#if index !== geniusResults.length - 1}
            <div class="h-[1px] w-full bg-white/10 my-4" />
          {/if}
        </div>
      {/each}
    </ul>
  {/if}
</div>
