import React, { ComponentType } from "react";
import { Grid, Typography, Box, Breadcrumbs, Link, Theme } from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
import { IconCircle } from "@tabler/icons-react";

interface BreadCrumbType {
  subtitle?: string;
  items?: any[];
  title: string;
  children?: JSX.Element;
}

const RiveDemo = dynamic(() => import("../robotITK"), {
  ssr: false,
});

const Breadcrumb = ({ subtitle, items, title, children }: BreadCrumbType) => (
  <Grid
    container
    sx={{
      backgroundColor: "#94e3fe",
      borderRadius: (theme: Theme) => theme.shape.borderRadius / 4,
      p: "15px 15px",
      position: "relative",
      overflow: "hidden",
      height: "10vh",
    }}
  >
    <Grid item xs={12} sm={6} lg={8} mb={1}>
      <div className="flex flex-row items-start">
        <div className="flex flex-col">
          <Typography variant="h5" color="#FFFFFF">
            {title}
          </Typography>
          <Typography
            color="white"
            variant="h6"
            fontSize={16}
            fontWeight={300}
            mt={0.8}
            mb={0}
          >
            {subtitle}
          </Typography>
        </div>
        <Image
          src="/h-itk2.png"
          width={150}
          height={180}
          style={{ position: "absolute", top: -30, right: 0 }}
          alt="Descriptive text about the image" // Add a descriptive alt property here
        ></Image>
      </div>

      <Breadcrumbs
        separator={
          <IconCircle
            size="5"
            fill="textSecondary"
            fillOpacity={"0.6"}
            style={{ margin: "0 5px" }}
          />
        }
        sx={{ alignItems: "center", mt: items ? "10px" : "" }}
        aria-label="breadcrumb"
      >
        {items
          ? items.map((item) => (
              <div key={item.title}>
                <Typography color="textPrimary">{item.title}</Typography>
              </div>
            ))
          : ""}
      </Breadcrumbs>
    </Grid>
  </Grid>
);

export default Breadcrumb;
