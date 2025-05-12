"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  LinearProgress,
  Divider,
  Paper,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff, AutoFixHigh } from "@mui/icons-material";
import Navbar from "../components/Navbar";

const API = "http://localhost:8080/api";

const GREEN = "#38761d";
const GREEN_LIGHT = "#42b883";
const BROWN = "#9c6644";
const BROWN_DARK = "#7f5539";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const userId = Cookies.get("currentUserId");
    const userRole = Cookies.get("currentUserRole");

    if (!userId || !userRole) {
      setSnackbar({ open: true, message: "User ID or Role not found in cookies", severity: "error" });
      setLoading(false);
      return;
    }

    setRole(userRole.toLowerCase()); // "admin" or "instructor"

    const endpoint = userRole === "ADMIN" ? `/admins/${userId}` : `/instructors/${userId}`;

    axios.get(`${API}${endpoint}`, { withCredentials: true })
      .then((res) => {
        setUserData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setSnackbar({ open: true, message: "Failed to fetch profile", severity: "error" });
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    if (name === "password") updatePasswordStrength(value);
  };

  const validate = () => {
    const newErrors = {};
    if (!userData.username?.trim()) newErrors.username = "Username is required.";
    if (!userData.name?.trim()) newErrors.name = "Name is required.";
    if (!userData.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = "Invalid email format.";
    if (isEditing && userData.password) {
      if (userData.password.length < 6) newErrors.password = "Password must be at least 6 characters.";
      if (userData.password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    try {
      const endpoint = role === "admin" ? "/admins" : "/instructors";
      await axios.put(`${API}${endpoint}/${userData.id}`, userData, { withCredentials: true });
      setSnackbar({ open: true, message: "Profile updated", severity: "success" });
      setIsEditing(false);
      setConfirmPassword("");
    } catch {
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    }
  };

  const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 12; i++) {
      pass += chars[Math.floor(Math.random() * chars.length)];
    }
    setUserData({ ...userData, password: pass });
    setConfirmPassword(pass);
    updatePasswordStrength(pass);
    setSnackbar({ open: true, message: "Strong password generated!", severity: "info" });
  };

  const updatePasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;
    setPasswordStrength(strength);
  };

  const textFieldStyle = {
    "& label": { color: GREEN },
    "& label.Mui-focused": { color: GREEN },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: GREEN },
      "&:hover fieldset": { borderColor: GREEN_LIGHT },
      "&.Mui-focused fieldset": { borderColor: GREEN },
    },
  };

  const displayField = (label, value, name, type = "text") => {
    return isEditing ? (
      <TextField
        name={name}
        label={label}
        type={type}
        value={value || ""}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={Boolean(errors[name])}
        helperText={errors[name]}
        sx={textFieldStyle}
      />
    ) : (
      <Box mb={2}>
        <Typography variant="body2" sx={{ color: GREEN, fontWeight: 600 }}>{label}</Typography>
        <Typography variant="body1">{value || "-"}</Typography>
      </Box>
    );
  };

  const displayUneditable = (label, value) => (
    <Box mb={2}>
      <Typography variant="body2" sx={{ color: GREEN, fontWeight: 600 }}>{label}</Typography>
      <Typography variant="body1">{value || "-"}</Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress sx={{ color: GREEN }} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ height: "100vh", overflowY: "auto", bgcolor: "#f5f7f6", mb: 10 }}>
        <Box sx={{ py: { xs: 2, md: 6 }, px: { xs: 1, md: 0 } }}>
          <Paper elevation={4} sx={{
            maxWidth: 500,
            mx: "auto",
            mb: 50,
            p: 4,
            borderRadius: 4,
            bgcolor: "#fff",
            boxShadow: "0 4px 24px rgba(56, 118, 29, 0.10)"
          }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: GREEN, mr: 2 }}>
                {userData.name ? userData.name[0].toUpperCase() : "U"}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700} color={GREEN}>
                  {userData.name || "My Profile"}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {userData.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3, borderColor: GREEN_LIGHT }} />

            {displayField("Username", userData.username, "username")}
            {displayField("Name", userData.name, "name")}
            {displayField("Email", userData.email, "email")}
            {role === "instructor" && displayField("Start Date", userData.startDate, "startDate")}

            {isEditing && (
              <>
                <TextField
                  name="password"
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  value={userData.password || ""}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  sx={textFieldStyle}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <IconButton onClick={generateStrongPassword}>
                          <AutoFixHigh />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Box sx={{ width: "100%", mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          passwordStrength < 50
                            ? "#d32f2f"
                            : passwordStrength < 75
                              ? "#f9a825"
                              : GREEN,
                      },
                    }}
                  />
                </Box>
                <TextField
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  margin="normal"
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  sx={textFieldStyle}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}

            {role === "instructor" && displayUneditable("Major", userData.major)}
            {role === "instructor" && displayUneditable("Degree", userData.degree)}
            {role === "instructor" && displayUneditable("Salary", userData.salary)}
            {role === "admin" && displayField("Department", userData.department, "department")}

            <Box display="flex" justifyContent="flex-end" mt={3}>
              {!isEditing ? (
                <Button variant="contained" onClick={() => setIsEditing(true)} sx={{
                  background: BROWN, "&:hover": { background: BROWN_DARK },
                  color: "#fff", fontWeight: 600, borderRadius: 2, px: 4,
                }}>Edit</Button>
              ) : (
                <>
                  <Button variant="outlined" onClick={() => {
                    setIsEditing(false);
                    setErrors({});
                    setConfirmPassword("");
                  }} sx={{
                    mr: 2, borderColor: BROWN_DARK, color: BROWN_DARK,
                    fontWeight: 600, borderRadius: 2, px: 4,
                    "&:hover": { borderColor: BROWN, color: BROWN },
                  }}>Cancel</Button>
                  <Button variant="contained" onClick={handleUpdate} sx={{
                    background: GREEN, "&:hover": { background: GREEN_LIGHT },
                    color: "#fff", fontWeight: 600, borderRadius: 2, px: 4,
                  }}>Save</Button>
                </>
              )}
            </Box>

            <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
              <Alert
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                severity={snackbar.severity}
                sx={{ bgcolor: snackbar.severity === "success" ? GREEN : undefined, color: "#fff" }}
              >
                {snackbar.message}
              </Alert>
            </Snackbar>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
