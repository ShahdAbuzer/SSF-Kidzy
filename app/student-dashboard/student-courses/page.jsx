"use client";

import { useEffect, useState } from "react";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [visibleAssessments, setVisibleAssessments] = useState({});
  const [visibleAssignments, setVisibleAssignments] = useState({});
  const [visibleContent, setVisibleContent] = useState({});
  const [assessmentsByCourse, setAssessmentsByCourse] = useState({});
  const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
  const [contentByCourse, setContentByCourse] = useState({});

  useEffect(() => {
    fetch("http://localhost:8080/api/takes", { credentials: "include" })
      .then((res) => res.json())
      .then((takesData) => {
        const takesList = takesData._embedded?.takesDTOList || [];
        const courseIds = takesList.map((t) => t.courseId);

        fetch("http://localhost:8080/api/course", { credentials: "include" })
          .then((res) => res.json())
          .then((courseData) => {
            const allCourses = courseData._embedded?.courseDTOList || [];
            const filteredCourses = allCourses.filter((c) =>
              courseIds.includes(c.courseId)
            );
            setCourses(filteredCourses);
          });
      })
      .catch((err) => console.error("Error loading courses:", err));
  }, []);

  const handleShowAssessments = (courseId) => {
    if (!visibleAssessments[courseId]) {
      fetch("http://localhost:8080/api/assessments", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const all = data._embedded?.assessmentDTOList || [];
          const related = all.filter((a) => a.courseId === courseId);
          setAssessmentsByCourse((prev) => ({ ...prev, [courseId]: related }));
          setVisibleAssessments((prev) => ({ ...prev, [courseId]: true }));
        });
    } else {
      setVisibleAssessments((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const handleShowAssignments = (courseId) => {
    if (!visibleAssignments[courseId]) {
      fetch("http://localhost:8080/api/assignments", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const all = data._embedded?.assignmentDTOList || [];
          const related = all.filter((a) => a.courseId === courseId);
          setAssignmentsByCourse((prev) => ({ ...prev, [courseId]: related }));
          setVisibleAssignments((prev) => ({ ...prev, [courseId]: true }));
        });
    } else {
      setVisibleAssignments((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const handleShowContent = (courseId) => {
    if (!visibleContent[courseId]) {
      fetch("http://localhost:8080/api/contents", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          const all = data._embedded?.contentDTOList || [];
          const related = all.filter((c) => c.courseId === courseId);
          setContentByCourse((prev) => ({ ...prev, [courseId]: related }));
          setVisibleContent((prev) => ({ ...prev, [courseId]: true }));
        });
    } else {
      setVisibleContent((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  return (
    <main style={{ padding: "2rem", background: "#fff9f0" }}>
      <h1 style={{ color: "#234B2B" }}>Your Courses</h1>

      {courses.map((course) => (
        <div
          key={course.courseId}
          style={{
            border: "2px solid #d0e7ff",
            borderRadius: "15px",
            padding: "1.5rem",
            marginBottom: "2rem",
            backgroundColor: "#f0faff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
            <button onClick={() => handleShowAssessments(course.courseId)}>
              {visibleAssessments[course.courseId]
                ? "Hide Assessments"
                : "Show Assessments"}
            </button>

            <button onClick={() => handleShowAssignments(course.courseId)}>
              {visibleAssignments[course.courseId]
                ? "Hide Assignments"
                : "Show Assignments"}
            </button>

            <button onClick={() => handleShowContent(course.courseId)}>
              {visibleContent[course.courseId]
                ? "Hide Content"
                : "Show Content"}
            </button>
          </div>

          {visibleAssessments[course.courseId] && (
            <div style={{ marginTop: "1rem" }}>
              <h4>Assessments:</h4>
              {assessmentsByCourse[course.courseId]?.length > 0 ? (
                <ul>
                  {assessmentsByCourse[course.courseId].map((a) => (
                    <li key={a.id}>
                      <a
                        href={`/assessment-details/${a.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#1976d2",
                          fontWeight: "bold",
                        }}
                      >
                        {a.title}
                      </a>{" "}
                      — {a.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontStyle: "italic" }}>No assessments found.</p>
              )}
            </div>
          )}

          {visibleAssignments[course.courseId] && (
            <div style={{ marginTop: "1rem" }}>
              <h4>Assignments:</h4>
              {assignmentsByCourse[course.courseId]?.length > 0 ? (
                <ul>
                  {assignmentsByCourse[course.courseId].map((a) => (
                    <li key={a.id}>
                      <a
                        href={`/assignment-details/${a.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#d32f2f",
                          fontWeight: "bold",
                        }}
                      >
                        {a.title}
                      </a>{" "}
                      — {a.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontStyle: "italic" }}>No assignments found.</p>
              )}
            </div>
          )}

          {visibleContent[course.courseId] && (
            <div style={{ marginTop: "1rem" }}>
              <h4>Content:</h4>
              {contentByCourse[course.courseId]?.length > 0 ? (
                <ul>
                  {contentByCourse[course.courseId].map((c) => (
                    <li key={c.id}>
                      <a
                        href={`/content-details/${c.id}`}
                        style={{
                          textDecoration: "none",
                          color: "#6A1B9A",
                          fontWeight: "bold",
                        }}
                      >
                        {c.title}
                      </a>{" "}
                      — {c.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontStyle: "italic" }}>No content available.</p>
              )}
            </div>
          )}
        </div>
      ))}
    </main>
  );
}
