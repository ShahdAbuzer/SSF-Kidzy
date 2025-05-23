// app/(auth)/LoginForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import {
  Box, Typography, TextField, Button, IconButton,
  InputAdornment, CircularProgress, Paper,
} from "@mui/material";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const ROLE_ENDPOINTS = [
    { role: "STUDENT",    url: `${API}/api/students/me`,         dashboard: "/student-dashboard" },
    { role: "INSTRUCTOR", url: `${API}/api/instructors/current`, dashboard: "/instructor-dashboard" },
    { role: "ADMIN",      url: `${API}/api/admins/current`,       dashboard: "/admin-dashboard" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      /* 1️⃣ طلب تسجيل الدخول */
      const loginRes = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",              // يستلم كوكي الجلسة
        body: JSON.stringify({ username, password }),
      });

      if (!loginRes.ok) {
        const { message } = await loginRes.json();
        setError(message || "Invalid credentials");
        return;
      }

      /* 2️⃣ اكتشاف الدور */
      for (const ep of ROLE_ENDPOINTS) {
        const res = await fetch(ep.url, { credentials: "include" });

        if (res.ok) {
          const data = await res.json();

          Cookies.set("currentUserId",   String(data.id), { path: "/", sameSite: "lax" });
          Cookies.set("currentUserName", data.name ?? "", { path: "/", sameSite: "lax" });
          Cookies.set("currentUserRole", ep.role,         { path: "/", sameSite: "lax" });
          Cookies.set("currentUserPoints", data.points ?? 0, { path: "/", sameSite: "lax" });
          Cookies.set("currentUserLevel", data.level ?? "", { path: "/", sameSite: "lax" });

          sessionStorage.setItem("currentUser", JSON.stringify(data));
          console.log("User data:", data);

          router.replace(ep.dashboard);
          return;
        }
      }

      setError("User role not recognized.");
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);   // يتنفّذ دايمًا
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API}/oauth2/authorization/google`;
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

        <Typography variant="body1" sx={{ color: "#F5A623", fontWeight: "bold", mb: 2 }}>
          Inspiring little minds through playful learning
        </Typography>

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}
             sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required fullWidth
            InputProps={{
              sx: { backgroundColor: "#FBFCED", borderRadius: 2, "& fieldset": { borderColor: "#DADADA" } },
            }}
          />

          <TextField
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required fullWidth
            InputProps={{
              sx: { backgroundColor: "#FBFCED", borderRadius: 2, "& fieldset": { borderColor: "#DADADA" } },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPw(!showPw)} edge="end" size="small">
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
              "&:hover": { backgroundColor: "#E49B20" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>

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
            "&:hover": { backgroundColor: "#f5f5f5", borderColor: "#bbb" },
          }}
          startIcon={<img src="/icons/google.svg" alt="Google" style={{ width: 20, height: 20 }} />}
        >
          Continue with Google
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don’t have an account?{" "}
          <a href="/signup" style={{ color: "#F5A623", fontWeight: "bold", textDecoration: "none" }}>
            Sign Up
          </a>
        </Typography>
      </Paper>
    </motion.div>
  );
}
