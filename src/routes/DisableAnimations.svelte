<script>
  import Youtube from "$lib/Youtube.svelte";
  import Prism from "./Prism.svelte";

  let play = false;
  let currentTime = 0;
  let isPlaying = false;
</script>

<h2>Reactive playback controls</h2>
<p>
  Drive the player with Svelte bindings. Toggle `play`, read `isPlaying`, and
  inspect `currentTime` in your own UI.
</p>

<button type="button" class="demo-toggle" onclick={() => (play = !play)}>
  {play ? "Pause" : "Play"}
</button>

<Youtube
  id="EBtsu6naB8g"
  startAt="45"
  bind:play
  bind:isPlaying
  bind:currentTime
/>

<p class="demo-meta">
  Playing: {isPlaying ? "yes" : "no"} • Current second: {Math.round(currentTime)}
</p>

<Prism
  code={`<script>
  import Youtube from "svelte-youtube-embed";
  let play = false;
  let isPlaying = false;
  let currentTime = 0;
</script>

<Youtube
  id="EBtsu6naB8g"
  startAt="45"
  bind:play
  bind:isPlaying
  bind:currentTime
/>
`}
/>

<style>
  .demo-toggle {
    margin-bottom: 1rem;
  }

  .demo-meta {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: var(--demo-meta-color, #555);
  }
</style>
