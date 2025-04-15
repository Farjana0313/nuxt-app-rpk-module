module.exports = {
  content: [
    "./src/pages/**/*.{vue,js,ts}",
    "./src/components/**/*.{vue,js,ts}",
    "./src/layouts/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Custom font family
      },
      fontSize: {},
    },
  },
  plugins: [],
};
