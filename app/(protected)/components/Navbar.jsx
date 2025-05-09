// components/Navbar.jsx
"use client";

import { Box, Typography, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  textSecondary: "#6b7a99",
};

export default function Navbar() {
  const router = useRouter();

  return (
    <Box
      sx={{
        px: { xs: 2, md: 6 },
        py: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: `1px solid rgba(210, 154, 114, 0.08)`,
        background: "#fff",
        zIndex: 10,
      }}
    >
      <Box
        sx={{ display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }}
        onClick={() => router.push("/instructor-dashboard")}
      >
        <img
          src="/images/kidzy-logo.png"
          alt="Logo"
          style={{ height: 60, borderRadius: 8, boxShadow: "0 8px 32px 0 rgba(164, 158, 45, 0.12)" }}
        />
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: 1, color: palette.primary }}>
          Kidzy
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: { xs: 2, md: 4 }, fontWeight: 600, alignItems: "center" }}>
        <Typography
          sx={{ cursor: "pointer", color: palette.textSecondary, "&:hover": { color: palette.primary } }}
          onClick={() => router.push("/instructor-dashboard")}
        >
          Home
        </Typography>
        <Typography
          sx={{ cursor: "pointer", color: palette.textSecondary, "&:hover": { color: palette.primary } }}
          onClick={() => router.push("/course")}
        >
          Courses
        </Typography>
        <Typography
          sx={{ cursor: "pointer", color: palette.textSecondary, "&:hover": { color: palette.primary } }}
          onClick={() => router.push("/enroll")}
        >
          Enroll Students
        </Typography>
      </Box>

      <Box sx={{ cursor: "pointer" }}>
        <Avatar
          src="/profile.png"
          alt="Profile"
          sx={{
            width: 44,
            height: 44,
            border: `2px solid ${palette.accent}`,
            boxShadow: "0 8px 32px 0 rgba(164, 158, 45, 0.12)",
          }}
        />
      </Box>
    </Box>
  );
}
