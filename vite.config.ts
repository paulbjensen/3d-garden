import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), sentryVitePlugin({
    org: "anephenix",
    project: "3d-garden"
  })],

  build: {
    sourcemap: true
  }
})