<script>
  import Youtube from "$lib/Youtube.svelte";
  import Prism from "./Prism.svelte";
</script>

<h1>YouTube Video Embed</h1>

<p>
  Render a lightweight thumbnail first and only boot the YouTube player when
  you decide to play the video.
</p>
<p>Control playback with Svelte bindings and start at any timestamp.</p>

<h2>Installation</h2>
<Prism code={`npm i -D svelte-youtube-embed`} />

<h2>Usage</h2>
<Prism
  code={`<script>
  import Youtube from "svelte-youtube-embed";
</script>

<Youtube id="EBtsu6naB8g" />
`}
/>

<h2>Default</h2>
<Youtube id="EBtsu6naB8g" />

<Prism code={`<Youtube id="EBtsu6naB8g" />`} />
