// Dedicated Worker owning the WASM engine. Runs entirely off the main
// thread, so a blocking synchronous `engine_move` call (up to a few seconds
// at Strong difficulty) never freezes the page — no in-wasm threading is
// used or needed.
import init, { Game } from "./pkg/checksmith_wasm.js";

let game = null;
let nnueLoading = false;

async function ensureInit() {
  if (!game) {
    await init();
    game = new Game(undefined);
  }
}

// fetch() doesn't expose download progress directly — read the body stream
// manually and accumulate against Content-Length to report percentage.
async function loadNnue() {
  if (game.has_nnue() || nnueLoading) return;
  nnueLoading = true;
  try {
    const resp = await fetch("./assets/checksmith.nnue");
    const total = Number(resp.headers.get("Content-Length")) || 0;
    const reader = resp.body.getReader();
    const chunks = [];
    let received = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      postMessage({ type: "nnueProgress", loaded: received, total });
    }
    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const ok = game.load_nnue_bytes(bytes);
    postMessage({ type: "nnueLoaded", ok });
  } finally {
    nnueLoading = false;
  }
}

function withLegalMoves(result) {
  return { ...result, legalMoves: game.legal_moves_uci() };
}

self.onmessage = async (e) => {
  const { id, cmd, args } = e.data;
  try {
    await ensureInit();
    let result;
    switch (cmd) {
      case "init":
      case "newGame":
        if (cmd === "newGame") game.new_game(args?.fen);
        result = { fen: game.fen(), turn: game.turn(), legalMoves: game.legal_moves_uci(), hasNnue: game.has_nnue() };
        break;
      case "playerMove":
        result = withLegalMoves(game.player_move(args.uci));
        break;
      case "engineMove":
        if (args.useNnue) await loadNnue();
        result = withLegalMoves(game.engine_move(args.movetimeMs, args.useNnue));
        break;
      default:
        throw new Error("unknown worker command: " + cmd);
    }
    postMessage({ id, ok: true, result });
  } catch (err) {
    postMessage({ id, ok: false, error: String(err && err.message ? err.message : err) });
  }
};
