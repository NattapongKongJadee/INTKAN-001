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
      screens: {
        xs: "0px", // Align with Material-UI xs breakpoint
        sm: "600px", // Align with Material-UI sm breakpoint
        md: "900px", // Align with Material-UI md breakpoint
        lg: "1500px", // Align with Material-UI lg breakpoint
        xl: "1800px", // Align with Material-UI xl breakpoint
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bg-image":
          "linear-gradient(180deg, rgba(202, 240, 254, 1) 0%, rgba(255, 255, 255, 1) 51%);",
        "bg-image3":
          "linear-gradient(180deg, rgba(21,224,255,1) 0%, rgba(173,255,223,1) 42%, rgba(237,255,240,1) 70%, rgba(255,255,255,1) 100%);",
        "bg-image2":
          " linear-gradient(0deg, rgba(231,245,255,1) 0%, rgba(200,211,215,1) 47%, rgba(255,255,255,1) 100%); ",
        "bg-image4":
          "linear-gradient(16deg, rgba(35,105,235,1) 0%, rgba(146,217,255,1) 53%, rgba(255,255,255,1) 100%)",
        "bg-image5":
          "linear-gradient(180deg, rgba(46,35,235,1) 0%, rgba(193,190,244,1) 45%, rgba(232,235,254,1) 100%)",
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
        "custom-blue": "#007BFF",
        "custom-cyan": "#00FFFF",
      },
    },
    fontFamily: {
      sans: ["BaiJamjuree", "ui-sans-serif", "system-ui"], // Add your custom font as the default for font-sans
    },
  },

  plugins: [require("daisyui")],
};
export default config;
