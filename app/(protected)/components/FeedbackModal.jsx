"use client";

import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function FeedbackModal({ open, onClose, studentId, assignmentId, existingFeedback, onSuccess }) {
  const [feedback, setFeedback] = useState("");
  const [points, setPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (existingFeedback) {
      setFeedback(existingFeedback.feedback);
      setPoints(existingFeedback.pointsAwarded);
    } else {
      setFeedback("");
      setPoints("");
    }
    setMessage("");
  }, [open]);

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/assignments/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studentId: parseInt(studentId),
          assignmentId: parseInt(assignmentId),
          feedback,
          pointsAwarded: parseInt(points),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");
      setMessage("✅ Feedback saved successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>Feedback for Student #{studentId}</Typography>

        <TextField
          label="Feedback"
          fullWidth
          multiline
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          margin="normal"
        />

        <TextField
          label="Points Awarded"
          type="number"
          fullWidth
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          margin="normal"
        />

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={onClose} color="error" variant="outlined">Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Save"}
          </Button>
        </Box>

        {message && <Typography mt={2} color={message.startsWith("✅") ? "green" : "red"}>{message}</Typography>}
      </Box>
    </Modal>
  );
}

