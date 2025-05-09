"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useSound from "use-sound";
import confetti from "canvas-confetti";
import {
  Box,
  Typography,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  LinearProgress,
} from "@mui/material";

const API = "http://localhost:8080/api";
const emojis = ["🦉", "🧸", "🌈", "🎲", "🚀", "🐸", "📚", "🧠", "🎯", "🍎"];

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const [playSuccess] = useSound("/sounds/success.mp3", { volume: 0.5 });

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        const quizRes = await fetch(`${API}/quizzes/${id}`, {
          credentials: "include",
        });
        if (!quizRes.ok) throw new Error("Failed to load quiz");

        const quizData = await quizRes.json();
        setQuiz(quizData);

        if (!quizData.questionIds || quizData.questionIds.length === 0) {
          setQuizQuestions([]);
          return;
        }

        const questionsRes = await fetch(`${API}/questions`, {
          credentials: "include",
        });
        if (!questionsRes.ok) throw new Error("Failed to load questions");

        const allQuestions = await questionsRes.json();
        const filtered = allQuestions.filter((q) =>
          quizData.questionIds.includes(q.id)
        );
        setQuizQuestions(filtered);
      } catch (err) {
        console.error(err);
        setQuizQuestions([]);
      }
    };

    fetchQuizAndQuestions();
  }, [id]);

  const updateProgress = (newAnswers) => {
    const answeredCount = Object.keys(newAnswers).length;
    setProgress((answeredCount / quizQuestions.length) * 100);
  };

  const handleOptionToggle = (questionId, option) => {
    setAnswers((prev) => {
      const current = prev[questionId] || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      const next = { ...prev, [questionId]: updated };
      updateProgress(next);
      return next;
    });
  };

  const handleTextAnswer = (questionId, value) => {
    const next = { ...answers, [questionId]: [value] };
    setAnswers(next);
    updateProgress(next);
  };

  const handleSubmit = async () => {
    try {
      const studentId = Number(Cookies.get("currentUserId") || 0);
      if (!quiz || !quiz.assessmentId || studentId === 0) {
        setMessage("❌ Missing quiz or student info");
        return;
      }

      const unanswered = quizQuestions.filter(
        (q) => !answers[q.id] || answers[q.id].length === 0
      );
      if (unanswered.length > 0) {
        setMessage("❌ Please answer all questions before submitting.");
        return;
      }

      const payload = {
        assessmentId: quiz.assessmentId,
        studentId,
        quizAnswers: answers,
      };

      const res = await fetch(`${API}/assessments/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");

      setMessage("✅ Answers submitted successfully!");
      playSuccess(); // 🔊 صوت النجاح
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } }); // ✨ نجوم

      setTimeout(() => {
        router.push("/student-dashboard");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error submitting quiz");
    }
  };

  const getDifficultyColor = (level) => {
    if (level === "EASY") return "#A3D9A5";
    if (level === "AVERAGE") return "#FFE082";
    if (level === "HARD") return "#EF9A9A";
    return "#E0E0E0";
  };

  return (
    <Box
      sx={{
        background: "#FFFBF0",
        height: "100vh",
        overflowY: "auto",
        fontFamily: "'Jaldi', sans-serif",
        p: { xs: 2, md: 6 },
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
        textAlign="center"
        sx={{
          background: "linear-gradient(to right, #FFB74D, #A3B18A)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 2,
        }}
      >
        Quiz #{id}
      </Typography>

      <Box sx={{ maxWidth: 500, mx: "auto", mb: 4 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 15,
            borderRadius: 7,
            backgroundColor: "#FFF",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#A3B18A",
              borderRadius: 7,
            },
          }}
        />
        <Typography textAlign="center" mt={1} fontWeight="bold" color="#4E5D42">
          {Math.round(progress)}% completed
        </Typography>
      </Box>

      {quizQuestions.map((q, idx) => (
        <Paper
          key={q.id}
          elevation={4}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 8,
            backgroundColor: "#FFF9E0",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            transition: "0.2s",
            "&:hover": { transform: "scale(1.01)" },
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#5D4037"
            fontSize="1.3rem"
            mb={1}
          >
            {emojis[idx % emojis.length]} {q.questionText}
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Box
              px={2}
              py={0.5}
              borderRadius={20}
              bgcolor={getDifficultyColor(q.difficulty)}
              fontWeight="bold"
            >
              Difficulty: {q.difficulty}
            </Box>
            <Box>⭐ Points: {q.points}</Box>
          </Box>

          {q.options?.length ? (
            q.options.map((opt) => (
              <FormControlLabel
                key={opt}
                control={
                  <Checkbox
                    checked={answers[q.id]?.includes(opt) || false}
                    onChange={() => handleOptionToggle(q.id, opt)}
                    sx={{
                      color: "#A3B18A",
                      "&.Mui-checked": { color: "#7F9E72" },
                    }}
                  />
                }
                label={opt}
                sx={{
                  display: "block",
                  mb: 1,
                  pl: 1,
                  backgroundColor: answers[q.id]?.includes(opt)
                    ? "#E6F4EA"
                    : "transparent",
                  borderRadius: 3,
                }}
              />
            ))
          ) : (
            <TextField
              variant="outlined"
              placeholder="Your answer..."
              fullWidth
              onChange={(e) => handleTextAnswer(q.id, e.target.value)}
              sx={{
                mt: 1,
                backgroundColor: "#fff",
                borderRadius: "30px",
                "& fieldset": { borderRadius: "30px" },
              }}
            />
          )}
        </Paper>
      ))}

      {quizQuestions.length > 0 && (
        <Box textAlign="center" mt={5}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#FFDE8A",
              color: "#4E5D42",
              fontWeight: "bold",
              fontSize: "1.2rem",
              borderRadius: 10,
              px: 6,
              py: 1.5,
              "&:hover": { backgroundColor: "#FFD54F" },
            }}
            onClick={handleSubmit}
          >
            Submit Quiz
          </Button>
        </Box>
      )}

      {message && (
        <Typography
          variant="body1"
          mt={3}
          textAlign="center"
          fontWeight="bold"
          color={message.startsWith("✅") ? "green" : "error"}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
}
