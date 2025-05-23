// kidzy-frontend/kidzy/app/(protected)/assignment-submission/page.jsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";                   // ⬅️ جديد
import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function AssignmentSubmission() {
  const searchParams   = useSearchParams();
  const [assignmentId, setAssignmentId] = useState("");
  const [studentId,   setStudentId]     = useState("");
  const [submittedAt, setSubmittedAt]   = useState("");
  const [file,        setFile]          = useState(null);
  const [message,     setMessage]       = useState("");
  const fileInputRef  = useRef();

  useEffect(() => {
    const assignmentFromQuery = searchParams.get("assignmentId");
    const cookieStudentId     = Cookies.get("currentUserId");  // ⬅️ من الكوكي
    if (assignmentFromQuery) setAssignmentId(assignmentFromQuery);
    if (cookieStudentId)     setStudentId(cookieStudentId);

    // تاريخ الإرسال للعرض فقط
    setSubmittedAt(new Date().toLocaleString());
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!file) {
      setMessage("❌ Please select a file first");
      return;
    }
  
    const formData = new FormData();
    formData.append("assignmentId", assignmentId);
    formData.append("studentId",   Cookies.get("currentUserId"));
    formData.append("file",        file);
    formData.append("submittedAt", new Date().toISOString());
  
    try {
      const res = await fetch(
        "http://localhost:8080/api/assignments/submissions",
        {
          method: "POST",
          credentials: "include", 
          headers: {
            // أهم سطر: ببعث هيدر الـ Bearer
            Authorization: `Bearer ${Cookies.get("accessToken")}`,
          },
          body: formData,
        }
      );
  
      if (!res.ok) {
        console.error(await res.text());
        throw new Error("Upload failed");
      }
      setMessage("✅ Submission uploaded successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading submission");
    }
  };
  

  return (
    <Box
      sx={{
        background: "#FFFBF0",
        minHeight: "100vh",
        fontFamily: "'Jaldi', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 5,
            borderRadius: 5,
            maxWidth: 500,
            mx: "auto",
            backgroundColor: "#fff9e5",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#2E6F40"
            textAlign="center"
            mb={3}
          >
            Upload Submission 📤
          </Typography>

          {/* تاريخ الإرسال (غير قابل للتعديل) */}
          <Typography
            color="text.secondary"
            mb={3}
            sx={{
              backgroundColor: "#f0f0f0",
              p: "10px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Submitted At: {submittedAt}
          </Typography>

          <form onSubmit={handleSubmit}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />

            <Button
              onClick={() => fileInputRef.current.click()}
              variant="outlined"
              fullWidth
              startIcon={<UploadFileIcon />}
              sx={{
                mb: 2,
                backgroundColor: "#fff",
                border: "2px dashed #ccc",
                color: "#6a994e",
                fontWeight: "bold",
                textTransform: "none",
                "&:hover": {
                  borderColor: "#6a994e",
                  backgroundColor: "#f0f9ec",
                },
              }}
            >
              {file ? `File: ${file.name}` : "Click to upload your file"}
            </Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#A3B18A",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "30px",
                py: 1.5,
                "&:hover": { backgroundColor: "#6a994e" },
              }}
            >
              Submit Now 🚀
            </Button>
          </form>

          {message && (
            <Typography
              mt={3}
              fontWeight="bold"
              textAlign="center"
              color={message.startsWith("✅") ? "green" : "error"}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </motion.div>
    </Box>
  );
}
