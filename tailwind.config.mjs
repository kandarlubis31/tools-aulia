/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class', 
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Inter', 'system-ui', 'sans-serif'],
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
					700: '#21262d',
					800: '#161b22',
					900: '#0d1117',
					950: '#010409',
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
}