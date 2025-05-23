"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  TextField,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import QuizIcon from "@mui/icons-material/Quiz";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import StarIcon from "@mui/icons-material/Star";
import LoaderWaves from "../../(protected)/components/Loader";

const dogImg = "/images/Bear.svg";
const koalaImg = "/images/Bird.svg";
const owlImg = "/images/owl.svg";
const tree1 = "/images/tree.svg";
const tree2 = "/images/tree2.svg";

const statCardData = [
  {
    label: "Courses",
    icon: <SchoolIcon sx={{ fontSize: 40, color: "#23823B" }} />,
    bg: "#FFE083",
    color: "#23823B",
  },
  {
    label: "Assessments",
    icon: <QuizIcon sx={{ fontSize: 40, color: "#E1B100" }} />,
    bg: "#FFEABF",
    color: "#E1B100",
  },
  {
    label: "Assignments",
    icon: <AssignmentIcon sx={{ fontSize: 40, color: "#D46A6A" }} />,
    bg: "#FFD1D1",
    color: "#D46A6A",
  },
  {
    label: "Submissions",
    icon: <CloudDoneIcon sx={{ fontSize: 40, color: "#2C7CD1" }} />,
    bg: "#B3E5FC",
    color: "#2C7CD1",
  },
  {
    label: "Points",
    icon: <StarIcon sx={{ fontSize: 40, color: "#FFD600" }} />,
    bg: "#B7EFC5",
    color: "#FFD600",
  },
];

export default function ProgressPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [contentByCourse, setContentByCourse] = useState({});
  const [visibleContent, setVisibleContent] = useState({});
  const [assessments, setAssessments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:900px)");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8080/api/takes", { credentials: "include" }).then((res) => res.json()),
      fetch("http://localhost:8080/api/assessments", { credentials: "include" }).then((res) => res.json()),
      fetch("http://localhost:8080/api/assignments", { credentials: "include" }).then((res) => res.json()),
      fetch("http://localhost:8080/api/submissions", { credentials: "include" }).then((res) => res.json()),
    ]).then(([takes, assess, assign, sub]) => {
      const list = takes._embedded?.takesDTOList || [];
      setCourses(list);
      setFilteredCourses(list);
      setAssessments(assess._embedded?.assessmentDTOList || []);
      setAssignments(assign._embedded?.assignmentDTOList || []);
      setSubmissions(sub._embedded?.submissionDTOList || []);
    }).finally(() => setDataLoading(false));
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      `${course.title || ""} ${course.courseId}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [search, courses]);

  const statValues = [
    courses.length,
    assessments.length,
    assignments.length,
    submissions.length,
    assignments.length * 5 + assessments.length * 5,
  ];

  const handleToggleContent = (courseId) => {
    if (!visibleContent[courseId]) {
      fetch(`http://localhost:8080/api/content/course/${courseId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const related = data._embedded?.contentDTOList || [];
          setContentByCourse((prev) => ({ ...prev, [courseId]: related }));
          setVisibleContent((prev) => ({ ...prev, [courseId]: true }));
        });
    } else {
      setVisibleContent((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  if (pageLoading) {
    return (
      <Box
        sx={{
          height: "100vh",
          backgroundColor: "#FFF9E5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoaderWaves />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "#FFF9E5",
        height: "100vh",
        overflowY: "auto",
        px: { xs: 2, md: 4 },
        py: 4,
        fontFamily: "'Jaldi', sans-serif",
        position: "relative",
      }}
    >
      {!isMobile && (
        <>
          <img src={tree1} alt="Tree" style={{ position: "fixed", left: 0, bottom: 0, width: "300px", zIndex: 1 }} />
          <img src={tree2} alt="Tree2" style={{ position: "fixed", right: 0, bottom: 0, width: "340px", zIndex: 1 }} />
        </>
      )}

      <Box sx={{ textAlign: "center", mb: 4, zIndex: 2 }}>
        {!isMobile && <img src={dogImg} alt="Dog" style={{ width: 100 }} />}
        <Typography
          variant="h2"
          sx={{
            color: "#F28C28",
            fontWeight: "bold",
            fontSize: "2.8rem",
            mb: 1,
          }}
        >
          My Progress
        </Typography>
        {!isMobile && <img src={koalaImg} alt="Koala" style={{ width: 100 }} />}
        <TextField
          fullWidth
          label="Search courses..."
          variant="outlined"
          sx={{ mt: 3, maxWidth: 500 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 5 }}>
        {statCardData.map((stat, idx) => (
          <Grid item key={stat.label}>
            <Paper
              elevation={0}
              sx={{
                width: 140,
                height: 120,
                borderRadius: 6,
                background: stat.bg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
                boxShadow: "0 4px 12px rgba(0,0,0,0.07)",
              }}
            >
              {stat.icon}
              <Typography sx={{ fontWeight: "bold", fontSize: "1rem", mt: 1 }}>
                {stat.label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {statValues[idx]}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {dataLoading
        ? [...Array(2)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              sx={{
                width: "80%",
                height: 200,
                borderRadius: 4,
                mx: "auto",
                mb: 3,
                bgcolor: "#fff3d8",
              }}
            />
          ))
        : filteredCourses.map((course) => (
            <Paper
              key={course.courseId}
              sx={{
                mb: 3,
                p: { xs: 3, md: 6 },
                mx: "auto",
                maxWidth: 900,
                backgroundColor: "#E8F5E9",
                borderRadius: 4,
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <img src={owlImg} alt="Owl" style={{ width: 60 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#234B2B" }}>
                  Course #{course.courseId} - Section {course.secId}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "#FFE083",
                    color: "#234B2B",
                    fontWeight: "bold",
                    borderRadius: 4,
                    "&:hover": { background: "#FFD54F" },
                  }}
                  onClick={() =>
                    (window.location.href = `progress/assessments?courseId=${course.courseId}`)
                  }
                >
                  Assessments
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    background: "#FF7C9C",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: 4,
                    "&:hover": { background: "#F06292" },
                  }}
                  onClick={() =>
                    window.location.href = `/student-dashboard/progress/assignment?courseId=${course.courseId}`

                  }
                >
                  Assignments
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    background: "#D1C4E9",
                    color: "#4A148C",
                    fontWeight: "bold",
                    borderRadius: 4,
                    "&:hover": { background: "#B39DDB" },
                  }}
                  onClick={() => handleToggleContent(course.courseId)}
                >
                  {visibleContent[course.courseId] ? "Hide Content" : "Show Content"}
                </Button>
              </Box>

              {visibleContent[course.courseId] && (
                <Box sx={{ mt: 2 }}>
                  {contentByCourse[course.courseId]?.length > 0 ? (
                    <ul>
                      {contentByCourse[course.courseId].map((c, index) => (
                        <li key={index} style={{ marginBottom: "8px" }}>
                          {c.type === "VIDEO" && c.resourceUrl ? (
                            <a
                              href={c.resourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#6A1B9A", fontWeight: "bold" }}
                            >
                              🎥 Watch Video
                            </a>
                          ) : c.filePath ? (
                            <a
                              href={`http://localhost:8080/${c.filePath.replace(/\\/g, "/")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#2E7D32", fontWeight: "bold" }}
                            >
                              📄 Download File
                            </a>
                          ) : (
                            <Typography sx={{ color: "gray" }}>Unknown content</Typography>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Typography sx={{ fontStyle: "italic" }}>
                      No content available.
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          ))}
    </Box>
  );
}
