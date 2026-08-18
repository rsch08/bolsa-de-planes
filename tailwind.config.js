/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Work Sans", "sans-serif"],
      },
      colors: {
        paper: "#FBF7EE",
        ink: "#22303A",
        muted: "#5B6B74",
        marigold: "#E3A73B",
        brick: "#C2564A",
        sage: "#7C9A78",
      },
    },
  },
  plugins: [],
};
