"use client";
import { Bai_Jamjuree } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const font = Bai_Jamjuree({
  weight: ["500"],
  style: ["normal"],
  subsets: ["thai"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontSize: 16,
    fontFamily: font.style.fontFamily,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1500, // Adjusted 'lg' breakpoint to better fit MacBook Pro screens
      xl: 1800,
    },
  },
});

export default theme;
