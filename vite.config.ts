import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		outDir: 'dist',
		rollupOptions: {
			input: {
				index: resolve(__dirname, 'pages/index.html'),
				team: resolve(__dirname, 'pages/team.html'),
				partners: resolve(__dirname, 'pages/partners.html'),
				program: resolve(__dirname, 'pages/program.html'),
				publications: resolve(__dirname, 'pages/publications.html'),
				interaktivnedelavnice: resolve(__dirname, 'pages/interaktivnedelavnice.html'),
				casestudy: resolve(__dirname, 'pages/casestudy.html'),
				hekaton: resolve(__dirname, 'pages/hekaton.html'),
			},
		},
	},
});

