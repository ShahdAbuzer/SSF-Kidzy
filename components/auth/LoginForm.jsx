"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  CircularProgress,
  Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Image from "next/image";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username, password }),
        }
      );

      if (!res.ok) {
        const { message } = await res.json();
        setError(message || "Invalid credentials");
      } else {
        window.location.href = "/";
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: "#FFFEF4",
        maxHeight: "100vh",
        overflow: "hidden",
        backgroundImage: "url('/images/signup-rainbow.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
        backgroundSize: "60%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 360,
          maxWidth: "90vw",
          p: 3,
          borderRadius: 3,
          backgroundColor: "#FFFEF4",
          textAlign: "center",
        }}
      >
        <Image
          src="/images/kidzy-logo.png"
          width={170}
          height={170}
          alt="Kidzy Logo"
          style={{ marginBottom: "0.5rem" }}
        />

        <Typography
          variant="body1"
          sx={{
            color: "#F5A623",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Inspiring little minds through playful learning
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            fullWidth
            InputProps={{
              sx: {
                backgroundColor: "#FBFCED",
                borderRadius: 2,
                "& fieldset": { borderColor: "#DADADA" },
              },
            }}
          />

          <TextField
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              sx: {
                backgroundColor: "#FBFCED",
                borderRadius: 2,
                "& fieldset": { borderColor: "#DADADA" },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPw(!showPw)}
                    edge="end"
                    size="small"
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 1,
              backgroundColor: "#F5A623",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 2,
              py: 1.3,
              "&:hover": {
                backgroundColor: "#E49B20",
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>

        {/* Google Login Button */}
        <Button
          onClick={handleGoogleLogin}
          fullWidth
          variant="outlined"
          sx={{
            mt: 2,
            borderColor: "#ccc",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 2,
            py: 1.2,
            color: "#333",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#bbb",
            },
          }}
          startIcon={
            <img
              src="/icons/google.svg"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
          }
        >
          Continue with Google
        </Button>

        {/* Sign Up Link */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <a
            href="/signup"
            style={{
              color: "#F5A623",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Sign Up
          </a>
        </Typography>
      </Paper>
    </motion.div>
  );
}
