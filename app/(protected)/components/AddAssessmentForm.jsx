"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  background: "#f9f9fc",
};

export default function AddAssessmentForm({ courseId, onSuccess, onError }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const validate = () => {
    const newErrors = {
      title: title.trim() ? "" : "❌ Title is required",
      description: description.trim() ? "" : "❌ Description is required",
    };
    setErrors(newErrors);
    return !newErrors.title && !newErrors.description;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await fetch(
        `http://localhost:8080/api/assessments?courseId=${courseId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title,
            description,
            courseId,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to add assessment");

      setTitle("");
      setDescription("");
      setSnack({
        open: true,
        message: "✅ Assessment added successfully!",
        severity: "success",
      });
      onSuccess();
    } catch (err) {
      setSnack({
        open: true,
        message: "❌ " + err.message,
        severity: "error",
      });
      onError(err.message);
    }
  };

  return (
    <Box
      sx={{
        mt: 2,
        p: { xs: 2, sm: 3 },
        background: palette.background,
        borderRadius: 3,
        maxWidth: "100%",
      }}
    >
      <Typography
        fontWeight={700}
        mb={2}
        fontSize={{ xs: 16, sm: 18 }}
        color="primary"
      >
        Add New Assessment
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          fullWidth
          multiline
          rows={3}
        />

        <Box display="flex" justifyContent={isMobile ? "center" : "flex-end"}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              mt: 1,
              background: palette.primary,
              "&:hover": { background: palette.accent },
              borderRadius: 3,
              fontWeight: 700,
              width: isMobile ? "100%" : "auto",
            }}
          >
            Add Assessment
          </Button>
        </Box>
      </Stack>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
