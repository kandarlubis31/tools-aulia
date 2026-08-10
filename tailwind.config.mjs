/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class', 
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
				mono: ['JetBrains Mono', 'IBM Plex Mono', 'Fira Code', 'monospace'],
			},
			colors: {
				surface: {
					DEFAULT: '#0d1117',
					elevated: '#161b22',
					hover: '#1c2128',
					border: '#21262d',
				},
				matte: {
					50: '#f6f8fa',
					100: '#e1e4e8',
					200: '#d0d7de',
					300: '#8b949e',
					400: '#6e7681',
					500: '#484f58',
					600: '#30363d',
					700: '#242b3b',
					800: '#1a2030',
					900: '#131722',
					950: '#0b0e14',
				},
				accent: {
					blue: '#38bdf8',
					mint: '#34d399',
					amber: '#fbbf24',
					sky: '#0ea5e9',
				},
			},
			fontSize: {
				'2xs': ['0.625rem', { lineHeight: '0.875rem' }],
			},
			letterSpacing: {
				'wide-2': '0.08em',
				'wide-3': '0.12em',
			},
			transitionDuration: {
				'150': '150ms',
			},
		},
	},
	plugins: [],
	safelist: [
		// usePdfDropZone composable generates these dynamically
		{ pattern: /^border-(red|orange|emerald|blue|violet|cyan|gray|pink|indigo|sky|teal|amber|rose|green|yellow)-500$/ },
		{ pattern: /^bg-(red|orange|emerald|blue|violet|cyan|gray|pink|indigo|sky|teal|amber|rose|green|yellow)-50$/ },
		{ pattern: /^dark:bg-(red|orange|emerald|blue|violet|cyan|gray|pink|indigo|sky|teal|amber|rose|green|yellow)-900\/10$/ },
	],
}