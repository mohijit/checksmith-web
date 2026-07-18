/* tslint:disable */
/* eslint-disable */

export class Game {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Let the engine think for up to `movetime_ms` and play its chosen
     * move. If `use_nnue` is true but a network hasn't been loaded yet
     * (see `load_nnue_bytes`), silently falls back to the fast handcrafted
     * evaluator — the result's `nnue_used` field reports which actually
     * happened so the UI can say so rather than misrepresent the strength.
     */
    engine_move(movetime_ms: number, use_nnue: boolean): any;
    fen(): string;
    has_nnue(): boolean;
    in_check(): boolean;
    is_checkmate(): boolean;
    is_draw(): boolean;
    is_stalemate(): boolean;
    legal_moves_uci(): string[];
    /**
     * Parse `bytes` as a `.nnue` file and, on success, use it for future
     * `engine_move(_, use_nnue: true)` calls. Returns false on malformed
     * bytes; the caller should treat that as "Strong mode unavailable."
     */
    load_nnue_bytes(bytes: Uint8Array): boolean;
    constructor(fen?: string | null);
    /**
     * Resets board/history/TT for a new game. Deliberately keeps any
     * already-loaded NNUE network so picking Strong difficulty again
     * doesn't force a redundant ~40MB re-fetch.
     */
    new_game(fen?: string | null): void;
    /**
     * Apply the player's move (UCI notation, e.g. "e2e4" or "e7e8q" for
     * promotion). Returns a result with `ok: false` if `uci` isn't a legal
     * move in the current position.
     */
    player_move(uci: string): any;
    turn(): string;
}

export function main(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_game_free: (a: number, b: number) => void;
    readonly game_engine_move: (a: number, b: number, c: number) => any;
    readonly game_fen: (a: number) => [number, number];
    readonly game_has_nnue: (a: number) => number;
    readonly game_in_check: (a: number) => number;
    readonly game_is_checkmate: (a: number) => number;
    readonly game_is_draw: (a: number) => number;
    readonly game_is_stalemate: (a: number) => number;
    readonly game_legal_moves_uci: (a: number) => [number, number];
    readonly game_load_nnue_bytes: (a: number, b: number, c: number) => number;
    readonly game_new: (a: number, b: number) => number;
    readonly game_new_game: (a: number, b: number, c: number) => void;
    readonly game_player_move: (a: number, b: number, c: number) => any;
    readonly game_turn: (a: number) => [number, number];
    readonly main: () => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
