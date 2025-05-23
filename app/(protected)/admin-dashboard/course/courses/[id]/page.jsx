"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import PeopleIcon from "@mui/icons-material/People";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import AddAssignmentForm from "../../../../components/AddAssignmentForm";
import AddAssessmentForm from "../../../../components/AddAssessmentForm";
import CourseDetails from "../../../../components/CourseDetails";
import AssignmentListAdmin from "../../../../components/AssignmentListAdmin";
import EditAssignmentModal from "../../../../components/EditAssignmentModal";
import CourseAssessmentsAdmin from "../../../../components/CourseAssessmentsAdmin";
import AddContentForm from "../../../../components/AddContentForm";
import Cookies from "js-cookie";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  background: "#f9f9fc",
  textPrimary: "#1a223f",
  textSecondary: "#6b7a99",
  shadow: "0 4px 16px rgba(0,0,0,0.05)",
};

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [contents, setContents] = useState([]);
  const [students, setStudents] = useState([]);
  const [showAddAssignmentForm, setShowAddAssignmentForm] = useState(false);
  const [showAddAssessmentForm, setShowAddAssessmentForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("assessments");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, contentsRes, studentsRes] = await Promise.all([
          fetch(`http://localhost:8080/api/course/${id}`, {
            credentials: "include",
          }),
          fetch(`http://localhost:8080/api/content/course/${id}`, {
            credentials: "include",
          }),
          fetch("http://localhost:8080/api/takes", { credentials: "include" }),
        ]);

        if (!courseRes.ok) throw new Error("Course error");
        if (!contentsRes.ok) throw new Error("Contents error");
        if (!studentsRes.ok) throw new Error("Students error");

        const courseData = await courseRes.json();
        const contentsData = await contentsRes.json();
        const studentsData = await studentsRes.json();

        setCourse(courseData);
        setContents(contentsData?._embedded?.contentDTOList || []);
        setStudents(
          (studentsData?._embedded?.takesDTOList || []).filter(
            (s) => s.courseId == id
          )
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCourse(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const fetchAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const res = await fetch("http://localhost:8080/api/assignments", {
        credentials: "include",
      });
      const data = await res.json();
      const list = data?._embedded?.assignmentDTOList || [];
      setAssignments(list.filter((a) => a.courseId == id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAssignments(false);
    }
  };

  useEffect(() => {
    if (activeTab === "assignments") fetchAssignments();
  }, [activeTab]);

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        background: palette.background,
        p: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={11} md={10} lg={9} xl={8}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 1.5, sm: 2.5, md: 4 },
              borderRadius: { xs: 2, sm: 4, md: 5 },
              boxShadow: palette.shadow,
              background: "#fff",
              minHeight: 600,
              maxWidth: "100%",
              overflowX: "hidden",
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <SchoolIcon sx={{ fontSize: { xs: 28, sm: 34 }, color: palette.primary }} />
              <Typography
                variant="h5"
                fontWeight={800}
                color={palette.textPrimary}
                sx={{ fontSize: { xs: "1.4rem", sm: "2rem" } }}
              >
                Course Details
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  borderRadius: 3,
                  background: "#f3f7f6",
                  "& .MuiTab-root": {
                    fontWeight: 700,
                    color: palette.textSecondary,
                    borderRadius: 3,
                    minHeight: 48,
                  },
                  "& .Mui-selected": {
                    color: "#fff",
                    background: palette.primary,
                  },
                  "& .MuiTabs-indicator": {
                    display: "none",
                  },
                }}
              >
                <Tab label="Assessments" value="assessments" icon={<AssignmentIcon />} iconPosition="start" />
                <Tab label="Resources" value="resources" icon={<VideoLibraryIcon />} iconPosition="start" />
                <Tab label="Students" value="students" icon={<PeopleIcon />} iconPosition="start" />
                <Tab label="Assignments" value="assignments" icon={<AssignmentIcon />} iconPosition="start" />
                <Tab label="Upload" value="uploadContent" icon={<AddIcon />} iconPosition="start" />
              </Tabs>
            </Box>

            {/* --- TAB CONTENTS --- */}
            <Box>
              <Collapse in={activeTab === "assessments"}>
                {loadingCourse ? (
                  <Box textAlign="center" mt={4}>
                    <CircularProgress sx={{ color: palette.primary }} />
                  </Box>
                ) : error ? (
                  <Alert severity="error">{error}</Alert>
                ) : (
                  <>
                    <CourseDetails loading={loadingCourse} error={error} course={course} />
                    {course && <CourseAssessmentsAdmin courseId={course.courseId} />}
                    <Button
                      onClick={() => setShowAddAssessmentForm(!showAddAssessmentForm)}
                      sx={{
                        mt: 2,
                        background: palette.primary,
                        color: "#fff",
                        borderRadius: 3,
                        "&:hover": { background: palette.accent },
                        fontWeight: 700,
                      }}
                      startIcon={<AddIcon />}
                    >
                      {showAddAssessmentForm ? "Cancel Add" : "Add Assessment"}
                    </Button>
                    <Collapse in={showAddAssessmentForm}>
                      <AddAssessmentForm
                        courseId={id}
                        onSuccess={() => setShowAddAssessmentForm(false)}
                        onError={(msg) => console.error(msg)}
                      />
                    </Collapse>
                  </>
                )}
              </Collapse>

              <Collapse in={activeTab === "resources"}>
                <List>
                  {contents.map((c, i) => (
                    <ListItem key={i} divider>
                      <ListItemText
                        primary={
                          <Typography fontWeight={600} color={palette.textPrimary}>
                            {c.type} - {c.filePath?.split("/").pop() || "No file"}
                          </Typography>
                        }
                        secondary={
                          c.type === "VIDEO" ? (
                            <a href={c.resourceUrl} target="_blank" rel="noopener noreferrer">
                              Watch Video
                            </a>
                          ) : (
                            <Button
                              size="small"
                              variant="outlined"
                              color="success"
                              onClick={() => {
                                if (!c.id) return alert("❌ Invalid file ID");
                                fetch(`http://localhost:8080/api/content/download/${c.id}`, {
                                  credentials: "include",
                                  headers: {
                                    Authorization: `Bearer ${Cookies.get("accessToken")}`,
                                  },
                                })
                                  .then((res) => {
                                    if (!res.ok) return res.text().then((text) => { throw new Error(text); });
                                    return res.blob();
                                  })
                                  .then((blob) => {
                                    const a = document.createElement("a");
                                    a.href = URL.createObjectURL(blob);
                                    a.download = c.filePath?.split("/").pop() || `resource-${c.id}`;
                                    a.click();
                                  })
                                  .catch((err) => alert("❌ Error downloading file: " + err.message));
                              }}
                            >
                              Download
                            </Button>
                          )
                        }
                      />
                    </ListItem>
                  ))}
                  {contents.length === 0 && (
                    <Typography color={palette.textSecondary} align="center" py={2}>
                      No resources found.
                    </Typography>
                  )}
                </List>
              </Collapse>

              <Collapse in={activeTab === "students"}>
                {students.length > 0 ? (
                  <Box sx={{ width: "100%", overflowX: "auto", mt: 2 }}>
                    <Table sx={{ minWidth: 500, backgroundColor: "#fff", borderRadius: 2 }}>
                      <TableHead>
                        <TableRow sx={{ backgroundColor: "#E6CCB2" }}>
                          <TableCell sx={{ fontWeight: "bold", color: "#7F5539" }}>#</TableCell>
                          <TableCell sx={{ fontWeight: "bold", color: "#7F5539" }}>Student ID</TableCell>
                          <TableCell sx={{ fontWeight: "bold", color: "#7F5539" }}>Section</TableCell>
                          <TableCell sx={{ fontWeight: "bold", color: "#7F5539" }}>Grade</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.map((s, i) => (
                          <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{s.studentId}</TableCell>
                            <TableCell>{s.secId}</TableCell>
                            <TableCell>{s.grade || "N/A"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                ) : (
                  <Typography color="#9e9e9e" align="center" py={2}>
                    No students found.
                  </Typography>
                )}
              </Collapse>

              <Collapse in={activeTab === "assignments"}>
                <Box mt={2}>
                  <AssignmentListAdmin
                    loading={loadingAssignments}
                    assignments={assignments}
                    onEdit={(a) => {
                      setEditingAssignment(a);
                      setIsEditOpen(true);
                    }}
                  />
                  <Button
                    onClick={() => setShowAddAssignmentForm(!showAddAssignmentForm)}
                    sx={{
                      mt: 2,
                      background: palette.primary,
                      color: "#fff",
                      borderRadius: 3,
                      "&:hover": { background: palette.accent },
                      fontWeight: 700,
                    }}
                    startIcon={<AddIcon />}
                  >
                    {showAddAssignmentForm ? "Cancel Add" : "Add Assignment"}
                  </Button>
                  <Collapse in={showAddAssignmentForm}>
                    <AddAssignmentForm
                      courseId={id}
                      assignments={assignments}
                      onSuccess={() => {
                        fetchAssignments();
                        setShowAddAssignmentForm(false);
                        setFormSuccess(" Assignment added!");
                      }}
                      onError={(msg) => setFormError(msg)}
                      formError={formError}
                      formSuccess={formSuccess}
                      clearMessages={() => {
                        setFormError("");
                        setFormSuccess("");
                      }}
                    />
                  </Collapse>
                </Box>
              </Collapse>

              <Collapse in={activeTab === "uploadContent"}>
                <Box mt={2}>
                  <AddContentForm courseId={id} />
                </Box>
              </Collapse>
            </Box>

            <Snackbar
              open={formSuccess === " Content uploaded successfully!"}
              autoHideDuration={4000}
              onClose={() => setFormSuccess("")}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
                {formSuccess}
              </Alert>
            </Snackbar>

            <EditAssignmentModal
              open={isEditOpen}
              onClose={() => setIsEditOpen(false)}
              assignment={editingAssignment}
              onSave={fetchAssignments}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
