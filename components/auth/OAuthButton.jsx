"use client";

import { Button, Box } from "@mui/material";
import Image from "next/image";

export default function OAuthButton({ provider, label }) {
  const handleOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/${provider}`;
  };

  return (
    <Button
      onClick={handleOAuth}
      variant="outlined"
      fullWidth
      sx={{
        backgroundColor: "#fff",
        color: "#5f6368",
        borderColor: "#dadce0",
        textTransform: "none",
        fontWeight: "500",
        fontSize: "0.95rem",
        "&:hover": {
          backgroundColor: "#f8f9fa",
          borderColor: "#dadce0",
        },
      }}
      startIcon={
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Image src="/icons/google.svg" alt="Google icon" width={18} height={18} />
        </Box>
      }
    >
      {label}
    </Button>
  );
}
