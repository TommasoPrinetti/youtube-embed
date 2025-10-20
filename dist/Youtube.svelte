<script>
  import Button from "./Button.svelte";
  import Iframe from "./Iframe.svelte";
  import Image from "./Image.svelte";

  let {
    id = "",
    title: providedTitle = "",
    titleFallback = "",
    fetchTitle = true,
    altThumb = false,
    thumbnailQuality = "",
    thumbnail,
    play_button,
    short = false,
    aspectRatio = null,
    overlayLabel = "",
    overlayFocusable = true,
    showTitle = true,
    animations: _deprecatedAnimations = false,
    playLabel = "Play YouTube video",
    timestamp = null,
    startAt = null,
    play = $bindable(false),
    currentTime = $bindable(0),
    isPlaying = $bindable(false),
    playerVars = {},
    trackerInterval = 500,
    noCookie = true,
    muted = false,
    allowFullscreen = true,
  } = $props();

  let fetchedTitle = $state("");
  let fetchedWidth = $state(0);
  let fetchedHeight = $state(0);
  let hasPlayer = $state(false);
  let lastRequestedId = $state("");
  let requestToken = 0;

  const videoTitle = $derived(
    providedTitle || fetchedTitle || titleFallback || ""
  );
  const fetchedAspect = $derived(
    normaliseAspectRatio(fetchedWidth, fetchedHeight)
  );
  const aspect = $derived(
    aspectRatio || (short ? "9/16" : fetchedAspect || "16/9")
  );
  const aspectParts = $derived(parseRatio(aspect));
  const aspectWidth = $derived(aspectParts.width);
  const aspectHeight = $derived(aspectParts.height);
  const requestedStart = $derived(startAt ?? timestamp ?? 0);
  const resolvedOverlayLabel = $derived(
    overlayLabel || (videoTitle ? `Play ${videoTitle}` : "Play video")
  );
  const resolvedPlayerVars = $derived(
    playerVars && typeof playerVars === "object" ? playerVars : {}
  );
  const canMountPlayer = $derived(hasPlayer && Boolean(id));

  $effect(() => {
    if (play && !hasPlayer) {
      hasPlayer = true;
    }
  });

  $effect(() => {
    if (
      typeof window !== "undefined" &&
      fetchTitle &&
      !providedTitle &&
      id &&
      id !== lastRequestedId
    ) {
      lastRequestedId = id;
      fetchedTitle = "";
      fetchedWidth = 0;
      fetchedHeight = 0;
      fetchVideoTitle(id);
    }
  });

  $effect(() => {
    if (
      typeof window !== "undefined" &&
      _deprecatedAnimations !== false &&
      _deprecatedAnimations !== undefined
    ) {
      console.warn(
        "The `animations` prop is deprecated and no longer has any effect."
      );
    }
  });

  async function fetchVideoTitle(videoId) {
    if (typeof fetch !== "function") return;
    const token = ++requestToken;

    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
      );
      if (!response.ok) {
        throw new Error(`Unable to retrieve metadata for video: ${videoId}`);
      }
      const payload = await response.json();
      if (token === requestToken) {
        fetchedTitle = payload?.title ?? "";
        fetchedWidth =
          Number(payload?.width) ||
          Number(payload?.thumbnail_width) ||
          0;
        fetchedHeight =
          Number(payload?.height) ||
          Number(payload?.thumbnail_height) ||
          0;
      }
    } catch (error) {
      console.warn(error);
      if (token === requestToken) {
        fetchedTitle = titleFallback ? titleFallback : "";
        fetchedWidth = 0;
        fetchedHeight = 0;
      }
    }
  }

  function activatePlayer() {
    if (!hasPlayer) {
      hasPlayer = true;
    }
    if (!play) {
      play = true;
    }
  }

  function handleOverlayKeydown(event) {
    if (event.key === "Enter" || event.key === " " || event.code === "Space") {
      event.preventDefault();
      activatePlayer();
    }
  }

  function parseRatio(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return { width: value, height: 1 };
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        const numeric = Number(trimmed);
        if (Number.isFinite(numeric) && numeric > 0) {
          return { width: numeric, height: 1 };
        }
      }

      const ratioMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
      if (ratioMatch) {
        const width = Number(ratioMatch[1]);
        const height = Number(ratioMatch[2]);
        if (width > 0 && height > 0) {
          return { width, height };
        }
      }
    }

    return { width: 16, height: 9 };
  }

  function normaliseAspectRatio(width, height) {
    const w = Number(width);
    const h = Number(height);
    if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) {
      return "";
    }

    const roundedW = Math.max(1, Math.round(w));
    const roundedH = Math.max(1, Math.round(h));
    const divisor = greatestCommonDivisor(roundedW, roundedH);
    return `${roundedW / divisor}/${roundedH / divisor}`;
  }

  function greatestCommonDivisor(a, b) {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y) {
      const temp = y;
      y = x % y;
      x = temp;
    }
    return x || 1;
  }
</script>

<div
  class="you__tube"
  style="--aspect-width:{aspectWidth}; --aspect-height:{aspectHeight}"
  title={videoTitle || undefined}
>
  <div class="you__content">
    {#if canMountPlayer}
      <Iframe
        {id}
        title={videoTitle}
        bind:play
        bind:currentTime
        bind:isPlaying
        startAt={requestedStart}
        playerVars={resolvedPlayerVars}
        {trackerInterval}
        {noCookie}
        {muted}
        {allowFullscreen}
      />
    {:else}
      <Image
        {id}
        title={videoTitle}
        {altThumb}
        {short}
        {thumbnail}
        {thumbnailQuality}
      />
      <div
        class="b__overlay"
        role="button"
        aria-label={resolvedOverlayLabel}
        tabindex={overlayFocusable ? 0 : undefined}
        onclick={activatePlayer}
        onkeydown={handleOverlayKeydown}
      ></div>
      {#if showTitle && videoTitle}
        <div class="v__title">{videoTitle}</div>
      {/if}
      <Button bind:play {play_button} label={playLabel}></Button>
    {/if}
  </div>
</div>

<style>
  .you__tube {
    position: relative;
    width: 100%;
    overflow: hidden;
    font-family: inherit;
    color: inherit;
  }

  .you__tube::before {
    content: "";
    display: block;
    padding-top: calc(
      var(--aspect-height, 9) / var(--aspect-width, 16) * 100%
    );
  }

  .you__content {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .v__title {
    position: absolute;
    top: 0;
    width: 100%;
    background: linear-gradient(to bottom, hsla(0, 0%, 0%, 0.1), transparent);
    pointer-events: none;
    padding: 1rem;
    font-family: var(--title-font-family, inherit);
    font-size: clamp(12px, 2.5vw, 18px);
    color: var(--title-color, currentColor);
    font-weight: 400;
    text-shadow: 0px 1px 3px var(--title-shadow-color, rgba(0, 0, 0, 0.2));
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    max-height: 30%;
    box-sizing: border-box;
  }

  .b__overlay {
    position: absolute;
    inset: 0;
    width: 100%;
    cursor: pointer;
    transition: var(--overlay-transition, all 250ms ease-in-out);
    background: transparent;
  }

  .b__overlay:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
  }

  .you__tube:hover .b__overlay {
    background: var(--overlay-bg-color, rgba(0, 0, 0, 0.2));
  }
</style>
