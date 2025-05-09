"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  TextField,
  Pagination,
  Button,
  Stack,
  Avatar,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Cookies from "js-cookie";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  cardBg: "#f9f9fc",
  avatarBg: "#eaf6e7",
  progress: "#ea9127",
  textPrimary: "#1a223f",
  textSecondary: "#6b7a99",
};

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [assessment, setAssessment] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 6;

  const fetchData = async () => {
    try {
      const resAssessment = await fetch(`http://localhost:8080/api/assessments/${id}`, {
        credentials: "include",
      });
      if (!resAssessment.ok) throw new Error("Failed to load assessment");
      const assessmentData = await resAssessment.json();
      setAssessment(assessmentData);

      const resQuiz = await fetch("http://localhost:8080/api/quizzes", {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });
      if (!resQuiz.ok) throw new Error("Failed to load quizzes");
      const allQuizzes = await resQuiz.json();
      const related = allQuizzes.filter((q) => q.assessmentId === Number(id));
      setQuizzes(related);
      setFilteredQuizzes(related);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchQuery(value);
    const filtered = quizzes.filter(
      (q) =>
        q.id.toString().includes(value) ||
        q.pointForQuestion?.toString().includes(value) ||
        q.questionIds?.join(",").includes(value)
    );
    setFilteredQuizzes(filtered);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * quizzesPerPage;
  const indexOfFirst = indexOfLast - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);

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
      
        {loading ? (
          <CircularProgress
    sx={{ color: "#38761d" , mt: 40 ,ml:50}}
    size={50}  // make it big
  />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <>
            {/* تقييم */}
            <Card sx={{ mb: 4, backgroundColor: palette.cardBg }}>
              <CardContent>
                <Typography fontSize={24} fontWeight="bold" color={palette.textPrimary}>
                  {assessment.title}
                </Typography>
                <Typography mt={1} color={palette.textSecondary}>
                  {assessment.description}
                </Typography>
                <Typography mt={1} fontSize={13} color={palette.textSecondary}>
                  Course ID: {assessment.courseId}
                </Typography>
              </CardContent>
            </Card>

            {/* بحث وزر */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <TextField
                variant="outlined"
                size="small"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={handleSearch}
                sx={{ width: 250 }}
              />
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                color="success"
                onClick={() => router.push(`/create-quiz/${id}`)}
              >
                Create New Quiz
              </Button>
            </Box>

            {/* عرض الكويزات */}
            {currentQuizzes.length === 0 ? (
              <Typography color="textSecondary">📭 No quizzes found.</Typography>
            ) : (
              <Grid container spacing={3}>
                {currentQuizzes.map((quiz) => (
                  <Grid item xs={12} sm={6} md={4} key={quiz.id}>
                    <Card
                      onClick={() => router.push(`/quiz-submissions/${quiz.id}`)}
                      sx={{
                        backgroundColor: palette.cardBg,
                        cursor: "pointer",
                        transition: "0.2s",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: palette.primary, color: "#fff" }}>
                            {quiz.id}
                          </Avatar>
                          <Box>
                            <Typography fontWeight={600}>Quiz #{quiz.id}</Typography>
                            <Typography fontSize={13} color={palette.textSecondary}>
                              Points per question: {quiz.pointForQuestion}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box mt={2}>
                          <Typography fontSize={13} color={palette.textSecondary}>
                            Question IDs:
                          </Typography>
                          <Typography fontSize={14}>
                            {quiz.questionIds?.length > 0
                              ? quiz.questionIds.join(", ")
                              : "No questions added"}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* pagination */}
            {totalPages > 1 && (
              <Box mt={4} display="flex" justifyContent="center">
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(e, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
