/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
],
theme: {
	extend: {
		colors: {
			background: 'var(--background)',
			foreground: 'var(--foreground)',
			sidebar: {
				DEFAULT: 'hsl(var(--sidebar-background))',
				foreground: 'hsl(var(--sidebar-foreground))',
				primary: 'hsl(var(--sidebar-primary))',
				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
				accent: 'hsl(var(--sidebar-accent))',
				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
				border: 'hsl(var(--sidebar-border))',
				ring: 'hsl(var(--sidebar-ring))'
			}
		},
		borderRadius: {
			lg: 'var(--radius)',
			md: 'calc(var(--radius) - 2px)',
			sm: 'calc(var(--radius) - 4px)'
		},
		keyframes: {
			'spinner-leaf-fade': {
				'0%, 100%': {
					opacity: '0'
				},
				'50%': {
					opacity: '1'
				}
			}
		},
		animation: {
			'spinner-leaf-fade': 'spinner-leaf-fade 800ms linear infinite'
		}
	}
},
plugins: [require("tailwindcss-animate")],
};
