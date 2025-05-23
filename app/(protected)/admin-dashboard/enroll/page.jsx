"use client";

import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import NavbarAdmin from "../../components/NavbarAdmin";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  background: "#FFF9E5",
};

export default function EnrollStudentPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentId, setStudentId] = useState("");
  const [section, setSection] = useState("S1");
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedCourses = Cookies.get("myCourses");
      if (!storedCourses) {
        setError("No courses found in cookies.");
        return;
      }

      const parsed = JSON.parse(storedCourses);
      setCourses(parsed);
    } catch (err) {
      console.error("❌ Failed to load courses from cookies:", err);
      setError("Error reading courses from cookies.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await axios.post(
        "http://localhost:8080/api/takes",
        {
          studentId: parseInt(studentId),
          courseId: parseInt(selectedCourse),
          secId: section,
          grade: grade,
        },
        {
          withCredentials: true,
        }
      );

      setMessage("✅ Student enrolled successfully!");
      setOpen(true);
      setStudentId("");
      setSelectedCourse("");
    } catch (err) {
      console.error("❌ Axios Error:", err);
      setError("❌ Failed to enroll student.");
      setOpen(true);
    }
  };

return (
  <>
    <NavbarAdmin />

    <Box
      sx={{
        color: "#e3e8f0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 5,
        fontFamily: "'Jaldi', sans-serif",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 4,
          maxWidth: 500,
          width: "100%",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(71, 64, 64, 0.52)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            color: palette.primary,
          }}
        >
          Enroll Student
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            type="number"
            fullWidth
            required
            margin="normal"
          />

          <TextField
            select
            label="Select Course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            fullWidth
            required
            margin="normal"
          >
            {courses.map((course) => (
              <MenuItem key={course.courseId} value={course.courseId}>
                {course.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Section ID"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            fullWidth
            required
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: palette.primary,
              color: "#fff",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#2f5f1a",
              },
            }}
          >
            Enroll Student
          </Button>
        </form>
      </Paper>

      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert severity={error ? "error" : "success"}>{error || message}</Alert>
      </Snackbar>
    </Box>
  </>
);

}
