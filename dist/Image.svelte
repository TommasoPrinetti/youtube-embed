<script>
  let {
    id = "",
    title = "",
    altThumb = false,
    thumbnail,
    thumbnailQuality = "",
    loading = "lazy",
    decoding = "async",
    referrerPolicy = "no-referrer",
    short = false,
  } = $props();

  const quality = $derived(
    (() => {
      const base =
        thumbnailQuality || (altThumb ? "hqdefault" : "maxresdefault");
      if (typeof base === "string") {
        return base.trim();
      }
      return base == null ? "" : String(base).trim();
    })()
  );

  const thumbnailSrc = $derived(
    id && quality ? `https://i.ytimg.com/vi/${id}/${quality}.jpg` : ""
  );
</script>

<div class="yt__thumb" aria-hidden="true">
  {#if thumbnail}
    {@render thumbnail()}
  {:else if thumbnailSrc}
    <img
      src={thumbnailSrc}
      alt={title ? `YouTube video: ${title}` : "YouTube video thumbnail"}
      title={title || undefined}
      loading={loading}
      decoding={decoding}
      referrerpolicy={referrerPolicy}
      class:short-thumbnail={short}
    />
  {:else}
    <div class="thumbnail__placeholder"></div>
  {/if}
</div>

<style>
  :global(.yt__thumb) {
    width: 100%;
    height: 100%;
  }

  :global(.yt__thumb img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    aspect-ratio: calc(
      var(--aspect-width, 16) / var(--aspect-height, 9)
    );
  }

  .short-thumbnail {
    object-fit: cover;
    object-position: center;
    height: 100%;
    max-width: none;
  }

  .thumbnail__placeholder {
    background: var(--thumbnail-placeholder-bg, rgba(0, 0, 0, 0.1));
    width: 100%;
    height: 100%;
  }
</style>
