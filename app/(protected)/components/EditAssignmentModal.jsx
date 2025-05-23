"use client";

import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, useEffect } from "react";

export default function EditAssignmentModal({ open, onClose, assignment, onSave }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxPoints, setMaxPoints] = useState("");

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setDueDate(assignment.dueDate?.slice(0, 16));
      setMaxPoints(assignment.maxPoints);
    }
  }, [assignment]);

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/assignments/${assignment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...assignment,
          title,
          description,
          dueDate,
          maxPoints: parseInt(maxPoints),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText);
      }

      onSave();
      onClose();
    } catch (err) {
      alert("❌ Failed to update assignment: " + err.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h6" mb={2} fontWeight={700}>
          Edit Assignment
        </Typography>

        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Due Date"
          type="datetime-local"
          fullWidth
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Max Points"
          type="number"
          fullWidth
          value={maxPoints}
          onChange={(e) => setMaxPoints(e.target.value)}
          margin="normal"
        />

        <Box mt={3} display="flex" justifyContent="space-between" flexDirection={isMobile ? "column" : "row"} gap={2}>
          <Button variant="outlined" color="error" onClick={onClose} fullWidth={isMobile}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} fullWidth={isMobile}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
