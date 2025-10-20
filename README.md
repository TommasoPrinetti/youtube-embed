# Svelte YouTube Embed

Lazy-load YouTube videos while keeping full control over playback from your Svelte components.

## Highlights

- Render a lightweight thumbnail until the user (or your code) starts playback.
- Control the player with `bind:play`, `bind:isPlaying`, and `bind:currentTime`.
- Start at any timestamp (`startAt={42}` or `startAt="1m12s"`), even for Shorts.
- Provide custom thumbnails or play buttons with slots/snippets.
- Inherits your project's typography by default while still offering CSS variables for overrides.
- Uses the YouTube Iframe API behind the scenes—no zoom-in transition, no surprises.

## Installation

```bash
npm i -D svelte-youtube-embed
# or pnpm add -D svelte-youtube-embed
```

## Basic Usage

```svelte
<script>
  import Youtube from "svelte-youtube-embed";
</script>

<Youtube id="EBtsu6naB8g" />
```

## Reactive Control Example

```svelte
<script>
  import Youtube from "svelte-youtube-embed";

  let play = false;
  let isPlaying = false;
  let currentTime = 0;
</script>

<button onclick={() => (play = !play)}>
  {play ? "Pause" : "Play"}
</button>

<Youtube
  id="EBtsu6naB8g"
  bind:play
  bind:isPlaying
  bind:currentTime
/>

<p>
  Playing: {isPlaying ? "yes" : "no"} |
  Current second: {Math.round(currentTime)}
</p>
```

## Start at a Timestamp

```svelte
<Youtube id="EBtsu6naB8g" startAt="1m12s" />
<Youtube id="EBtsu6naB8g" startAt={133} />
```

## Custom UI

```svelte
<Youtube id="EBtsu6naB8g">
  {#snippet thumbnail()}
    <img src="/custom/thumbnail.jpg" alt="Custom thumbnail" />
  {/snippet}

  {#snippet play_button()}
    <button class="my-play">▶︎</button>
  {/snippet}
</Youtube>
```

## Key Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `""` | The YouTube video id. Required. |
| `play` | `bindable<boolean>` | `false` | Toggle playback programmatically. |
| `isPlaying` | `bindable<boolean>` | `false` | Reflects whether the player reports a playing/buffering state. |
| `currentTime` | `bindable<number>` | `0` | Updated with the player’s current time (seconds). |
| `startAt` / `timestamp` | `number \| string` | `0` | When playback should begin (`90`, `"1:30"`, `"1m30s"`). |
| `playerVars` | `Record<string, any>` | `{}` | Extra YouTube iframe parameters (e.g. `{ controls: 0 }`). |
| `muted` | `boolean` | `false` | Start the player muted. |
| `noCookie` | `boolean` | `true` | Use the `youtube-nocookie.com` host. |
| `allowFullscreen` | `boolean` | `true` | Toggle the `allowfullscreen` attribute. |
| `trackerInterval` | `number` | `500` | Milliseconds between current time updates. |
| `title` | `string` | `""` | Provide your own title to skip the oEmbed request. |
| `fetchTitle` | `boolean` | `true` | Fetch the title from the YouTube oEmbed endpoint. |
| `titleFallback` | `string` | `""` | Title to use when fetching fails. |
| `thumbnailQuality` | `string` | `"maxresdefault"` | Choose which YouTube thumbnail size to load. |
| `short` | `boolean` | `false` | Use a `9/16` aspect ratio (handy for Shorts). |
| `aspectRatio` | `string` | `null` | Override the aspect ratio (`"4/3"`, `"21/9"`, …). |
| `overlayLabel` | `string` | derived | Accessible label for the overlay element. |
| `overlayFocusable` | `boolean` | `true` | Disable to prevent the overlay from receiving focus. |
| `showTitle` | `boolean` | `true` | Toggle the gradient title overlay. |
| `playLabel` | `string` | `"Play YouTube video"` | Accessible label for the default play button. |

### Slots/Snippets

| Name | Purpose |
| --- | --- |
| `thumbnail` | Replace the default `<img>` placeholder. |
| `play_button` | Replace the default play button. |

> Uses the [Svelte 5 snippets syntax](https://svelte.dev/docs/svelte-components#slots-snippets).\
> Example: `{#snippet play_button()}<button>Play</button>{/snippet}`

## Styling

Fonts inherit from your global styles. A few CSS variables let you tweak colours or overlays:

- `--title-font-family`
- `--title-color`
- `--title-shadow-color`
- `--overlay-bg-color`
- `--overlay-transition`
- `--thumbnail-placeholder-bg`

Because the player itself is created by the YouTube API, use regular CSS to style the surrounding wrapper, or pass `playerVars` to hide controls.

## License

MIT © Svelte Themes
