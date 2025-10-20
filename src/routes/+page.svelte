<script>
  import Youtube from "$lib/Youtube.svelte";

  const installCommand = "npm i -D svelte-youtube-embed";
  const quickstartSnippet = `<script>
  import Youtube from "svelte-youtube-embed";

  let play = false;
<\/script>

<button onclick={() => (play = !play)}>
  {play ? "Pause" : "Play"}
</button>

<Youtube id="EBtsu6naB8g" bind:play />`;

  const controlledSnippet = `<script>
  import Youtube from "svelte-youtube-embed";

  let play = false;
  let currentTime = 0;
  let isPlaying = false;
<\/script>

<Youtube
  id="KrSH82gg7BQ"
  startAt="45"
  bind:play
  bind:currentTime
  bind:isPlaying
/>`;

  const customSnippet = `<Youtube
  id="q2Y3f0lHnMs"
  playLabel="Play typography demo"
  overlayLabel="Play typography demo"
>
  {#snippet play_button()}
    <button class="pill">Watch</button>
  {/snippet}

  {#snippet thumbnail()}
    <img
      src="/path/to/custom-thumbnail.jpg"
      alt="Custom preview"
    />
  {/snippet}
</Youtube>`;

  const keyOptions = [
    {
      name: "startAt / timestamp",
      description:
        "Accepts numbers, hh:mm:ss, or 1m30s strings to begin playback from a specific point.",
    },
    {
      name: "bind:currentTime",
      description:
        "Keeps a reactive number with the player’s current second so you can display progress.",
    },
    {
      name: "bind:play & bind:isPlaying",
      description:
        "Toggle playback from your own UI and mirror the player state for analytics or buttons.",
    },
    {
      name: "playerVars",
      description:
        "Forward advanced YouTube iframe options such as { controls: 0, loop: 1 }.",
    },
    {
      name: "thumbnailQuality",
      description:
        "Pick which YouTube thumbnail to load (maxresdefault, sddefault, ...), or provide your own.",
    },
    {
      name: "short / aspectRatio",
      description:
        "Switch to the 9/16 layout for Shorts or supply an explicit ratio like \"4/3\".",
    },
  ];

  let controlledPlay = $state(false);
  let controlledTime = $state(0);
  let controlledIsPlaying = $state(false);

  let customPlay = $state(false);
  let customTime = $state(0);

  let shortPlay = $state(false);
</script>

<main class="page">
  <section class="hero">
    <div class="hero__copy">
      <h1>Svelte YouTube embeds without the iframe baggage</h1>
      <p>
        Drop in a lightweight thumbnail, then let the component hydrate a real YouTube player the moment you
        decide to play. Control everything with plain Svelte bindings.
      </p>
      <div class="hero__actions">
        <a class="button primary" href="https://www.npmjs.com/package/svelte-youtube-embed" rel="noopener">
          View on npm
        </a>
        <a class="button secondary" href="/sandbox">
          Explore sandbox
        </a>
      </div>
    </div>
    <div class="hero__embed">
      <Youtube
        id="EBtsu6naB8g"
        startAt="30"
        overlayLabel="Play hero example"
        playLabel="Play hero example"
      />
    </div>
  </section>

  <section class="section">
    <h2>1. Install and drop the component in place</h2>
    <p>The package ships as a Svelte component. Install it and import it like any other piece of UI.</p>
    <div class="code-block">
      <pre><code>{installCommand}</code></pre>
      <pre><code>{quickstartSnippet}</code></pre>
    </div>
    <div class="example-card">
      <h3>Default embed</h3>
      <p>No props required—just pass an id.</p>
      <Youtube id="EBtsu6naB8g" overlayLabel="Play default example" playLabel="Play default example" />
    </div>
  </section>

  <section class="section">
    <h2>2. Control playback with Svelte bindings</h2>
    <p>
      Bind to <code>play</code>, <code>currentTime</code>, and <code>isPlaying</code> to keep the player in sync with your own
      controls or analytics.
    </p>
    <div class="code-block">
      <pre><code>{controlledSnippet}</code></pre>
    </div>
    <div class="example-card grid">
      <div class="example-card__controls">
        <button class="button secondary" onclick={() => (controlledPlay = !controlledPlay)}>
          {controlledPlay ? "Pause video" : "Play video"}
        </button>
        <button class="button ghost" onclick={() => (controlledPlay = false)}>
          Stop
        </button>
        <dl>
          <div>
            <dt>Playing</dt>
            <dd>{controlledIsPlaying ? "true" : "false"}</dd>
          </div>
          <div>
            <dt>Current time</dt>
            <dd>{controlledTime.toFixed(1)}s</dd>
          </div>
        </dl>
      </div>
      <Youtube
        id="KrSH82gg7BQ"
        startAt="45"
        bind:play={controlledPlay}
        bind:currentTime={controlledTime}
        bind:isPlaying={controlledIsPlaying}
        overlayLabel="Play controlled example"
        playLabel="Play controlled example"
        trackerInterval={250}
      />
    </div>
  </section>

  <section class="section">
    <h2>3. Customise the visuals</h2>
    <p>
      Supply your own play button or thumbnail through snippets and inherit fonts/colours from the rest of your app.
    </p>
    <div class="code-block">
      <pre><code>{customSnippet}</code></pre>
    </div>
    <div class="example-card stack">
      <Youtube
        id="q2Y3f0lHnMs"
        bind:play={customPlay}
        bind:currentTime={customTime}
        overlayLabel="Play custom example"
        playLabel="Play custom example"
        style="--title-font-family:'Merriweather', serif; --title-color:#f8fafc;"
      >
        {#snippet play_button()}
          <button type="button" class="pill">Watch</button>
        {/snippet}
        {#snippet thumbnail()}
          <img
            src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=75"
            alt="Custom thumbnail"
          />
        {/snippet}
      </Youtube>
      <p class="example-card__meta">
        Current time: {customTime.toFixed(1)}s
      </p>
      <button class="button secondary" onclick={() => (customPlay = !customPlay)}>
        {customPlay ? "Pause" : "Play"}
      </button>
    </div>
  </section>

  <section class="section">
    <h2>4. Built-in support for Shorts and custom ratios</h2>
    <p>
      The component reads the video’s native aspect ratio from YouTube. Use the <code>short</code> flag or set
      <code>aspectRatio</code> when you need something different.
    </p>
    <div class="example-card grid">
      <Youtube
        id="l2bXQI7Sn90"
        short
        bind:play={shortPlay}
        overlayLabel="Play short example"
        playLabel="Play short example"
      />
      <div class="example-card__controls">
        <p>
          This example uses the <code>short</code> prop to lock in the 9/16 layout. Try toggling playback:
        </p>
        <button class="button secondary" onclick={() => (shortPlay = !shortPlay)}>
          {shortPlay ? "Pause short" : "Play short"}
        </button>
      </div>
    </div>
  </section>

  <section class="section">
    <h2>Key options at a glance</h2>
    <ul class="options">
      {#each keyOptions as option}
        <li>
          <strong>{option.name}</strong>
          <span>{option.description}</span>
        </li>
      {/each}
    </ul>
  </section>

  <section class="section final">
    <h2>What next?</h2>
    <p>
      Head over to the interactive sandbox for every prop and snippet combination, or read the README for the full API.
    </p>
    <div class="hero__actions">
      <a class="button primary" href="/sandbox">Open sandbox</a>
      <a class="button secondary" href="https://github.com/sharu725/youtube-embed" rel="noopener">
        View source
      </a>
    </div>
  </section>
</main>

<svelte:head>
  <title>Svelte YouTube Embed</title>
  <meta
    name="description"
    content="Guide to the Svelte YouTube Embed component with setup instructions, bindings, styling, and Shorts support."
  />
</svelte:head>

<style>
  :global(body) {
    margin: 0;
    background: #f8fafc;
    color: #0f172a;
    font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
  }

  code {
    font-family: "Fira Code", "SFMono-Regular", Consolas, monospace;
  }

  .page {
    max-width: 960px;
    margin: 0 auto;
    padding: clamp(1.5rem, 3vw, 3rem) clamp(1rem, 4vw, 2.5rem) 4rem;
    display: grid;
    gap: clamp(2.5rem, 5vw, 3.5rem);
  }

  .hero {
    display: grid;
    gap: clamp(1.5rem, 4vw, 2.5rem);
    align-items: start;
  }

  .hero__copy h1 {
    font-size: clamp(2.2rem, 4vw, 2.75rem);
    margin: 0 0 0.75rem;
  }

  .hero__copy p {
    margin: 0 0 1.25rem;
    line-height: 1.6;
  }

  .hero__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  .hero__embed {
    background: #0f172a;
    padding: clamp(1rem, 2vw, 1.5rem);
    border-radius: 1.25rem;
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.18);
    align-self: start;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    padding: 0.65rem 1.35rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    border: 1px solid transparent;
  }

  .button.primary {
    background: #e11d48;
    color: #fff;
  }

  .button.primary:hover {
    background: #be123c;
  }

  .button.secondary {
    background: #fff;
    color: #0f172a;
    border-color: rgba(15, 23, 42, 0.1);
  }

  .button.secondary:hover {
    background: #e2e8f0;
  }

  .button.ghost {
    background: transparent;
    color: #0f172a;
    border-color: rgba(15, 23, 42, 0.15);
  }

  .section h2 {
    margin: 0 0 0.75rem;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  .section p {
    margin: 0 0 1rem;
    line-height: 1.6;
  }

  .code-block {
    display: grid;
    gap: 0.75rem;
  }

  pre {
    margin: 0;
    padding: 1rem 1.25rem;
    background: #0f172a;
    color: #f8fafc;
    border-radius: 0.9rem;
    overflow-x: auto;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .example-card {
    background: #fff;
    border-radius: 1.25rem;
    padding: clamp(1rem, 2vw, 1.5rem);
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    display: grid;
    gap: 1rem;
  }

  .example-card h3 {
    margin: 0;
  }

  .example-card.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.25rem;
    align-items: stretch;
  }

  .example-card.grid > :global(.you__tube) {
    flex: 1 1 340px;
    min-width: min(100%, 320px);
  }

  .example-card.stack {
    align-items: start;
  }

  .example-card__controls {
    display: grid;
    gap: 0.75rem;
    flex: 1 0 220px;
    min-width: min(100%, 220px);
  }

  .example-card__controls dl {
    margin: 0;
    display: grid;
    gap: 0.35rem;
    font-size: 0.9rem;
  }

  .example-card__controls dt {
    font-weight: 600;
  }

  .example-card__controls dd {
    margin: 0;
    color: #475569;
  }

  .example-card__meta {
    margin: 0;
    color: #475569;
    font-size: 0.9rem;
  }

  .pill {
    all: unset;
    padding: 0.6rem 1.4rem;
    border-radius: 9999px;
    background: rgba(15, 23, 42, 0.8);
    color: #f8fafc;
    font-weight: 600;
    cursor: pointer;
  }

  .options {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.75rem;
  }

  .options li {
    background: #fff;
    padding: 0.9rem 1.1rem;
    border-radius: 0.9rem;
    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);
    display: grid;
    gap: 0.35rem;
  }

  .options strong {
    font-weight: 600;
  }

  .options span {
    color: #475569;
    font-size: 0.95rem;
  }

  .final {
    text-align: center;
  }

  .final .hero__actions {
    justify-content: center;
  }

  @media (max-width: 720px) {
    .hero__embed {
      border-radius: 1rem;
    }

    .example-card.grid {
      grid-template-columns: 1fr;
    }
  }
</style>
