"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import Image from "next/image";
import LockOpenIcon from "@mui/icons-material/LockOpen";

const STUDENT_API = "http://localhost:8080/api/students/20";

const lockedGames = [
  { title: "Ninja Jump",   image: "/images/ninja.png", requiredPoints: 50  },
  { title: "Infinity Race", image: "/images/car.png",  requiredPoints: 800 },
  { title: "Gorilla Fight", image: "/images/gor.png",  requiredPoints: 2000},
];

export default function BuyGamesAndThemesPage() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /* 🟢 سطر fetch وحيد */
    fetch(STUDENT_API)
      .then((r) => r.json())
      .then(setStudent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography mt={2}>Loading…</Typography>
      </Box>
    );
  }

  if (!student) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">مش لاقي الطالب 🙈</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, backgroundColor: "#FBFCED", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={2} color="#5A4E3C">
        🧑‍🚀 Level:&nbsp;<span style={{ color: "#2b5d38" }}>{student.level}</span>
      </Typography>

      <Typography variant="h5" fontWeight="bold" mb={2} color="#5A4E3C">
        💰 Points:&nbsp;{student.points}
      </Typography>

      <Typography variant="h5" fontWeight="bold" mt={4} mb={2} color="#5A4E3C">
        🎮 Unlock Games
      </Typography>

      <Grid container spacing={3}>
        {lockedGames.map((g) => {
          const unlocked = student.points >= g.requiredPoints;
          return (
            <Grid item xs={12} sm={6} md={4} key={g.title}>
              <Paper
                elevation={4}
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderRadius: 4,
                  backgroundColor: unlocked ? "#e0ffe0" : "#fff",
                }}
              >
                <Image
                  src={g.image}
                  alt={g.title}
                  width={200}
                  height={140}
                  style={{
                    filter: unlocked
                      ? "none"
                      : "blur(3px) brightness(0.8) grayscale(30%)",
                    marginBottom: "1rem",
                    borderRadius: 8,
                  }}
                  priority
                />
                <Typography variant="h6" fontWeight="bold">
                  {g.title}
                </Typography>
                <Typography variant="body2" mb={2}>
                  Requires {g.requiredPoints} points
                </Typography>
                <Button
                  variant="contained"
                  color={unlocked ? "success" : "inherit"}
                  disabled={!unlocked}
                  startIcon={<LockOpenIcon />}
                >
                  {unlocked ? "Unlocked" : "Locked"}
                </Button>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="h5" fontWeight="bold" mt={6} mb={2} color="#5A4E3C">
        🎨 Buy Themes
      </Typography>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 4, backgroundColor: "#fff0d9" }}>
        <Typography variant="body1">
          🚀 Theming system coming soon!
        </Typography>
      </Paper>
    </Box>
  );
}
