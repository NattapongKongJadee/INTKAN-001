import React, { ComponentType } from "react";
import { Grid, Typography, Box, Breadcrumbs, Link, Theme } from "@mui/material";

// import { NavLink } from "react-router-dom";
import { RiveDemo } from "./robotITK";
import breadcrumbImg from "../../assets/images/ChatBc.png";
import { IconCircle } from "@tabler/icons-react";

interface BreadCrumbType {
  subtitle?: string;
  items?: any[];
  title: string;
  children?: JSX.Element;
  // robot: ComponentType;
  ComponentProp?: React.ComponentType<any>;
}
const Breadcrumb = ({
  subtitle,
  items,
  title,
  children,
  ComponentProp,
}: // ComponentProp,
BreadCrumbType) => (
  <Grid
    container
    sx={{
      backgroundColor: "var(--accent-color)",
      borderRadius: (theme: Theme) => theme.shape.borderRadius / 4,
      p: "15px 15px ",
      // marginBottom: "10px",
      position: "relative",
      overflow: "hidden",
      height: "10vh",
    }}
  >
    <Grid item xs={12} sm={6} lg={8} mb={1}>
      <div className="flex flex-row">
        <div className="flex flex-col ">
          <Typography variant="h5" color="#FFFFFF">
            {title}
          </Typography>
          <Typography
            color="textSecondary"
            variant="h6"
            fontSize={16}
            fontWeight={300}
            mt={0.8}
            mb={0}
          >
            {subtitle}
          </Typography>
        </div>
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
                (<Typography color="textPrimary">{item.title}</Typography>)
              </div>
            ))
          : ""}
      </Breadcrumbs>
    </Grid>
    <Grid item xs={12} sm={6} lg={4} display="flex" alignItems="flex-end">
      <Box
        sx={{
          display: { xs: "none", md: "block", lg: "flex" },
          alignItems: "center",
          // justifyContent: "flex-end",
          width: "100%",
        }}
      >
        {children ? (
          <Box sx={{ top: "0px", position: "absolute" }}>{children}</Box>
        ) : (
          <>
            {/* <Box sx={{ top: "0px", position: "absolute" }}> */}
            {/* <div
              style={{
                height: 400,
                cursor: "pointer",
                // alignItems: "initial",
                position: "relative",
                // bottom: 94,
                marginLeft: 90,
                bottom: 115,
                // bottom: 780,
                // right: 2,
                zIndex: 30,
              }}
            > */}
            <div
              style={{
                height: 150,
                cursor: "pointer",
                // alignItems: "initial",
                position: "relative",
                // bottom: 94,
                marginLeft: 50,
                bottom: 53,
                // bottom: 780,
                // right: 2,
                // zIndex: 30,
              }}
            >
              {/* <RiveDemo /> */}
            </div>
          </>
        )}
      </Box>
    </Grid>
  </Grid>
);

export default Breadcrumb;
