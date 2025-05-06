"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/api/assignments", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch assignments");
        return res.json();
      })
      .then((data) => {
        const list = data._embedded?.assignmentDTOList || [];
        setAssignments(list);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not fetch assignments");
      });
  }, []);

  const handleSubmissionClick = (assignmentId) => {
    router.push(`/assignment-submission?assignmentId=${assignmentId}`);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Assignments</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {assignments.length === 0 && !error && <p>Loading...</p>}

      {assignments.map((a) => (
        <div key={a.id} style={{ marginBottom: "1rem" }}>
          <p><strong>Title:</strong> {a.title}</p>
          <p><strong>Description:</strong> {a.description}</p>
          <p><strong>Due Date:</strong> {a.dueDate ?? "No due date"}</p>
          <button onClick={() => handleSubmissionClick(a.id)}>
            Submit This Assignment
          </button>
          <hr />
        </div>
      ))}
    </main>
  );
}
