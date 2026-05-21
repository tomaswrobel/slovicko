import {defineConfig} from "vite";
import {svelte} from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		tailwindcss(),
		svelte(),
		VitePWA({
			registerType: "autoUpdate",
			manifest: {
				name: "Slovíčko",
				short_name: "Slovíčko",
				description: "Uhádni pětipísmenné slovo za šest pokusů. Česká slovní hra.",
				theme_color: "#121213",
				background_color: "#121213",
				display: "standalone",
				icons: [
					{src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png"},
					{src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png"},
					{
						src: "/icons/icon-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},
		}),
	],
});
