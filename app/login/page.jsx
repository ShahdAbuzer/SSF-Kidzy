import Image from "next/image";
import { Box, Typography } from "@mui/material";
import LoginWrapper from "./LoginWrapper";

export const metadata = {
  title: "Kidzy LMS — Login",
};

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFFDF3",
        backgroundImage: "url('/images/signup-rainbow.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
        backgroundSize: "60%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >

      <LoginWrapper />
    </Box>
  );
}
