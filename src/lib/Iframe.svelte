<script>
  import { onDestroy, onMount } from "svelte";

  const YOUTUBE_IFRAME_API = "https://www.youtube.com/iframe_api";
  const DEFAULT_ALLOW =
    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

  let apiPromise;

  const YTState = {
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
  };

  let {
    id = "",
    title = "",
    startAt = 0,
    play = $bindable(false),
    currentTime = $bindable(0),
    isPlaying = $bindable(false),
    playerVars = {},
    trackerInterval = 500,
    noCookie = true,
    allowFullscreen = true,
    muted = false,
    origin = "",
  } = $props();

  let container;
  let player;
  let ready = $state(false);
  let trackingTimer = 0;
  let lastVideoId = "";
  let lastStartAt = -1;
  let lastTrackerInterval = trackerInterval;
  let lastPlayerVarsKey = "";

  const normalizedStartAt = $derived(normalizeTimestamp(startAt));
  const mergedPlayerVars = $derived(buildPlayerVars(origin, playerVars));
  const mergedPlayerVarsKey = $derived(JSON.stringify(mergedPlayerVars));

  $effect(() => {
    if (ready) {
      syncIframeAttributes();
    }
  });

  $effect(() => {
    if (ready && player) {
      if (muted) {
        player.mute?.();
      } else {
        player.unMute?.();
      }
    }
  });

  $effect(() => {
    if (!(ready && player)) return;
    if (trackerInterval !== lastTrackerInterval) {
      lastTrackerInterval = trackerInterval;
      startTracking();
    }
  });

  $effect(() => {
    if (!(ready && player && id)) return;
    if (id !== lastVideoId) {
      lastVideoId = id;
      if (play) {
        player.loadVideoById({
          videoId: id,
          startSeconds: normalizedStartAt,
        });
      } else {
        player.cueVideoById({
          videoId: id,
          startSeconds: normalizedStartAt,
        });
      }
      currentTime = normalizedStartAt;
    }
  });

  $effect(() => {
    if (!(ready && player)) return;
    if (normalizedStartAt !== lastStartAt) {
      lastStartAt = normalizedStartAt;
      player.seekTo(normalizedStartAt, true);
      if (!play) {
        player.pauseVideo?.();
      }
      currentTime = normalizedStartAt;
    }
  });

  $effect(() => {
    if (!(ready && player)) return;
    if (mergedPlayerVarsKey !== lastPlayerVarsKey) {
      lastPlayerVarsKey = mergedPlayerVarsKey;
      if (!id) return;

      if (play) {
        player.loadVideoById({
          videoId: id,
          startSeconds: normalizedStartAt,
        });
      } else {
        player.cueVideoById({
          videoId: id,
          startSeconds: normalizedStartAt,
        });
      }
      currentTime = normalizedStartAt;
    }
  });

  $effect(() => {
    if (ready) {
      applyPlayState(play);
    }
  });

  function ensureYouTubeAPI() {
    if (typeof window === "undefined") {
      return Promise.reject(
        new Error("YouTube Iframe API is only available in the browser.")
      );
    }

    if (window.YT && typeof window.YT.Player === "function") {
      return Promise.resolve(window.YT);
    }

    if (apiPromise) {
      return apiPromise;
    }

    apiPromise = new Promise((resolve, reject) => {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        resolve(window.YT);
      };

      const scriptExists = document.querySelector(
        `script[src="${YOUTUBE_IFRAME_API}"]`
      );

      if (!scriptExists) {
        const tag = document.createElement("script");
        tag.src = YOUTUBE_IFRAME_API;
        tag.async = true;
        tag.onerror = () =>
          reject(new Error("Failed to load the YouTube Iframe API."));
        document.head.append(tag);
      }
    });

    return apiPromise;
  }

  function normalizeTimestamp(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return Math.max(0, Math.floor(value));
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return 0;

      if (/^\d+$/.test(trimmed)) {
        return Math.max(0, parseInt(trimmed, 10));
      }

      if (/^(\d+:){0,2}\d+$/.test(trimmed)) {
        const parts = trimmed.split(":").map(Number).reverse();
        return Math.max(
          0,
          parts.reduce(
            (seconds, part, index) => seconds + part * Math.pow(60, index),
            0
          )
        );
      }

      const matches = trimmed.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
      if (matches) {
        const hours = parseInt(matches[1] ?? "0", 10);
        const minutes = parseInt(matches[2] ?? "0", 10);
        const seconds = parseInt(matches[3] ?? "0", 10);
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds) {
          return totalSeconds;
        }
      }
    }

    return 0;
  }

  function buildPlayerVars(baseOrigin, customVars) {
    const vars = {
      enablejsapi: 1,
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
    };

    const resolvedOrigin =
      typeof window !== "undefined" && !baseOrigin
        ? window.location.origin
        : baseOrigin;

    if (resolvedOrigin) {
      vars.origin = resolvedOrigin;
    }

    if (customVars && typeof customVars === "object") {
      for (const [key, value] of Object.entries(customVars)) {
        if (
          value === undefined ||
          value === null ||
          (typeof value === "string" && value.trim() === "")
        ) {
          continue;
        }

        vars[key] = typeof value === "boolean" ? (value ? 1 : 0) : value;
      }
    }

    return vars;
  }

  function syncIframeAttributes() {
    if (!player || typeof player.getIframe !== "function") return;
    const iframe = player.getIframe();
    if (!iframe) return;

    iframe.setAttribute("title", title || "YouTube video");
    iframe.setAttribute("allow", DEFAULT_ALLOW);

    if (allowFullscreen) {
      iframe.setAttribute("allowfullscreen", "true");
    } else {
      iframe.removeAttribute("allowfullscreen");
    }
  }

  function startTracking() {
    stopTracking();
    if (trackerInterval <= 0 || typeof window === "undefined") return;
    trackingTimer = window.setInterval(() => {
      if (!player || typeof player.getCurrentTime !== "function") return;
      const time = player.getCurrentTime();
      if (typeof time === "number" && Number.isFinite(time)) {
        currentTime = time;
      }
    }, trackerInterval);
  }

  function stopTracking() {
    if (trackingTimer) {
      clearInterval(trackingTimer);
      trackingTimer = 0;
    }
  }

  function applyPlayState(shouldPlay) {
    if (!player) return;
    if (shouldPlay) {
      player.playVideo?.();
    } else {
      player.pauseVideo?.();
    }
  }

  function handleReady() {
    lastPlayerVarsKey = mergedPlayerVarsKey;
    lastVideoId = id;
    lastStartAt = normalizedStartAt;
    ready = true;
    syncIframeAttributes();

    if (muted) {
      player.mute?.();
    }

    if (normalizedStartAt > 0) {
      player.seekTo(normalizedStartAt, true);
      currentTime = normalizedStartAt;
      if (!play) {
        player.pauseVideo?.();
      }
    } else if (!play) {
      player.pauseVideo?.();
    }

    if (play) {
      player.playVideo?.();
    }

    startTracking();
  }

  function handleStateChange(event) {
    const state = event?.data;
    const currentlyPlaying =
      state === YTState.PLAYING || state === YTState.BUFFERING;
    const hasEnded = state === YTState.ENDED;
    const isPaused = state === YTState.PAUSED;

    isPlaying = currentlyPlaying;

    if (currentlyPlaying && !play) {
      play = true;
    }

    if ((isPaused || hasEnded) && play) {
      play = false;
    }

    if (hasEnded) {
      currentTime = player?.getDuration?.() ?? currentTime;
    } else if (isPaused) {
      const time = player?.getCurrentTime?.();
      if (typeof time === "number" && Number.isFinite(time)) {
        currentTime = time;
      }
    }
  }

  onMount(() => {
    let cancelled = false;

    ensureYouTubeAPI()
      .then((YT) => {
        if (cancelled || !container) return;
        player = new YT.Player(container, {
          videoId: id,
          width: "100%",
          height: "100%",
          host: noCookie
            ? "https://www.youtube-nocookie.com"
            : "https://www.youtube.com",
          playerVars: mergedPlayerVars,
          events: {
            onReady: handleReady,
            onStateChange: handleStateChange,
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  });

  onDestroy(() => {
    stopTracking();
    player?.destroy?.();
    player = undefined;
  });
</script>

<div class="yt__iframe" bind:this={container} aria-live="off"></div>

<style>
  .yt__iframe {
    height: 100%;
    width: 100%;
  }
</style>
