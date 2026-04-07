module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 1.4s linear infinite',
        'play-pulse': 'playPulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        playPulse: {
          '0%, 100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.7)',
          },
          '50%': {
            transform: 'scale(1.1)',
            boxShadow: '0 0 0 16px rgba(220, 38, 38, 0)',
          },
        },
      },
    },
  },
  plugins: [],
};
