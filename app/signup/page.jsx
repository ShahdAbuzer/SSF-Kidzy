"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    name: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [success, setSuccess] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strengthLabel, setStrengthLabel] = useState("");

  const inputStyle = {
    backgroundColor: "#FBFCED",
    borderRadius: 2,
    "& fieldset": { borderColor: "#DADADA" },
  };

  const validateForm = (data = formData) => {
    const errors = {};

    if (!data.role) errors.role = "Please select a role.";

    if (!data.username || data.username.length < 4) {
      errors.username = "Username must be at least 4 characters.";
    } else if (!/^[a-zA-Z0-9]+$/.test(data.username)) {
      errors.username = "Only letters and numbers allowed.";
    }

    const pwd = data.password || "";
    if (pwd.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else {
      if (!/[A-Za-z]/.test(pwd)) {
        errors.password = "Must include at least one letter.";
      } else if (!/\d/.test(pwd)) {
        errors.password = "Must include at least one number.";
      } else if (!/[@$!%*?&]/.test(pwd)) {
        errors.password = "Must include a special character.";
      }
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Invalid email format.";
    }

    if (!data.name) {
      errors.name = "Full name is required.";
    }

    if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    setIsFormValid(validateForm());
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setTouchedFields({ ...touchedFields, [name]: true });

    if (name === "password") {
      const newStrength = getPasswordStrength(value).label;
      if (newStrength !== strengthLabel) {
        setStrengthLabel(newStrength);
      }
    }

    validateForm(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!isFormValid) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      const data = await res.text();

      if (!res.ok) {
        setFormErrors({ general: data.message || "Signup failed." });
      } else {
        setSuccess(data.message || "Signup successful!");
        setTimeout(() => (window.location.href = "/login"), 1500);
      }

    } catch {
      setFormErrors({ general: "Something went wrong." });
    }
  };

  const isPasswordMatch =
    formData.password === formData.confirmPassword &&
    formData.confirmPassword.length > 0;

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        backgroundColor: "#FFFEF4",
        minHeight: "100vh",
        padding: "2vh 4vw",
        backgroundImage: "url('/images/signup-rainbow.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right bottom",
        backgroundSize: "contain",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: {
            xs: 340,
            sm: 400,
            md: 460,
          },
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          borderRadius: 3,
          backgroundColor: "#FFFEF4",
          textAlign: "center",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Image
            src="/images/kidzy-logo.png"
            alt="Kidzy Logo"
            width={120}
            height={120}
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Box>

        <Typography
          variant="body1"
          sx={{ color: "#F5A623", fontWeight: "bold", mb: 2 }}
        >
          Inspiring little minds through playful learning
        </Typography>

        {formErrors.general && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {formErrors.general}
          </Typography>
        )}

        {success && (
          <Typography color="green" variant="body2" sx={{ mb: 1 }}>
            {success}
          </Typography>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <TextField
            name="role"
            select
            label="Select a role please"
            value={formData.role}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.role && touchedFields.role}
            helperText={touchedFields.role && formErrors.role}
            InputProps={{ sx: inputStyle }}
          >
            <MenuItem value="STUDENT">Student</MenuItem>
            <MenuItem value="INSTRUCTOR">Instructor</MenuItem>
            <MenuItem value="ADMIN">Admin</MenuItem>
          </TextField>

          <TextField
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.email && touchedFields.email}
            helperText={touchedFields.email && formErrors.email}
            InputProps={{ sx: inputStyle }}
          />

          <TextField
            name="username"
            label="Username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.username && touchedFields.username}
            helperText={touchedFields.username && formErrors.username}
            InputProps={{ sx: inputStyle }}
          />

          <TextField
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.name && touchedFields.name}
            helperText={touchedFields.name && formErrors.name}
            InputProps={{ sx: inputStyle }}
          />

          <TextField
            name="password"
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            error={!!formErrors.password && touchedFields.password}
            helperText={touchedFields.password && formErrors.password}
            InputProps={{
              sx: inputStyle,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {formData.password &&
            touchedFields.password &&
            formData.password !== formData.confirmPassword && (
              <Box mt={0.5}>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: getPasswordStrength(formData.password).color,
                      fontWeight: "bold",
                      fontSize: "0.7rem",
                    }}
                  >
                    Password Strength: {getPasswordStrength(formData.password).label}
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
                        width: `${
                          getPasswordStrength(formData.password).label === "Weak"
                            ? 33
                            : getPasswordStrength(formData.password).label === "Medium"
                            ? 66
                            : 100
                        }%`,
                      }}
                      transition={{ duration: 0.5 }}
                      style={{
                        height: "100%",
                        backgroundColor: getPasswordStrength(formData.password).color,
                      }}
                    />
                  </Box>
                </motion.div>
              </Box>
            )}

          <AnimatePresence>
            {formData.password && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TextField
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  error={
                    !!formErrors.confirmPassword &&
                    touchedFields.confirmPassword &&
                    !isPasswordMatch
                  }
                  helperText={
                    touchedFields.confirmPassword &&
                    formErrors.confirmPassword
                  }
                  InputProps={{
                    sx: inputStyle,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!isFormValid}
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
            Signup
          </Button>
        </Box>

        <Button
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`;
          }}
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
          Sign up with Google
        </Button>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "#F5A623",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Login
          </a>
        </Typography>
      </Paper>
    </motion.div>
  );
}
