"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box, Typography, Paper } from "@mui/material";
import Image from "next/image";

export default function OAuthRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/check-token`, {
          credentials: "include",
        });

        if (res.ok) {
          router.replace("/");
        } else {
          router.replace("/login");
        }
      } catch (err) {
        router.replace("/login");
      }
    };

    verifyToken();
  }, [router]);

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#FFFEF4",
        backgroundImage: "url('/images/signup-rainbow.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
        backgroundSize: "60%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          textAlign: "center",
          p: 4,
          borderRadius: 3,
          backgroundColor: "#FFFEF4",
        }}
      >
        <Image
          src="/images/kidzy-logo.png"
          width={120}
          height={120}
          alt="Kidzy Logo"
          style={{ marginBottom: "1rem" }}
        />
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            color: "#F5A623",
            fontWeight: "bold",
          }}
        >
          Logging you in with Google...
        </Typography>
        <CircularProgress size={32} sx={{ color: "#F5A623" }} />
      </Paper>
    </Box>
  );
}
