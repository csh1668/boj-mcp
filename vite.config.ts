import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [
        "@modelcontextprotocol/sdk",
        /@modelcontextprotocol\/sdk\/.+/, // subpath imports
        "zod",
        "node:path",
        "node:url",
      ],
      output: {
        // do not preserve module structure; emit single entry
      },
    },
    target: "node20",
    sourcemap: true,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});


