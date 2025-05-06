"use client";

import { Box } from "@mui/material";
import CanvasIsland from "./CanvasIsland";

export default function CanvasDashboard() {
  return (
    <Box
      sx={{
        width: "100dvw", // استخدمنا dvw بدل vw لتفادي مشاكل بعض المتصفحات
        height: "100dvh",
        overflowX: "auto",
        overflowY: "hidden",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "start",
        alignItems: "start", // مهم جدًا
        backgroundColor: "#87CEFA", // خلفية مشابهة للسماء لو توسّع
          minHeight: "100dvh",
                padding: 4,
                backgroundColor: "#f0f8ff",
                backgroundImage: "url('/images/island.svg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center"
          
      }}
    >
      <Box
        sx={{
          width: "1440px",
          height: "900px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <CanvasIsland />
      </Box>
    </Box>
  );
}
