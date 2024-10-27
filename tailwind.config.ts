import type { Config } from "tailwindcss";
import daisyui from "daisyui";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",

        "custom-gradient":
          "repeating-radial-gradient(circle at 0 0, transparent 0, #4795ff 61px), repeating-linear-gradient(#d0d1e1, #d0d1e1)",
      },
      boxShadow: {
        custom: "3px 3px 10.5px 3px #dddddd",
      },
      animation: {
        vibrate: "vibrate 0.5s linear infinite",
      },
      colors: {
        "orange-global": "var(--orange-color)",
      },
    },
  },
  plugins: [require("daisyui")],
};
export default config;
