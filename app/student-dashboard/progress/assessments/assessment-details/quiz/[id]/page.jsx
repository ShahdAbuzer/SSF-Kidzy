"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
import LoaderWaves from "../../../../../../(protected)/components/Loader";

const API = "http://localhost:8080/api";
const emojis = ["🦉", "🧸", "🌈", "🎲", "🚀", "🐸", "📚", "🧠", "🎯", "🍎"];

export default function QuizPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);
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
          setLoading(false);
          return;
        }

        const questionsRes = await fetch(`${API}/questions/quiz/${id}`, {
          credentials: "include",
        });
        if (!questionsRes.ok) throw new Error("Failed to load questions");

        const allQuestions = await questionsRes.json();
        setQuizQuestions(allQuestions);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setQuizQuestions([]);
        setLoading(false);
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
      setIsSubmitting(true);
      const studentId = Number(Cookies.get("currentUserId") || 0);
      if (!quiz || !quiz.assessmentId || studentId === 0) return;

      const unanswered = quizQuestions.filter(
        (q) => !answers[q.id] || answers[q.id].length === 0
      );
      if (unanswered.length > 0) return;

      let score = 0;
      let max = 0;
      const wrong = [];

      quizQuestions.forEach((q) => {
        const userAnswer = answers[q.id]?.[0];
        if (userAnswer === q.correctAnswer) {
          score += q.points;
        } else {
          wrong.push(q.id);
        }
        max += q.points;
      });

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

      setWrongAnswers(wrong);
      setTotalScore(score);
      setTotalPossible(max);
      playSuccess();
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });

      setShowResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (level) => {
    if (level === "EASY") return "#A3D9A5";
    if (level === "AVERAGE") return "#FFE082";
    if (level === "HARD") return "#EF9A9A";
    return "#E0E0E0";
  };

  if (isSubmitting) {
    return (
      <>
        <style jsx>{`
          .loader {
            display: inline-flex;
            gap: 10px;
          }
          .loader:before,
          .loader:after {
            content: "";
            height: 20px;
            aspect-ratio: 1;
            border-radius: 50%;
            background:
              linear-gradient(#222 0 0) top/100% 40% no-repeat,
              radial-gradient(farthest-side, #000 95%, #0000) 50%/8px 8px
                no-repeat #fff;
            animation: l7 1.5s infinite alternate ease-in;
          }
          @keyframes l7 {
            0%,
            70% {
              background-size: 100% 40%, 8px 8px;
            }
            85% {
              background-size: 100% 120%, 8px 8px;
            }
            100% {
              background-size: 100% 40%, 8px 8px;
            }
          }
        `}</style>

        <Box
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "#FFFDF2", fontFamily: "'Jaldi', sans-serif" }}
        >
          <Typography variant="h4" fontWeight="bold" color="#7F9E72" mb={3}>
            🧠 Grading your quiz...
          </Typography>
          <LoaderWaves />

          <Box className="loader" />
        </Box>
      </>
    );
  }

  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ backgroundColor: "#FFFDF2", fontFamily: "'Jaldi', sans-serif" }}
      >
        <Typography variant="h4" fontWeight="bold" color="#7F9E72" mb={2}>
          Loading your quiz... 🎉
        </Typography>
        <LinearProgress
          variant="indeterminate"
          sx={{
            width: "60%",
            height: 10,
            borderRadius: 5,
            backgroundColor: "#E5E5E5",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#A3B18A",
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "#FFFBF0",
        height: "100vh",
        overflowY: "auto",
        fontFamily: "'Jaldi', sans-serif",
        p: { xs: 2, md: 6 },
        position: "relative",
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
            backgroundColor: wrongAnswers.includes(q.id)
              ? "#FFEAEA"
              : "#FFF9E0",
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

      {quizQuestions.length > 0 && !showResult && (
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

      {showResult && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgcolor="rgba(0,0,0,0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={9999}
        >
          <Box
            bgcolor="#FFF9E0"
            p={4}
            borderRadius={6}
            textAlign="center"
            boxShadow="0 8px 20px rgba(0,0,0,0.2)"
          >
            <Typography variant="h4" fontWeight="bold" color="#4E5D42">
              🎉 You scored {totalScore} out of {totalPossible}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setShowResult(false)}
              sx={{
                mt: 3,
                backgroundColor: "#A3B18A",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 4,
                px: 4,
                "&:hover": { backgroundColor: "#8DA87B" },
              }}
            >
              OK
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
