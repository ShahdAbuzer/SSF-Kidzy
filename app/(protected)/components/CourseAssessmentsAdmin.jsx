"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Stack,
  LinearProgress,
  Tooltip,
  Modal,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  cardBg: "#f9f9fc",
  avatarBg: "#eaf6e7",
  progress: "#ea9127",
  textPrimary: "#1a223f",
  textSecondary: "#6b7a99",
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 4,
};

function getInitials(title) {
  return title ? title[0].toUpperCase() : "A";
}

export default function CourseAssessmentsAdmin({ courseId }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [addErrors, setAddErrors] = useState({ title: "", description: "" });
  const [addMessage, setAddMessage] = useState("");

  const router = useRouter();

  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/assessments", {
        credentials: "include",
      });
      const data = await res.json();
      const filtered = data.filter((a) => a.courseId == courseId);
      setAssessments(filtered);
    } catch (err) {
      setError("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleEditClick = (assessment) => {
    setSelectedAssessment(assessment);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/assessments/${selectedAssessment.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(selectedAssessment),
        }
      );

      if (!res.ok) throw new Error("Failed to update assessment");

      setEditModalOpen(false);
      fetchAssessments();
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleAddAssessment = async () => {
    setAddMessage("");
    const errors = {
      title: newTitle.trim() ? "" : "❌ Title is required",
      description: newDescription.trim() ? "" : "❌ Description is required",
    };
    setAddErrors(errors);

    if (errors.title || errors.description) return;

    try {
      const res = await fetch("http://localhost:8080/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          courseId: courseId,
        }),
      });

      if (!res.ok) throw new Error("Failed to add assessment");

      setNewTitle("");
      setNewDescription("");
      setAddModalOpen(false);
      fetchAssessments();
    } catch (err) {
      setAddMessage("❌ " + err.message);
    }
  };

  return (
    <Box mt={3}>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : assessments.length === 0 ? (
        <Typography>📭 No assessments for this course.</Typography>
      ) : (
        <Stack spacing={2}>
          {assessments.map((a) => (
            <Card key={a.id} sx={{ backgroundColor: palette.cardBg }}>
              <CardContent>
                <Stack direction="row" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: palette.primary,
                      color: "#fff",
                      width: 48,
                      height: 48,
                      fontWeight: 700,
                      fontSize: 22,
                    }}
                  >
                    {getInitials(a.title)}
                  </Avatar>

                  <Box flex={1}>
                    <Typography
                      fontWeight={700}
                      fontSize={18}
                      color={palette.textPrimary}
                    >
                      {a.title}
                    </Typography>
                    <Typography color={palette.textSecondary} fontSize={14}>
                      {a.description}
                    </Typography>

                    <Box mt={1}>
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          background: "#e4e9ef",
                          "& .MuiLinearProgress-bar": {
                            background: palette.progress,
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Stack>
              </CardContent>

              <CardActions sx={{ justifyContent: "flex-end", pr: 2 }}>
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => handleEditClick(a)}
                    sx={{
                      bgcolor: "#fff",
                      color: palette.accent,
                      border: `1px solid ${palette.accent}`,
                      "&:hover": { bgcolor: palette.accent, color: "#fff" },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="View Submissions">
                  <IconButton
                    onClick={() =>
                      router.push(
                        `/admin-dashboard/course/courses/assessment-inst/${a.id}`
                      )
                    }
                    sx={{
                      bgcolor: "#fff",
                      color: palette.primary,
                      border: `1px solid ${palette.primary}`,
                      "&:hover": { bgcolor: palette.primary, color: "#fff" },
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}

      {/* ✏️ Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Edit Assessment
          </Typography>
          <TextField
            label="Title"
            fullWidth
            value={selectedAssessment?.title || ""}
            onChange={(e) =>
              setSelectedAssessment((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={selectedAssessment?.description || ""}
            onChange={(e) =>
              setSelectedAssessment((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="error"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveEdit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* ➕ Add Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={2}>
            Add Assessment
          </Typography>
          <TextField
            label="Title"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            error={!!addErrors.title}
            helperText={addErrors.title}
            margin="normal"
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            error={!!addErrors.description}
            helperText={addErrors.description}
            margin="normal"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="outlined"
              color="error"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddAssessment}>
              Save
            </Button>
          </Box>
          {addMessage && (
            <Typography
              mt={2}
              color={addMessage.startsWith("❌") ? "error" : "green"}
            >
              {addMessage}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
