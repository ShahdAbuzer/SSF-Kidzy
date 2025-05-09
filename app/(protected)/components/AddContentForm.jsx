"use client";

import { useState, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { motion } from "framer-motion";
import Cookies from "js-cookie";

export default function AddContentForm({ courseId }) {
  const [type, setType] = useState("VIDEO");
  const [resourceUrl, setResourceUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fileInputRef = useRef();

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("courseId", courseId);
    formData.append("type", type);

    if (type === "VIDEO") {
      if (!resourceUrl) {
        return showSnack(" Please provide a video URL.", "warning");
      }
      if (!isValidURL(resourceUrl)) {
        return showSnack(" Invalid video URL format.", "warning");
      }
      formData.append("resourceUrl", resourceUrl);
    }

    if (type === "FILE") {
      if (!file) {
        return showSnack(" Please select a file.", "warning");
      }
      formData.append("file", file);
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8080/api/content/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${Cookies.get("accessToken")}`,
        },
      });

      const responseText = await res.text();
      if (!res.ok) throw new Error(" Upload failed: " + responseText);

      showSnack("Content uploaded successfully!", "success");
      setFile(null);
      setResourceUrl("");
    } catch (err) {
      console.error(err);
      showSnack(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showSnack = (message, severity) => {
    setSnack({ open: true, message, severity });
  };

  return (
    <Box
      sx={{
        background: "#fff",
        minHeight: "20vh",
        fontFamily: "'Jaldi', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 0,
        py: 0,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 5,
            maxWidth: 500,
            mx: 0,
            mt: 5,
            backgroundColor: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#2E6F40"
            textAlign="center"
            mb={3}
          >
            Upload Course Content
          </Typography>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: "bold" }}>Type:</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  marginLeft: "1rem",
                  borderRadius: "6px",
                  padding: "5px",
                  color: "#6a994e",
                }}
              >
                <option value="VIDEO">VIDEO</option>
                <option value="FILE">FILE</option>
              </select>
            </div>

            {type === "VIDEO" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: "bold" }}>Video URL:</label>
                <input
                  type="text"
                  value={resourceUrl}
                  onChange={(e) => setResourceUrl(e.target.value)}
                  style={{ width: "100%", padding: "8px", marginTop: "0.5rem" }}
                />
              </div>
            )}

            {type === "FILE" && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
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
                  {file ? `File: ${file.name}` : "Click to upload file"}
                </Button>
              </>
            )}

            <Box sx={{ textAlign: "center", mt: 2 }}>
              {isLoading ? (
                <CircularProgress size={30} sx={{ color: "#6a994e" }} />
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
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
                  Upload Now
                </Button>
              )}
            </Box>
          </form>
        </Paper>

        <Snackbar
          open={snack.open}
          autoHideDuration={5000}
          onClose={() => setSnack({ ...snack, open: false })}
        >
          <Alert
            onClose={() => setSnack({ ...snack, open: false })}
            severity={snack.severity}
            sx={{ width: "100%" }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </motion.div>
    </Box>
  );
}
