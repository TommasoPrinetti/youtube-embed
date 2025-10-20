export default Button;
type Button = {
    $on?(type: string, callback: (e: any) => void): () => void;
    $set?(props: Partial<$$ComponentProps>): void;
};
declare const Button: import("svelte").Component<{
    play_button: any;
    play?: any;
    label?: string;
}, {}, "play">;
type $$ComponentProps = {
    play_button: any;
    play?: any;
    label?: string;
};
