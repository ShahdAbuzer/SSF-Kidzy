"use client";

import { Box, Grid, Typography, Paper } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import Image from "next/image";

const games = [
  {
    title: "Ninja Jump",
    description: "collect 50 points to unlock this game",
    image: "/images/ninja.png",
  },
  {
    title: "Infinity race",
    description: "collect 800 points to unlock this game",
    image: "/images/car.png",
  },
  {
    title: "Gorilla fight",
    description: "collect 2000 points to unlock this game",
    image: "/images/gor.png",
  },
];

export default function CurrentGamesPage() {
  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        backgroundColor: "#FBFCED",
        backgroundImage: `url('/images/game.svg')`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "500px", // حجم كبير بس ما يغطي الوسط
        backgroundPosition: "left 0px top 60px", // تحديد دقيق للمكان
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
          {games.map((game, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={5}
                sx={{
                  borderRadius: "20px",
                  height: 250,
                  width: 900,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "not-allowed",
                }}
              >
                {/* 🖼️ صورة الخلفية المغبشة */}
                <Box sx={{ position: "absolute", inset: 0 }}>
                  <Image
                    src={game.image}
                    alt={game.title}
                    fill
                    style={{
                      objectFit: "cover",
                      filter: "blur(4px) brightness(0.8)",
                    }}
                  />
                </Box>

                {/* 🧩 محتوى فوق الصورة */}
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
                  <LockIcon sx={{ fontSize: 40, mb: 1 }} />
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
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
