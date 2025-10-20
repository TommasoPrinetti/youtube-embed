<script>
  import Youtube from "$lib/Youtube.svelte";

  const thumbnailOptions = [
    "maxresdefault",
    "sddefault",
    "hqdefault",
    "mqdefault",
  ];

  let videoId = $state("EBtsu6naB8g");
  let play = $state(false);
  let isPlaying = $state(false);
  let currentTime = $state(0);
  let startAtInput = $state("45");

  let overlayLabel = $state("Play this video");
  let playLabel = $state("Play YouTube video");
  let overlayFocusable = $state(true);
  let showTitle = $state(true);
  let allowFullscreen = $state(true);
  let noCookie = $state(true);
  let altThumb = $state(false);
  let useThumbnailQuality = $state(true);
  let thumbnailQuality = $state("maxresdefault");
  let useCustomThumbnail = $state(false);
  let useCustomButton = $state(false);
  let hideControls = $state(false);
  let loopVideo = $state(false);
  let muted = $state(false);
  let trackerIntervalInput = $state("250");
  let aspectOption = $state("default");
  let customAspect = $state("21/9");
  let fontChoice = $state("inherit");

  const startAt = $derived(
    (() => {
      const trimmed = startAtInput.trim();
      return trimmed ? trimmed : 0;
    })()
  );

  const trackerInterval = $derived(
    (() => {
      const parsed = parseInt(trackerIntervalInput, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    })()
  );

  const short = $derived(aspectOption === "short");
  const aspectRatio = $derived(
    aspectOption === "custom" ? customAspect.trim() || null : null
  );

  const playerVars = $derived(
    (() => {
      const vars = {
        controls: hideControls ? 0 : 1,
        modestbranding: 1,
      };
      if (loopVideo) {
        vars.loop = 1;
        if (videoId) {
          vars.playlist = videoId;
        }
      }
      return vars;
    })()
  );

  const thumbnailQualityProp = $derived(
    useThumbnailQuality ? thumbnailQuality : ""
  );

  const titleFontFamily = $derived(
    (() => {
      if (fontChoice === "serif") return '"Merriweather", serif';
      if (fontChoice === "mono") return '"Fira Mono", monospace';
      return "inherit";
    })()
  );

  const diagnostics = $derived({
    play,
    isPlaying,
    currentTime,
    startAt,
    trackerInterval,
    playerVars,
  });
</script>

<main class="sandbox">
  <section class="controls">
    <h1>Interactive demo</h1>
    <p>
      Tweak any prop below and watch the embed react in real time. Everything is
      driven through Svelte bindings.
    </p>

    <button
      type="button"
      class="primary"
      onclick={() => (play = !play)}
    >
      {play ? "Pause video" : "Play video"}
    </button>

    <div class="grid">
      <label>
        <span>Video ID</span>
        <input
          name="videoId"
          placeholder="YouTube video id"
          bind:value={videoId}
        />
      </label>

      <label>
        <span>Start at</span>
        <input
          name="startAt"
          placeholder="e.g. 90 or 1m30s"
          bind:value={startAtInput}
        />
      </label>

      <label>
        <span>Overlay label</span>
        <input
          name="overlayLabel"
          placeholder="Accessible overlay label"
          bind:value={overlayLabel}
        />
      </label>

      <label>
        <span>Play button label</span>
        <input
          name="playLabel"
          placeholder="Accessible play label"
          bind:value={playLabel}
        />
      </label>

      <label>
        <span>Tracker interval (ms)</span>
        <input
          name="trackerInterval"
          type="number"
          min="0"
          step="50"
          bind:value={trackerIntervalInput}
        />
      </label>

      <label>
        <span>Aspect ratio</span>
        <select bind:value={aspectOption}>
          <option value="default">Default (16/9)</option>
          <option value="short">Short (9/16)</option>
          <option value="custom">Custom</option>
        </select>
      </label>

      {#if aspectOption === "custom"}
        <label>
          <span>Custom ratio</span>
          <input
            name="customAspect"
            placeholder="e.g. 4/3"
            bind:value={customAspect}
          />
        </label>
      {/if}

      <label>
        <span>Font family</span>
        <select bind:value={fontChoice}>
          <option value="inherit">Inherit (default)</option>
          <option value="serif">Serif</option>
          <option value="mono">Monospace</option>
        </select>
      </label>

      <label>
        <span>Thumbnail quality</span>
        <select bind:value={thumbnailQuality} disabled={!useThumbnailQuality}>
          {#each thumbnailOptions as option}
            <option value={option}>{option}</option>
          {/each}
        </select>
      </label>
    </div>

    <fieldset class="toggles">
      <legend>Flags</legend>
      <label><input type="checkbox" bind:checked={play} /> Force play</label>
      <label><input type="checkbox" bind:checked={muted} /> Muted</label>
      <label><input type="checkbox" bind:checked={hideControls} /> Hide controls</label>
      <label><input type="checkbox" bind:checked={loopVideo} /> Loop video</label>
      <label><input type="checkbox" bind:checked={altThumb} /> Alt thumbnail</label>
      <label><input type="checkbox" bind:checked={useThumbnailQuality} /> Override thumbnail quality</label>
      <label><input type="checkbox" bind:checked={useCustomThumbnail} /> Custom thumbnail snippet</label>
      <label><input type="checkbox" bind:checked={useCustomButton} /> Custom play snippet</label>
      <label><input type="checkbox" bind:checked={showTitle} /> Show title overlay</label>
      <label><input type="checkbox" bind:checked={overlayFocusable} /> Overlay focusable</label>
      <label><input type="checkbox" bind:checked={allowFullscreen} /> Allow fullscreen</label>
      <label><input type="checkbox" bind:checked={noCookie} /> Use youtube-nocookie</label>
    </fieldset>
  </section>

  <section
    class="preview"
    class:serif={fontChoice === "serif"}
    class:mono={fontChoice === "mono"}
  >
    <Youtube
      id={videoId}
      bind:play
      bind:isPlaying
      bind:currentTime
      startAt={startAt}
      playLabel={playLabel}
      overlayLabel={overlayLabel}
      overlayFocusable={overlayFocusable}
      showTitle={showTitle}
      {altThumb}
      thumbnailQuality={thumbnailQualityProp}
      short={short}
      aspectRatio={aspectRatio}
      {muted}
      {allowFullscreen}
      {noCookie}
      {playerVars}
      trackerInterval={trackerInterval}
      style={`--title-font-family:${titleFontFamily};`}
    >
      {#if useCustomThumbnail}
        {#snippet thumbnail()}
          <img
            src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80"
            alt="Custom thumbnail illustration"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
        {/snippet}
      {/if}

      {#if useCustomButton}
        {#snippet play_button()}
          <button type="button" class="custom-play">▶</button>
        {/snippet}
      {/if}
    </Youtube>

    <div class="readout">
      <span>Playing: {isPlaying ? "yes" : "no"}</span>
      <span>Current time: {typeof currentTime === "number" ? currentTime.toFixed(1) : currentTime}s</span>
    </div>

    <pre class="vars">{JSON.stringify(diagnostics, null, 2)}</pre>
  </section>
</main>

<style>
  .sandbox {
    display: grid;
    gap: 2rem;
    padding: 2rem clamp(1rem, 4vw, 4rem);
    grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  }

  .controls {
    display: grid;
    align-content: start;
    gap: 1.5rem;
  }

  .controls h1 {
    margin: 0;
    font-size: clamp(1.5rem, 3vw, 2rem);
  }

  .controls p {
    margin: 0;
    color: #475467;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .primary {
    border: none;
    border-radius: 0.5rem;
    background: #ff4e45;
    color: #fff;
    font-weight: 600;
    padding: 0.75rem 1.25rem;
    cursor: pointer;
    transition: transform 120ms ease;
  }

  .primary:hover {
    transform: translateY(-1px);
  }

  .grid {
    display: grid;
    gap: 1rem;
  }

  label {
    display: grid;
    gap: 0.35rem;
    font-size: 0.85rem;
    color: #1f2937;
  }

  label span {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.7rem;
    color: #6b7280;
  }

  input,
  select {
    font: inherit;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: #fff;
  }

  input:focus,
  select:focus {
    outline: 2px solid #2563eb;
    outline-offset: 1px;
  }

  fieldset {
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1rem;
  }

  fieldset legend {
    padding: 0 0.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    color: #6b7280;
  }

  .toggles {
    display: grid;
    gap: 0.45rem;
  }

  .toggles label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-weight: 500;
  }

  .toggles input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
  }

  .preview {
    display: grid;
    gap: 1rem;
    align-content: start;
  }

  .preview.serif {
    font-family: "Merriweather", serif;
  }

  .preview.mono {
    font-family: "Fira Mono", monospace;
  }

  .custom-play {
    all: unset;
    display: grid;
    place-items: center;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    font-size: 2rem;
    cursor: pointer;
    transition: background 120ms ease;
  }

  .custom-play:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  .readout {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
    color: #1f2937;
  }

  .vars {
    margin: 0;
    padding: 1rem;
    border-radius: 0.75rem;
    background: #0f172a;
    color: #f8fafc;
    font-size: 0.8rem;
    overflow: auto;
  }

  @media (max-width: 960px) {
    .sandbox {
      grid-template-columns: 1fr;
    }
  }
</style>
