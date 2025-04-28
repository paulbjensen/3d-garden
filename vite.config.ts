import { sentryVitePlugin } from "@sentry/vite-plugin";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		sentryVitePlugin({
			org: "anephenix",
			project: "3d-garden",
		}),
	],

	build: {
		sourcemap: true,
	},
});
