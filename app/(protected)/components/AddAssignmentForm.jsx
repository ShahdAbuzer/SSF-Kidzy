"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  background: "#f9f9fc",
};

export default function AddAssignmentForm({
  courseId,
  assignments,
  onSuccess,
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [newMaxPoints, setNewMaxPoints] = useState("");

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnack = (message, severity = "success") => {
    setSnack({ open: true, message, severity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !newTitle.trim() ||
      !newDescription.trim() ||
      !newDueDate ||
      !newMaxPoints
    ) {
      showSnack("❌ All fields are required.", "error");
      return;
    }

    if (isNaN(newMaxPoints) || parseInt(newMaxPoints) <= 0) {
      showSnack("❌ Max Points must be a positive number.", "error");
      return;
    }

    const due = new Date(newDueDate);
    if (isNaN(due.getTime())) {
      showSnack("❌ Invalid due date.", "error");
      return;
    }

    const isDuplicate = assignments.some(
      (a) =>
        a.title.trim().toLowerCase() === newTitle.trim().toLowerCase()
    );
    if (isDuplicate) {
      showSnack("❌ Assignment with this title already exists.", "error");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          dueDate: newDueDate,
          maxPoints: parseInt(newMaxPoints),
          courseId: parseInt(courseId),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`❌ Server error: ${res.status} – ${errorText}`);
      }

      showSnack("✅ Assignment added successfully!", "success");
      onSuccess();
      setNewTitle("");
      setNewDescription("");
      setNewDueDate("");
      setNewMaxPoints("");
    } catch (err) {
      showSnack(err.message || "❌ Failed to add assignment.", "error");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mt: 2, p: 2, background: "#f9f9fc", borderRadius: 3 }}
    >
      <Stack spacing={2}>
        <TextField
          label="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Due Date"
          type="datetime-local"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Max Points"
          type="number"
          value={newMaxPoints}
          onChange={(e) => setNewMaxPoints(e.target.value)}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 1,
            background: palette.primary,
            "&:hover": { background: palette.accent },
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          Save Assignment
        </Button>
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
