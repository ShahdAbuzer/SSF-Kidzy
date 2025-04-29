"use client";
import { Box } from "@mui/material";
import IslandBackground from "./IslandBackground";
import House from "./House";
import Tree from "./Tree";
import Sun from "./Sun";
import Rocket from "./Rocket";
import Treasure from "./Treasure";
import Rock from "./Rock";
import WoodenBoard from "./WoodenBoard";
import WoodenBoard2 from "./WoodenBoard2";

export default function CanvasIsland() {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#AEE2FF",
      }}
    >
      <IslandBackground />
      <Sun />
      <Tree />
      <House />
      <Rocket />
      <Treasure />
      <WoodenBoard />
      <WoodenBoard2 />
      <Rock />
    </Box>
  );
}
