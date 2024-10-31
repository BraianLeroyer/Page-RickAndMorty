/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			animation: {
				twinkle: 'twinkle 5s infinite',
				'space-float': 'space-float 3s ease-in-out infinite',
			  },
		},keyframes: {	
		'space-float': {
				'0%': { transform: 'translateY(0)' },
				'50%': { transform: 'translateY(-10px)' },
				'100%': { transform: 'translateY(0)' },
				},
			twinkle: {
				'0%, 100%': { opacity: '1' },
				'50%': { opacity: '0.5' },
			  },
		},
	},
	plugins: [],
}