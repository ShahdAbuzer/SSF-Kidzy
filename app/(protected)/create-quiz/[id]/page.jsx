"use client";

import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  cardBg: "#f9f9fc",
  avatarBg: "#eaf6e7",
  progress: "#ea9127",
  textPrimary: "#1a223f",
  textSecondary: "#6b7a99",
};

export default function CreateQuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [questionText, setQuestionText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("EASY");
  const [points, setPoints] = useState(10);
  const [options, setOptions] = useState([""]);
  const [questions, setQuestions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const showSnack = (message, severity = "success") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const resetForm = () => {
    setQuestionText("");
    setCorrectAnswer("");
    setDifficulty("EASY");
    setPoints(10);
    setOptions([""]);
    setEditingIndex(null);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleAddOrUpdate = () => {
    if (!questionText || !correctAnswer || options.some((opt) => !opt)) {
      showSnack("Please fill all fields.", "warning");
      return;
    }

    const isDuplicate = questions.some(
      (q) => q.questionText.trim().toLowerCase() === questionText.trim().toLowerCase()
    );

    if (isDuplicate && editingIndex === null) {
      showSnack("This question already exists.", "warning");
      return;
    }

    const question = { questionText, correctAnswer, difficulty, points, options };

    if (editingIndex !== null) {
      const updated = [...questions];
      updated[editingIndex] = question;
      setQuestions(updated);
      showSnack("Question updated.");
    } else {
      setQuestions([...questions, question]);
      showSnack("Question added.");
    }

    resetForm();
  };

  const handleEdit = (index) => {
    const q = questions[index];
    setQuestionText(q.questionText);
    setCorrectAnswer(q.correctAnswer);
    setDifficulty(q.difficulty);
    setPoints(q.points);
    setOptions(q.options);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
    showSnack("Question deleted.", "info");
  };

  const handleCreateQuiz = async () => {
    if (questions.length < 2) {
      showSnack("Add at least 2 questions to create a quiz.", "warning");
      return;
    }

    try {
      setIsLoading(true);

      const questionIds = [];
      for (const q of questions) {
        const res = await fetch("http://localhost:8080/api/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(q),
        });
        if (!res.ok) throw new Error("Failed to create question");
        const data = await res.json();
        questionIds.push(data.id);
      }

      const quizRes = await fetch("http://localhost:8080/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          assessmentId: Number(id),
          questionIds,
          pointForQuestion: 5,
        }),
      });

      if (!quizRes.ok) throw new Error("Failed to create quiz");

      showSnack("Quiz created successfully!");
      setTimeout(() => router.back(), 1200);
    } catch (err) {
      showSnack("Error: " + err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

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
      <Box maxWidth="800px" mx="auto">
        {/* Title */}
        <Card sx={{ mb: 4, backgroundColor: palette.cardBg }}>
          <CardContent>
            <Typography variant="h5" fontWeight="bold" color={palette.textPrimary} textAlign="center">
              Create Quiz - Assessment {id}
            </Typography>
          </CardContent>
        </Card>

        {/* Form */}
        <Card sx={{ mb: 4, backgroundColor: palette.cardBg }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                fullWidth
                size="small"
              />
              {options.map((opt, index) => (
                <TextField
                  key={index}
                  label={`Option ${index + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOptions = [...options];
                    newOptions[index] = e.target.value;
                    setOptions(newOptions);
                  }}
                  fullWidth
                  size="small"
                />
              ))}
              <Button
                variant="outlined"
                onClick={handleAddOption}
                sx={{ width: "fit-content", bgcolor: "#f5f5dc", color: "#333" }}
              >
                Add Option
              </Button>

              <TextField
                label="Correct Answer"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                fullWidth
                size="small"
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  select
                  label="Difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  sx={{ flex: 1 }}
                  size="small"
                >
                  <MenuItem value="EASY">Easy</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HARD">Hard</MenuItem>
                </TextField>
                <TextField
                  label="Points"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  sx={{ flex: 1 }}
                  size="small"
                />
              </Stack>
              <Button
                variant="contained"
                onClick={handleAddOrUpdate}
                sx={{ bgcolor: palette.primary, "&:hover": { bgcolor: palette.accent }, width: "fit-content" }}
              >
                {editingIndex !== null ? "Update" : "Add"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card sx={{ mb: 4, backgroundColor: palette.cardBg }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" color={palette.textPrimary} gutterBottom>
              Questions
            </Typography>
            {questions.length === 0 ? (
              <Typography color={palette.textSecondary}>No questions added.</Typography>
            ) : (
              <List>
                {questions.map((q, index) => (
                  <div key={index}>
                    <ListItem
                      secondaryAction={
                        <>
                          <IconButton onClick={() => handleEdit(index)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </>
                      }
                    >
                      <ListItemText
                        primary={q.questionText}
                        secondary={`Correct: ${q.correctAnswer} | Difficulty: ${q.difficulty} | Points: ${q.points}`}
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Box textAlign="center">
          {isLoading ? (
            <CircularProgress sx={{ color: palette.primary }} />
          ) : (
            <Button
              variant="contained"
              disabled={questions.length < 2}
              onClick={handleCreateQuiz}
              sx={{ bgcolor: palette.primary, "&:hover": { bgcolor: palette.accent }, px: 4, py: 1.5 }}
            >
              Create Quiz
            </Button>
          )}
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
