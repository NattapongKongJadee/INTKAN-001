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
});

export default theme;
