"use client";

import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import CanvasIsland from "./CanvasIsland";
import Cookies from "js-cookie";

export default function CanvasDashboard() {
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const nameFromCookie = Cookies.get("currentUserName");
    if (nameFromCookie) setStudentName(nameFromCookie);
  }, []);

  return (
    <Box
      sx={{
        width: "100dvw",
        height: "100dvh",
        overflowX: "auto",
        overflowY: "hidden",
        margin: 0,
        padding: 0,
        display: "flex",
        justifyContent: "start",
        alignItems: "start",
        backgroundColor: "#f0f8ff",
        backgroundImage: "url('/images/island.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        padding: 4,
      }}
    >
      {/* Welcome message */}
      <Box
        sx={{
          position: "absolute",
          top: 100,
          left: 480,
          zIndex: 10,
          padding: "8px 16px",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "#38761d" }}>
          {studentName ? `Welcome, ${studentName}!` : "Welcome!"}
        </Typography>
      </Box>

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
