import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F6F2",
        ink: "#12141A",
        inkfade: "#5B5F6B",
        scan: "#2D5BFF",
        blood: "#E63950",
        amber: "#F2A93C",
        jade: "#1FA37D",
        line: "#DEDFD8",
      },
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ['"IBM Plex Sans KR"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
