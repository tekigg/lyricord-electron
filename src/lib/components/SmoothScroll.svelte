<!-- SmoothScroll.svelte -->
<script>
    export let elementId;
  
    // This reactive statement watches for changes in elementId and scrolls accordingly
    $: {
      const element = document.getElementById(elementId);
  
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  </script>
  