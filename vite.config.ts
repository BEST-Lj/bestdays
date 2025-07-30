import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'pages/index.html'),
				index: resolve(__dirname, 'pages/index.html'),
				partners: resolve(__dirname, 'pages/partners.html'),
				program: resolve(__dirname, 'pages/program.html'),
				team: resolve(__dirname, 'pages/team.html'),
				publications: resolve(__dirname, 'pages/publications.html')
			},
		},
	},
});

