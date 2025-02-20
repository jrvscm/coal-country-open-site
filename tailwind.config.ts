import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx}',      // App Router structure
    './pages/**/*.{js,ts,jsx,tsx}',    // Legacy pages (if any)
    './components/**/*.{js,ts,jsx,tsx}', 
    './src/**/*.{js,ts,jsx,tsx}',      // If you're using a src directory
    './node_modules/@shadcn/ui/**/*.{js,ts,jsx,tsx}' // For Shadcn components
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
        },
        
        //custom colors
        customBackground: 'hsl(var(--custom-background))',
        customYellow: 'hsl(var(--custom-yellow))',
        customPrimary: 'hsl(var(--custom-primary))',
        customLightGray: 'hsla(var(--custom-light-gray))'

      },
  
      fontFamily: {
        heading: ['var(--font-bebas)', 'sans-serif'],
        text: ['var(--font-barlow)', 'sans-serif'],
      },
      dropShadow: {
        'custom-600': '0 6px 10px rgba(0, 0, 0, 1)',
      }
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;