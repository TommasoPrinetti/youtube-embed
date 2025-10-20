export default Image;
type Image = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Image: import("svelte").Component<{
    id?: string;
    title?: string;
    altThumb?: boolean;
    thumbnail: any;
    thumbnailQuality?: string;
    loading?: string;
    decoding?: string;
    referrerPolicy?: string;
    short?: boolean;
}, {}, "">;
type $$ComponentProps = {
    id?: string;
    title?: string;
    altThumb?: boolean;
    thumbnail: any;
    thumbnailQuality?: string;
    loading?: string;
    decoding?: string;
    referrerPolicy?: string;
    short?: boolean;
};
