/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Jaipur Fusion Color Palette
                jaipur: {
                    pink: '#F4C2C2',
                    terra: '#D97757',
                    sand: '#E8DCC4',
                    peacock: '#0F7B8A',
                    gold: '#C9A961',
                    burgundy: '#8B2635',
                },
                // Neutral palette
                neutral: {
                    50: '#FAFAF8',
                    100: '#F5F5F4',
                    200: '#F0EBE6',
                    300: '#E0D8D0',
                    400: '#9B9490',
                    500: '#6B6460',
                    600: '#2C2C2C',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
                display: ['Cormorant Garamond', 'serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'mandala': 'mandalaRotate 60s linear infinite',
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
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                mandalaRotate: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-jaipur': 'linear-gradient(135deg, #D97757 0%, #C9A961 50%, #0F7B8A 100%)',
                'pattern-mandala': 'url("/lib/patterns/mandala-1.svg")',
                'pattern-jali': 'url("/lib/patterns/geometric-jali.svg")',
            },
            boxShadow: {
                'gold': '0 0 20px rgba(201, 169, 97, 0.3), 0 0 40px rgba(201, 169, 97, 0.15)',
                'terra': '0 0 20px rgba(217, 119, 87, 0.3), 0 0 40px rgba(217, 119, 87, 0.15)',
                'peacock': '0 0 20px rgba(15, 123, 138, 0.3), 0 0 40px rgba(15, 123, 138, 0.15)',
            },
        },
    },
    plugins: [],
};
