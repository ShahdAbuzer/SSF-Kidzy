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
        position: "relative",
        backgroundColor: "#f0f8ff",
        backgroundImage: "url('/images/island.svg')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        scrollSnapType: "x mandatory",
      }}
    >
      {/* 📢 تنبيه السكرول مع سهم متحرك */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "#fff7cc",
          borderRadius: "8px",
          padding: "6px 14px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          fontSize: "14px",
          zIndex: 100,
          display: {
            xs: "flex", // show on small screens
            md: "none", // hide on big screens
          },
          alignItems: "center",
          gap: 1,
        }}
      >
        👉 Scroll sideways to explore
        <span
          style={{
            display: "inline-block",
            animation: "bounceArrow 1s infinite",
            fontSize: "18px",
          }}
        >
        </span>
      </Box>

      {/* 🧭 مساحة المشهد كاملة */}
      <Box
        sx={{
          width: "1440px",
          height: "900px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <CanvasIsland />

        {/* 💬 رسالة ترحيب */}
        <Box
          sx={{
            position: "absolute",
            top: 100,
            left: 570,
            zIndex: 10,
            padding: "8px 16px",
            borderRadius: "12px",
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "#38761d" }}>
            {studentName ? `Welcome, ${studentName}!` : "Welcome!"}
          </Typography>
        </Box>
      </Box>

      {/* 💫 أنيميشن السهم */}
      <style jsx>{`
        @keyframes bounceArrow {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(6px);
          }
        }
      `}</style>
    </Box>
  );
}
