<script lang="ts">
  import { lyricIndex, lyrics } from "$lib/stores";
  export let forceful = false;
  let progress = 0;

  // Watch for changes in the lyricIndex and update the progress accordingly
  $: {
    if ($lyrics.length > 0) {
      progress = ($lyricIndex / ($lyrics.length - 1)) * 100;
    }
  }
</script>

<div class="w-full flex items-end px-3">
  <div
    style="width: {forceful ? 100 : progress}%;"
    class="h-[3px] bg-white rounded-xl transition-all ease-in-out"
  />
  <div
    class="h-[3px] left-[0.75rem] right-[0.75rem] bg-white/40 absolute rounded-xl"
  />
</div>
