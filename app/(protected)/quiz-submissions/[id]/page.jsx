"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import Cookies from "js-cookie";
import axios from "axios";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  cardBg: "#f9f9fc",
  avatarBg: "#eaf6e7",
  progress: "#ea9127",
  textPrimary: "#1a223f",
  textSecondary: "#6b7a99",
};

export default function QuizSubmissionsPage() {
  const { id } = useParams(); // quizId
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchQuizAndQuestions() {
      try {
        const quizRes = await axios.get(`http://localhost:8080/api/quizzes/${id}`, {
          withCredentials: true,
        });
        setQuiz(quizRes.data);

        const questionsData = await Promise.all(
          quizRes.data.questionIds.map(async (questionId) => {
            const questionRes = await axios.get(`http://localhost:8080/api/questions/${questionId}`, {
              withCredentials: true,
            });
            return questionRes.data;
          })
        );

        setQuestions(questionsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuizAndQuestions();
  }, [id]);

  async function fetchSubmissions() {
    setSubmissionsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/assessments/submissions`, {
        withCredentials: true,
      });
      const allSubmissions = res.data._embedded.assessmentSubmissionDTOList;

      const filtered = allSubmissions.filter((sub) => sub.assessmentId === quiz.assessmentId);
      setSubmissions(filtered);
    } catch (err) {
      console.error(err);
      setError("Failed to load submissions.");
    } finally {
      setSubmissionsLoading(false);
    }
  }

  function handleToggleSubmissions() {
    if (!showSubmissions) {
      fetchSubmissions();
    }
    setShowSubmissions((prev) => !prev);
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "#f4f4f9",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f4f4f9",
        minHeight: "100vh",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <Box maxWidth="1000px" mx="auto">
        {/* Quiz Info */}
        <Card sx={{ mb: 4, backgroundColor: palette.cardBg }}>
          <CardContent>
            <Typography variant="h4" fontWeight="bold" gutterBottom color={palette.textPrimary}>
              Quiz #{quiz.id}
            </Typography>
            <Typography variant="subtitle1" gutterBottom color={palette.textSecondary}>
              Assessment ID: {quiz.assessmentId}
            </Typography>
            <Typography variant="subtitle2" gutterBottom color={palette.textSecondary}>
              Points per Question: {quiz.pointForQuestion}
            </Typography>
          </CardContent>
        </Card>

        <Divider sx={{ my: 3 }} />

        {/* Questions List */}
        <Stack spacing={3}>
          {questions.map((q, index) => (
            <Card
              key={q.id}
              sx={{
                backgroundColor: palette.cardBg,
                transition: "0.2s",
                "&:hover": {
                  transform: "scale(1.01)",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color={palette.textPrimary}>
                  Question {index + 1}: {q.questionText}
                </Typography>
                <Typography variant="body2" color={palette.textSecondary} sx={{ mb: 2 }}>
                  Difficulty: {q.difficulty} | Points: {q.points}
                </Typography>

                <Stack spacing={1}>
                  {q.options.map((option, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1,
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: option === q.correctAnswer ? "#d4edda" : "#ffffff",
                        transition: "0.2s",
                        "&:hover": {
                          backgroundColor: option === q.correctAnswer ? "#c3e6cb" : "#f0f0f0",
                        },
                      }}
                    >
                      <Typography color={palette.textPrimary}>
                        {String.fromCharCode(65 + idx)}) {option}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Toggle Submissions Button */}
        <Box textAlign="center" mt={6}>
          <Button
            variant="contained"
            onClick={handleToggleSubmissions}
            sx={{
              bgcolor: palette.primary,
              "&:hover": { bgcolor: palette.accent },
              px: 4,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            {showSubmissions ? "Hide Submissions" : "Show Submissions"}
          </Button>
        </Box>

        {/* Submissions Section */}
        {showSubmissions && (
          <Box mt={5}>
            {submissionsLoading ? (
              <Box textAlign="center">
                <CircularProgress />
              </Box>
            ) : submissions.length > 0 ? (
              <Stack spacing={2}>
                {submissions.map((sub) => (
                  <Card
                    key={sub.id}
                    sx={{
                      backgroundColor: palette.avatarBg,
                      transition: "0.2s",
                      "&:hover": {
                        transform: "scale(1.01)",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent>
                      <Typography fontWeight="bold" color={palette.textPrimary}>
                        Submission ID: {sub.id}
                      </Typography>
                      <Typography color={palette.textSecondary}>
                        Student ID: {sub.studentId}
                      </Typography>
                      
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography textAlign="center" mt={2} color={palette.textSecondary}>
                No submissions found.
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
