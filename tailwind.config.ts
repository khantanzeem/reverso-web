import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0B1F3A",
        "navy-700": "#13315C",
        "navy-900": "#060F20",
        signal: "#00B4D8",
        "signal-400": "#4FD9EE",
        "signal-600": "#0096B7",
        ink: "#1A2333",
        mist: "#F5F7FA",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
