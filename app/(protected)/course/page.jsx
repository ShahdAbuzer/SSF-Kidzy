"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Fade,
  Avatar,
  Grid,
  TextField,
  Collapse,
  Alert,
  CssBaseline,
  CircularProgress,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../components/Navbar";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 5;

  const router = useRouter();

  const palette = {
    primary: "#38761d",
    accent: "#ea9127",
    background: "linear-gradient(135deg,#f7fafd 0%,#e3e8f0 100%)",
    glass: "rgba(255,255,255,0.7)",
    border: "rgba(210, 154, 114, 0.08)",
    textPrimary: "#1a223f",
    textSecondary: "#6b7a99",
    shadow: "0 8px 32px 0 rgba(164, 158, 45, 0.12)",
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/course", {
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      const courseList = data?._embedded?.courseDTOList || [];
      setCourses(courseList);
      Cookies.set("myCourses", JSON.stringify(courseList), { expires: 7 });
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("http://localhost:8080/api/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      setMessage("✅ Course added!");
      setTitle("");
      setDescription("");
      setShowForm(false);
      fetchCourses();
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <Box sx={{ height: "100vh", overflowY: "auto" }}>
              <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background: palette.background,
          fontFamily: "'Inter', sans-serif",
          py: { xs: 3, md: 6 },
        }}
      >
        <CssBaseline />
        <Box
          sx={{
            px: { xs: 2, md: 6 },
            py: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
         
          <SchoolIcon sx={{ color: palette.primary, fontSize: 36, ml: 1 }} />
          <Typography variant="h4" fontWeight={900} color={palette.primary} sx={{ letterSpacing: 1 }}>
            Courses
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={8}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 5 },
                borderRadius: 5,
                background: palette.glass,
                boxShadow: palette.shadow,
                border: `1.5px solid ${palette.border}`,
                mb: 4,
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={800} color={palette.textPrimary}>
                  All Courses
                </Typography>
                <Button
                  startIcon={showForm ? <ArrowBackIcon /> : <AddIcon />}
                  variant={showForm ? "outlined" : "contained"}
                  onClick={() => setShowForm((v) => !v)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: showForm ? "transparent" : palette.primary,
                    color: showForm ? palette.primary : "#fff",
                    borderColor: palette.primary,
                    borderRadius: 3,
                    boxShadow: palette.shadow,
                    "&:hover": {
                      bgcolor: palette.accent,
                      color: "#fff",
                      borderColor: palette.accent,
                    },
                  }}
                >
                  {showForm ? "Cancel" : "Add New Course"}
                </Button>
              </Box>

              <Collapse in={showForm}>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ mt: 2, mb: 3, background: "rgba(255,255,255,0.6)", p: 3, borderRadius: 4 }}
                >
                  <TextField
                    label="Course Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    fullWidth
                    multiline
                    minRows={2}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      bgcolor: palette.primary,
                      color: "#fff",
                      fontWeight: 700,
                      borderRadius: 3,
                      px: 4,
                      py: 1,
                      boxShadow: palette.shadow,
                      "&:hover": { bgcolor: palette.accent },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Collapse>

              <Collapse in={!!message}>
                <Alert
                  severity={message.startsWith("✅") ? "success" : "error"}
                  sx={{ mb: 2, fontWeight: 700 }}
                  onClose={() => setMessage("")}
                >
                  {message}
                </Alert>
              </Collapse>

              <TextField
                label="Search Courses"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                sx={{ mb: 3 }}
              />

              {loading ? (
                <Box display="flex" justifyContent="center" py={6}>
                  <CircularProgress sx={{ color: palette.primary }} />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ fontWeight: 700 }}>
                  🚨 {error}
                </Alert>
              ) : (
                <>
                  <List dense>
                    {currentCourses.length === 0 ? (
                      <Typography color={palette.textSecondary} fontWeight={600} fontSize={16}>
                        No matching courses.
                      </Typography>
                    ) : (
                      currentCourses.map((course, idx) => (
                        <Fade in key={course.courseId}>
                          <Box>
                            <ListItem
                              alignItems="flex-start"
                              sx={{
                                gap: 2,
                                px: 0,
                                py: 2,
                                cursor: "pointer",
                                borderRadius: 3,
                                transition: "0.2s",
                                "&:hover": {
                                  bgcolor: "rgba(234,145,39,0.08)",
                                  boxShadow: "0 2px 12px 0 rgba(234,145,39,0.08)",
                                },
                              }}
                              onClick={() => router.push(`/courses/${course.courseId}`)}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: palette.accent,
                                  color: "#fff",
                                  width: 36,
                                  height: 36,
                                  fontWeight: 700,
                                  fontSize: 18,
                                  boxShadow: palette.shadow,
                                  mr: 2,
                                }}
                              >
                                {course.title?.[0] || "C"}
                              </Avatar>
                              <ListItemText
                                primary={
                                  <Typography fontWeight={800} fontSize={18} color={palette.textPrimary}>
                                    {course.title}
                                  </Typography>
                                }
                                secondary={
                                  <Typography fontSize={15} color={palette.textSecondary}>
                                    {course.description}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            {idx < currentCourses.length - 1 && <Divider light sx={{ my: 1 }} />}
                          </Box>
                        </Fade>
                      ))
                    )}
                  </List>

                  <Box display="flex" justifyContent="space-between" mt={2}>
                    <Button
                      variant="outlined"
                      disabled={currentPage === 1}
                      onClick={handlePrevPage}
                      sx={{ borderRadius: 3 , color: palette.primary, borderColor: palette.primary }}
                    >
                      Previous
                    </Button>
                    <Typography fontWeight={600}>
                      Page {currentPage} of {totalPages}
                    </Typography>
                    <Button
                      variant="outlined"
                      disabled={currentPage === totalPages}
                      onClick={handleNextPage}
                      sx={{ borderRadius: 3 , color: palette.primary, borderColor: palette.primary }}
                    >
                      Next
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
