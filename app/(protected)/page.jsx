"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [student, setStudent] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Za-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 1) return { label: "Weak", color: "#f44336" };
    if (strength === 2 || strength === 3) return { label: "Medium", color: "#FFA726" };
    return { label: "Strong", color: "#66BB6A" };
  };

  const strength = getPasswordStrength(password);
  const isPasswordMatch = password === confirmPassword && confirmPassword.length > 0;
  const isValid = password.length >= 8 && isPasswordMatch;

  useEffect(() => {
    fetch("http://localhost:8080/api/students/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudent(data));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isValid) {
      setError("Please fix the errors above.");
      return;
    }

    const updated = {
      name: student?.name,
      email: student?.email,
      points: student?.points,
      password: password,
    };

    try {
      const res = await fetch(`http://localhost:8080/api/students/${student?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error("Failed to update password");

      setSuccess("Password updated successfully 🎉");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong.");
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: "#FFFEF4",
        height: "100vh",
        overflow: "auto",
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
          width: 360,
          maxWidth: "90vw",
          p: 3,
          borderRadius: 3,
          backgroundColor: "#FFFEF4",
          textAlign: "center",
        }}
      >
        <Image src="/images/kidzy-logo.png" width={150} height={150} alt="Kidzy Logo" />

        {student && (
          <>
            <Typography
              variant="body1"
              sx={{ color: "#F5A623", fontWeight: "bold", mb: 2 }}
            >
              Welcome back, {student.name}! 
              
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#F5A623", fontWeight: "bold", mb: 2 }}
            > 
              You have {student.points} points 💎
            </Typography>
            <Box component="form" onSubmit={handleUpdate} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <TextField
                label="Email"
                value={student.email}
                fullWidth
                disabled
                InputProps={{
                  sx: {
                    backgroundColor: "#FBFCED",
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#DADADA" },
                  },
                }}
              />

              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: "#FBFCED",
                    borderRadius: 2,
                    "& fieldset": { borderColor: "#DADADA" },
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {password && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ color: strength.color, fontWeight: "bold", fontSize: "0.7rem" }}
                  >
                    Password Strength: {strength.label}
                  </Typography>
                  <Box
                    sx={{
                      height: 4,
                      borderRadius: 3,
                      backgroundColor: "#eee",
                      mt: 0.3,
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: strength.label === "Weak"
                          ? "33%"
                          : strength.label === "Medium"
                          ? "66%"
                          : "100%",
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        height: "100%",
                        backgroundColor: strength.color,
                      }}
                    />
                  </Box>
                </Box>
              )}

              <AnimatePresence>
                {password && (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextField
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      fullWidth
                      error={password !== confirmPassword}
                      helperText={
                        confirmPassword && password !== confirmPassword
                          ? "Passwords do not match"
                          : ""
                      }
                      InputProps={{
                        sx: {
                          backgroundColor: "#FBFCED",
                          borderRadius: 2,
                          "& fieldset": { borderColor: "#DADADA" },
                        },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                              {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": isPasswordMatch
                          ? {
                              "& fieldset": { borderColor: "#4CAF50" },
                            }
                          : {},
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {error && <Typography color="error" variant="caption">{error}</Typography>}
              {success && <Typography color="green" variant="caption">{success}</Typography>}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isValid}
                sx={{
                  mt: 1,
                  backgroundColor: "#F5A623",
                  color: "#fff",
                  textTransform: "none",
                  borderRadius: 2,
                  py: 1.3,
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#E49B20" },
                }}
              >
                Update Password
              </Button>
            </Box>
          </>
        )}

        <Button
          onClick={handleLogout}
          fullWidth
          sx={{
            mt: 2,
            color: "#555",
            border: "1px solid #ccc",
            borderRadius: 2,
            py: 1.2,
            fontWeight: "bold",
            backgroundColor: "#fff",
            "&:hover": {
              backgroundColor: "#f5f5f5",
              borderColor: "#bbb",
            },
          }}
        >
          Logout
        </Button>
      </Paper>
    </motion.div>
  );
}
