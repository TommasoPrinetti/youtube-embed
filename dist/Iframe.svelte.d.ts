export default Iframe;
type Iframe = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Iframe: import("svelte").Component<{
    id?: string;
    title?: string;
    startAt?: number;
    play?: boolean;
    currentTime?: number;
    isPlaying?: boolean;
    playerVars?: Record<string, any>;
    trackerInterval?: number;
    noCookie?: boolean;
    allowFullscreen?: boolean;
    muted?: boolean;
    origin?: string;
}, {}, "play" | "currentTime" | "isPlaying">;
type $$ComponentProps = {
    id?: string;
    title?: string;
    startAt?: number;
    play?: boolean;
    currentTime?: number;
    isPlaying?: boolean;
    playerVars?: Record<string, any>;
    trackerInterval?: number;
    noCookie?: boolean;
    allowFullscreen?: boolean;
    muted?: boolean;
    origin?: string;
};
