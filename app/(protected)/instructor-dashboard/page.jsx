"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CssBaseline,
  Paper,
  Grid,
  Button,
  Fade,
  Avatar,
  LinearProgress,
  Zoom,
  Tooltip,
  IconButton,
  Modal,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import MenuIcon from "@mui/icons-material/Menu";
import Cookies from "js-cookie";

export default function InstructorDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const coursesRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width:900px)");
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);
    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);
    return () => mediaQuery.removeEventListener("change", updateIsMobile);
  }, []);

  useEffect(() => {
    try {
      const storedCourses = Cookies.get("myCourses");
      if (storedCourses) setCourses(JSON.parse(storedCourses));
    } catch (err) {
      console.error("❌ Failed to load courses from cookies:", err);
    }

    fetch("http://localhost:8080/api/assignments", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const list = data?._embedded?.assignmentDTOList || [];
        setAssignments(list);
      })
      .catch(console.error);
  }, []);

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

  const handleScrollToCourses = () => {
    if (coursesRef.current) {
      coursesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  };

  const AssignmentList = (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 5,
        background: palette.glass,
        boxShadow: palette.shadow,
        border: `1.5px solid ${palette.border}`,
        backdropFilter: "blur(12px)",
        mb: 3,
        maxHeight: "70vh",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: palette.primary, mb: 2, letterSpacing: 1 }}
      >
        <AssignmentIcon sx={{ mr: 1, verticalAlign: "middle", color: palette.accent }} />
        Assignments
      </Typography>
      <List dense>
        {assignments.length === 0 ? (
          <Typography fontSize={14} color={palette.textSecondary}>
            No assignments found.
          </Typography>
        ) : (
          assignments.map((a, idx) => (
            <Fade in key={a.id}>
              <Box>
                <ListItem
                  sx={{ alignItems: "flex-start", gap: 2, px: 0, py: 1 }}
                  disablePadding
                >
                  <Avatar
                    sx={{
                      bgcolor: palette.primary,
                      color: "#fff",
                      width: 32,
                      height: 32,
                      fontSize: 16,
                      mt: 0.5,
                    }}
                  >
                    {a.title?.[0] || "A"}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Typography fontSize={15} fontWeight={700} color={palette.textPrimary}>
                        {a.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography fontSize={13} color={palette.textSecondary}>
                          Due: {a.dueDate}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(100, 10 + idx * 12)}
                          sx={{
                            height: 5,
                            borderRadius: 2,
                            mt: 0.5,
                            background: "#e3e8f0",
                            "& .MuiLinearProgress-bar": {
                              background: palette.accent,
                            },
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
                {idx < assignments.length - 1 && <Divider light sx={{ my: 1 }} />}
              </Box>
            </Fade>
          ))
        )}
      </List>
    </Paper>
  );

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        background: palette.background,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <CssBaseline />
      <Navbar />

      <Grid container>
        {/* Sidebar - desktop */}
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: { xs: "none", md: "block" },
            p: 4,
          }}
        >
          {AssignmentList}
          <Button
            onClick={handleLogout}
            variant="outlined"
            fullWidth
            startIcon={<LogoutIcon />}
            sx={{
              mt: 2,
              textTransform: "none",
              fontWeight: 600,
              color: palette.primary,
              borderColor: palette.primary,
              borderRadius: 3,
              py: 1.5,
              letterSpacing: 1,
              bgcolor: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(6px)",
              "&:hover": {
                background: palette.primary,
                color: "#fff",
                borderColor: palette.primary,
              },
            }}
          >
            Logout
          </Button>
        </Grid>

        {/* Main content */}
        <Grid item xs={12} md={9} sx={{ p: { xs: 2, md: 6 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper
                elevation={3}
                sx={{
                  p: 5,
                  borderRadius: 5,
                  background: palette.glass,
                  boxShadow: palette.shadow,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 16px 32px 0 rgba(205, 154, 110, 0.2)",
                    borderColor: palette.accent,
                  },
                }}
                onClick={() => router.push("/instructor-dashboard/course")}
              >
                <Box display="flex" alignItems="center" gap={4}>
                  <SchoolIcon fontSize="large" sx={{ color: palette.primary, fontSize: 48 }} />
                  <Box>
                    <Typography fontWeight={900} fontSize={28} color={palette.textPrimary}>
                      My Courses
                    </Typography>
                    <Typography fontSize={17} color={palette.textSecondary}>
                      View and manage all your teaching content.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 5,
                  border: `1.5px solid ${palette.border}`,
                  background: palette.glass,
                  boxShadow: palette.shadow,
                  cursor: "pointer",
                  transition: "0.2s",
                  "&:hover": {
                    boxShadow: "0 12px 32px 0 rgba(229, 184, 20, 0.15)",
                    borderColor: palette.accent,
                  },
                }}
                onClick={() => router.push("/instructor-dashboard/enroll")}
              >
                <Box display="flex" alignItems="center" gap={3}>
                  <GroupIcon fontSize="large" sx={{ color: palette.accent, fontSize: 40 }} />
                  <Box>
                    <Typography fontWeight={800} fontSize={22} color={palette.textPrimary}>
                      Enroll Students
                    </Typography>
                    <Typography fontSize={15} color={palette.textSecondary}>
                      Add students to your courses.
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Recent Courses */}
          <Box mt={8} ref={coursesRef}>
            <Typography
              variant="h4"
              fontWeight={900}
              gutterBottom
              color={palette.primary}
              sx={{ letterSpacing: 1 }}
            >
              Recent Courses
            </Typography>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 5,
                background: palette.glass,
                border: `1.5px solid ${palette.border}`,
                boxShadow: palette.shadow,
                mt: 2,
              }}
            >
              {courses.length === 0 ? (
                <Typography fontSize={17} color={palette.textSecondary}>
                  No courses found in cookies.
                </Typography>
              ) : (
                <List dense>
                  {courses.map((course, idx) => (
                    <Fade in key={course.courseId}>
                      <Box>
                        <ListItem sx={{ alignItems: "flex-start", gap: 2, px: 0, py: 2 }}>
                          <Avatar
                            sx={{
                              bgcolor: palette.accent,
                              color: "#fff",
                              width: 36,
                              height: 36,
                              fontSize: 18,
                              mt: 0.5,
                              boxShadow: palette.shadow,
                            }}
                          >
                            {course.title?.[0] || "C"}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Typography fontSize={18} fontWeight={800} color={palette.textPrimary}>
                                {course.title}
                              </Typography>
                            }
                            secondary={
                              <Typography fontSize={15} color={palette.textSecondary}>
                                {`ID: ${course.courseId} | ${course.description}`}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {idx < courses.length - 1 && <Divider light sx={{ my: 1 }} />}
                      </Box>
                    </Fade>
                  ))}
                </List>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Jump to Recent Courses Button */}
      <Zoom in>
        <Tooltip title="Jump to Recent Courses" placement="left">
          <IconButton
            onClick={handleScrollToCourses}
            sx={{
              position: "fixed",
              bottom: { xs: 28, md: 40 },
              right: { xs: 20, md: 40 },
              bgcolor: palette.primary,
              color: "#fff",
              boxShadow: palette.shadow,
              border: `2.5px solid ${palette.accent}`,
              "&:hover": {
                bgcolor: palette.accent,
                color: palette.primary,
                borderColor: palette.primary,
              },
              zIndex: 100,
              width: 64,
              height: 64,
              transition: "all 0.2s cubic-bezier(.4,2,.6,1)",
            }}
            size="large"
          >
            <ArrowDownwardIcon sx={{ fontSize: 36 }} />
          </IconButton>
        </Tooltip>
      </Zoom>

      {/* 📱 Sidebar Toggle Button - Mobile Only */}
      {isMobile && (
        <>
          <IconButton
            onClick={() => setOpenSidebar(true)}
            sx={{
              position:"fixed",
              bottom: 800,
              left: 24,
              zIndex: 1200,
              bgcolor: "#fff",
              border: "2px solid #38761d",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <MenuIcon sx={{ color: "#38761d" }} />
          </IconButton>

          <Modal open={openSidebar} onClose={() => setOpenSidebar(false)}>
            <Box
              sx={{
                width: "90%",
                maxWidth: 350,
                bgcolor: "#fff",
                borderRadius: 4,
                p: 3,
                m: "auto",
                mt: 10,
                boxShadow: 24,
                outline: "none",
              }}
            >
              {AssignmentList}
              <Button
                onClick={handleLogout}
                variant="contained"
                fullWidth
                startIcon={<LogoutIcon />}
                sx={{ mt: 2, textTransform: "none", fontWeight: 600, borderRadius: 3 }}
              >
                Logout
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
}
