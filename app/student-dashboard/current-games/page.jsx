"use client";

import { useEffect, useState } from "react";
import { Box, Grid, Typography, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Image from "next/image";

const games = [
  {
    title: "Ninja Jump",
    description: "collect 200 points to unlock this game",
    image: "/images/ninja.png",
    pointsRequired: 200,
    path: "http://127.0.0.1:5500/kidzy-frontend/kidzy/app/(protected)/games/ninja/index.html",
  }
  ,
  {
title: "Infinity race",
    description: "collect 3000 points to unlock this game",
    image: "/images/car.png",
    pointsRequired: 200,
    path: "http://127.0.0.1:5501/index3.html",
  }
  ,
  {
    title: "Gorilla fight",
    description: "collect 5000 points to unlock this game",
    image: "/images/gor.png",
    pointsRequired: 200,
    path: "http://127.0.0.1:5500/kidzy-frontend/kidzy/app/(protected)/games/gorilla/index2.html",
  }
];

export default function CurrentGamesPage() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/students/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudent(data));
  }, []);

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        backgroundColor: "#FBFCED",
        backgroundImage: `url('/images/game.svg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "500px",
        backgroundPosition: "left 0px top 60px",
        fontFamily: "'Jaldi', sans-serif",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        color="#5A4E3C"
      >
        Current Games
      </Typography>

      <Box
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          pr: 2,
        }}
      >
        <Grid container spacing={4} justifyContent="center">
          {games.map((game, index) => {
            const unlocked = student?.points >= game.pointsRequired;

            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  elevation={5}
                  sx={{
                    borderRadius: "20px",
                    height: 250,
                    width: 900,
                    overflow: "hidden",
                    position: "relative",
                    cursor: unlocked ? "pointer" : "not-allowed",
                    transition: "transform 0.2s",
                    "&:hover": unlocked && { transform: "scale(1.02)" },
                  }}
                  onClick={() => {
                    if (unlocked) {
                      window.open(game.path, "_blank");
                    }
                  }}
                >
                  <Box sx={{ position: "absolute", inset: 0 }}>
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      style={{
                        objectFit: "cover",
                        filter: unlocked
                          ? "brightness(1)"
                          : "blur(4px) brightness(0.8)",
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "#fff",
                      textShadow: "1px 1px 4px #000",
                      zIndex: 2,
                      px: 2,
                      textAlign: "center",
                    }}
                  >
                    {!unlocked && <LockIcon sx={{ fontSize: 40, mb: 1 }} />}
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      fontSize="1.3rem"
                      sx={{ mb: 0.5 }}
                    >
                      {game.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "0.95rem", lineHeight: 1.4 }}
                    >
                      {game.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
