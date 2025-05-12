"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  LinearProgress,
  TextField,
  InputAdornment,
  MenuItem,
  IconButton,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoaderWaves from "../../components/Loader";

const API = "http://localhost:8080/api";
const emojiList = [
  "🐢",
  "☁️",
  "🚀",
  "🌟",
  "🪐",
  "📘",
  "🧠",
  "🍎",
  "🐸",
  "🎨",
];

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [assessment, setAssessment] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const perPage = 4;

  useEffect(() => {
    fetch(`${API}/assessments/${id}`, { credentials: "include" })
      .then((r) => {
        if (!r.ok) throw new Error("Assessment load failed");
        return r.json();
      })
      .then(setAssessment)
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    setLoadingQuizzes(true);
    fetch(`${API}/quizzes`, { credentials: "include" })
      .then((r) => r.json())
      .then((list) => {
        const related = list.filter((q) => q.assessmentId === Number(id));
        setQuizzes(related);
        setFiltered(related);
        setPage(1);
      })
      .catch(console.error)
      .finally(() => setLoadingQuizzes(false));
  }, [id]);

  useEffect(() => {
    let tmp = quizzes.filter((q) =>
      (`quiz ${q.id} (${q.questionIds?.length} Qs)`)
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    tmp.sort((a, b) =>
      sortOrder === "asc"
        ? a.questionIds.length - b.questionIds.length
        : b.questionIds.length - a.questionIds.length
    );
    setFiltered(tmp);
    setPage(1);
  }, [search, sortOrder, quizzes]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  if (!assessment) {
    return (
      <Box
        sx={{
          backgroundColor: "#FFFDF3",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: 4,
        }}
      >
        <LoaderWaves />
        <Typography mt={2} fontWeight="bold" color="#e0a267">
          Loading assessment...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#FFFDF3",
        minHeight: "100vh",
        p: 4,
        fontFamily: "Jaldi, sans-serif",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{
          background: "linear-gradient(90deg, #FFA726, #FFCA28, #A3B18A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {assessment.title}
      </Typography>

      <Typography
        variant="body1"
        textAlign="center"
        maxWidth={600}
        mx="auto"
        mb={4}
      >
        {assessment.description}
      </Typography>

      <Grid container spacing={2} justifyContent="center" mb={3}>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            placeholder="Search quizzes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <TextField
            select
            fullWidth
            label="Sort by # questions"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="asc">Few → Many</MenuItem>
            <MenuItem value="desc">Many → Few</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="center">
        {loadingQuizzes
          ? [...Array(4)].map((_, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Paper
                  elevation={2}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#FFF9E0",
                    gap: 2,
                  }}
                >
                  <Typography
                    fontSize="2.5rem"
                    color="rgba(0,0,0,0.1)"
                    sx={{ userSelect: "none" }}
                  >
                    {emojiList[idx % emojiList.length]}
                  </Typography>
                  <Box flexGrow={1}>
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="rectangular" height={8} sx={{ my: 1 }} />
                  </Box>
                  <Skeleton
                    variant="rounded"
                    width={80}
                    height={36}
                    sx={{ borderRadius: "20px" }}
                  />
                </Paper>
              </Grid>
            ))
          : pageItems.map((q) => (
              <Grid item xs={12} sm={6} key={q.id}>
                <Paper
                  elevation={4}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: "#FFF9E0",
                    gap: 2,
                  }}
                >
                  <Typography fontSize="2.5rem">
                    {emojiList[q.id % emojiList.length]}
                  </Typography>
                  <Box flexGrow={1}>
                    <Typography variant="h6">Quiz #{q.id}</Typography>
                    <Typography>
                      Questions: {q.questionIds?.length || 0}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(
                        100,
                        (q.questionIds?.length || 0) * (100 / perPage)
                      )}
                    />
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => router.push(`/quiz/${q.id}`)}
                  >
                    Start
                  </Button>
                </Paper>
              </Grid>
            ))}
      </Grid>

      <Box mt={4} display="flex" justifyContent="center" alignItems="center">
        <IconButton
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography mx={2}>
          Page {page} of {totalPages}
        </Typography>
        <IconButton
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
