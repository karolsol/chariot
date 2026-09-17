import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";

export default defineConfig({
  test: {
    root: "./",
    globals: true,
  },
  plugins: [swc.vite()],
});
