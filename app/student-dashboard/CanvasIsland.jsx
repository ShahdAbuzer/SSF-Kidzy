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
     <>
        <Sun />
        <Tree />
        <House />
        <Rocket />
        <Treasure />
        <WoodenBoard />
        <WoodenBoard2 />
        <Rock />
      </>
    );
  }
  
