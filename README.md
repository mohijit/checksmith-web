# checksmith-web

Play [Checksmith](https://github.com/mohijit/Checksmith) — a chess engine written
from scratch in Rust — in the browser, entirely client-side. No server: the
engine runs as WebAssembly inside a dedicated Web Worker.

Live at `chess.mohijitsingh.com`, deployed via GitHub Pages.

## How it works

- `pkg/` — `wasm-pack build --target web --release` output from the `wasm/`
  crate in the Checksmith repo (the bindings live there, versioned with the
  engine; this repo just gets a copy of the build output — no CI build step
  yet, so a Checksmith engine change needs a manual rebuild + copy here).
- `worker.js` — owns the WASM `Game` instance, runs entirely off the main
  thread so a multi-second engine think never freezes the page.
- `index.html` — the board UI. Talks to `worker.js` over `postMessage`; the
  engine's own move generation is the single source of truth for legality,
  there's no separate JS chess-rules implementation.
- `assets/checksmith.nnue` — the engine's neural-network eval weights
  (~40MB), fetched lazily only when "Strong" difficulty is first selected.

## Updating after an engine change

```
cd ../Checksmith/wasm
wasm-pack build --target web --release --out-dir pkg
cp pkg/checksmith_wasm.js pkg/checksmith_wasm_bg.wasm pkg/checksmith_wasm.d.ts ../../checksmith-web/pkg/
```
