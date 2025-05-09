"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  IconButton,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import FeedbackModal from "../../components/FeedbackModal";
import EditIcon from "@mui/icons-material/Edit";
import FeedbackIcon from "@mui/icons-material/Feedback";

const API = "http://localhost:8080/api";

const palette = {
  primary: "#38761d",   // الأخضر الأساسي
  accent:  "#ea9127",   // البرتقالي
  bg:      "#f5f6fc",   // خلفية الصفحة
};

export default function AssignmentInstructorPage() {
  /* ---------- state ---------- */
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks,   setFeedbacks]   = useState({});
  const [modalOpen,   setModalOpen]   = useState(false);
  const [selectedStudent,    setSelectedStudent]    = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");

  /* ---------- helpers ---------- */
  const loadEverything = async () => {
    try {
      // 1) fetch submissions
      const subRes = await fetch(`${API}/assignments/submissions`, {
        credentials: "include",
      });
      const subData = await subRes.json();
      const subs = subData._embedded?.assignmentSubmissionDTOList || [];
      setSubmissions(subs);

      // 2) fetch feedback for **each** submission in parallel
      const fbPromises = subs.map((s) =>
        fetch(`${API}/assignments/feedback/${s.id}`, {
          credentials: "include",
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      );

      const fbResults = await Promise.all(fbPromises);

      // 3) build quick-lookup map  assignmentId-studentId  ➜  feedback
      const fbMap = {};
      fbResults.forEach((fb) => {
        if (fb)
          fbMap[`${fb.assignmentId}-${fb.studentId}`] = fb;
      });
      setFeedbacks(fbMap);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- mount ---------- */
  useEffect(() => {
    loadEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- when modal saves ---------- */
  const handleSuccess = (newFb) => {
    setFeedbacks((prev) => ({
      ...prev,
      [`${newFb.assignmentId}-${newFb.studentId}`]: newFb,
    }));
  };

  /* ---------- search ---------- */
  const filtered = submissions.filter((s) => {
    const key = `${s.assignmentId}-${s.studentId}`;
    return (
      String(s.studentId).includes(search) ||
      feedbacks[key]?.studentName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <Box textAlign="center" my={10}>
        <CircularProgress />
      </Box>
    );
  }

  /* ---------- UI ---------- */
  return (
    <Box sx={{ p: 3, background: palette.bg, minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Assignment Submissions
      </Typography>

      <TextField
        label="Search by Student ID or Name"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filtered.map((submission, idx) => {
          const key   = `${submission.assignmentId}-${submission.studentId}`;
          const fb    = feedbacks[key];
          const fileUrl = `${API}/${submission.filePath.replace(/\\/g, "/")}`;

          return (
            <Grid item xs={12} sm={6} md={4} key={submission.id}>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#fff",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {/* ===== header ===== */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      bgcolor: palette.primary,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {idx + 1}
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight="bold">
                      Student #{submission.studentId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assignment ID: {submission.assignmentId}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedAssignment(submission.assignmentId);
                      setSelectedStudent(submission.studentId);
                      setModalOpen(true);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* ===== details ===== */}
                <Typography variant="body2">
                  <strong>Submitted at:</strong>{" "}
                  {new Date(submission.submittedAt).toLocaleString()}
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: palette.primary,
                    "&:hover": { bgcolor: "#2e5a12" },
                  }}
                  onClick={() => window.open(fileUrl, "_blank")}
                >
                  View File
                </Button>

                {/* ===== feedback ===== */}
                {fb ? (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 1,
                      bgcolor: "#fff8e6",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                    }}
                  >
                    <FeedbackIcon sx={{ color: palette.accent, mt: "3px" }} />
                    <Box>
                      <Typography variant="body2" sx={{ mb: 0.5 }}>
                        <strong>Feedback:</strong> {fb.feedback}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Points:</strong> {fb.pointsAwarded}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ opacity: 0.8 }}
                  >
                    No feedback yet.
                  </Typography>
                )}
              </Paper>
            </Grid>
          );
        })}

        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Typography align="center" color="gray">
              No submissions found.
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* ===== modal ===== */}
      <FeedbackModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        assignmentId={selectedAssignment}
        studentId={selectedStudent}
        existingFeedback={
          selectedAssignment && selectedStudent
            ? feedbacks[`${selectedAssignment}-${selectedStudent}`]
            : null
        }
        onSuccess={handleSuccess}
      />
    </Box>
  );
}
