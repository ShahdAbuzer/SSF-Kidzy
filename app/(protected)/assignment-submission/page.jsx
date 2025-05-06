"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AssignmentSubmission() {
  const searchParams = useSearchParams();
  const [assignmentId, setAssignmentId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [submittedAt, setSubmittedAt] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const assignmentFromQuery = searchParams.get("assignmentId");
    const savedStudentId = localStorage.getItem("studentId");
    if (assignmentFromQuery) setAssignmentId(assignmentFromQuery);
    if (savedStudentId) setStudentId(savedStudentId);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("studentId", studentId);
    formData.append("file", file);
    formData.append("submittedAt", submittedAt);

    try {
      const res = await fetch("http://localhost:8080/api/assignments/submissions", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Upload failed");
      setMessage("✅ Submission uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading submission");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "2rem" }}>
      <h2>Upload Submission</h2>

      <p><strong>Assignment ID:</strong> {assignmentId}</p>
      <p><strong>Student ID:</strong> {studentId}</p>

      <input
        type="datetime-local"
        value={submittedAt}
        onChange={(e) => setSubmittedAt(e.target.value)}
        required
      /><br /><br />

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files[0])}
        required
      /><br /><br />

      <button type="submit">Submit</button>

      {message && <p>{message}</p>}
    </form>
  );
}
