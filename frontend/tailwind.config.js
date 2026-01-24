/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Jaipur Fusion Luxury Palette (Refined)
                jaipur: {
                    pink: '#FDF2F0', // Very light tint
                    terra: '#A67C70', // Muted clay
                    sand: '#F2EBE5', // Light neutral
                    peacock: '#2A5A63', // Deep teal
                    gold: '#C0A062', // Luxury gold
                    burgundy: '#6B2D38', // Deep regal red
                },
                // Warm Neutral palette
                neutral: {
                    50: '#FAFAF9',
                    100: '#F5F5F4',
                    200: '#E6E5E3',
                    300: '#D6D3D0',
                    400: '#A8A29E',
                    500: '#78716C',
                    600: '#57534E',
                    700: '#44403C',
                    800: '#292524',
                    900: '#1C1917',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                display: ['Cormorant Garamond', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                'slide-up': 'slideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
                'slide-down': 'slideDown 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                'mandala': 'mandalaRotate 120s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                mandalaRotate: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            backgroundImage: {
                'gradient-jaipur': 'linear-gradient(135deg, #6B2D38 0%, #C0A062 100%)', // Burgundy to Gold
                'pattern-mandala': 'url("/lib/patterns/mandala-1.svg")',
                'pattern-jali': 'url("/lib/patterns/geometric-jali.svg")',
            },
            boxShadow: {
                'gold': '0 0 30px rgba(192, 160, 98, 0.15)',
                'subtle': '0 0 30px rgba(0, 0, 0, 0.05)',
            },
        },
    },
    plugins: [],
};
