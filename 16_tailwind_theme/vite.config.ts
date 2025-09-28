import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import removeConsole from "vite-plugin-remove-console";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), visualizer(), removeConsole()],
  build: {
    minify: "terser",
    cssMinify: true,
  },
});
