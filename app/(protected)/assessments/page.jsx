"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";

export default function AssessmentsListPage() {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 4 per page

  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:8080/api/assessments", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        // <-- Here’s the only change:
        setAssessments(Array.isArray(data) ? data : []);
      })
      .catch((err) =>
        console.error("Failed to fetch assessments:", err)
      );
  }, []);

  const handleClick = (id) => {
    router.push(`/assessment-details/${id}`);
  };

  const emojiList = ["🧠", "📘", "🎯", "💡", "📝", "🔍", "🐣", "🌟"];

  const filtered = assessments
    .filter((a) =>
      a.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        overflowY: "auto",
        background: "#FFF9E5",
      }}
    >
      <Box
        sx={{
          minHeight: "100%",
          fontFamily: "'Jaldi', sans-serif",
          py: 6,
          px: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src="/images/Bear.svg"
          alt="Bear"
          style={{
            position: "fixed",
            right: 0,
            bottom: 0,
            width: "300px",
            height: "auto",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        <Typography
          variant="h3"
          color="#2E6F40"
          fontWeight="bold"
          mb={4}
          textAlign="center"
        >
          All Assessments
        </Typography>

        {/* Search & Sort */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <TextField
            variant="outlined"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search title..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6a994e" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              width: 250,
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
          />

          <TextField
            select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setCurrentPage(1);
            }}
            label="Sort by title"
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              width: 200,
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
          >
            <MenuItem value="asc">A → Z</MenuItem>
            <MenuItem value="desc">Z → A</MenuItem>
          </TextField>
        </Box>

        {filtered.length === 0 ? (
          <Typography color="#555" textAlign="center" fontSize="1.2rem">
            No assessments match your search.
          </Typography>
        ) : (
          <>
            <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mb: 4 }}>
              <Grid container spacing={3} justifyContent="center">
                {currentItems.map((a, idx) => (
                  <Grid item xs={6} key={a.id}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                    >
                      <Paper
                        elevation={3}
                        sx={{
                          p: 3,
                          borderRadius: 5,
                          backgroundColor: "#faedcd",
                          height: "260px",
                          maxWidth: "400px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-between",
                          textAlign: "center",
                          mx: "auto",
                        }}
                      >
                        <Box sx={{ fontSize: "2.8rem", mb: 1 }}>
                          {emojiList[idx % emojiList.length]}
                        </Box>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="#256029"
                          sx={{ wordBreak: "break-word", mb: 1 }}
                        >
                          {a.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#4E5D42"
                          sx={{
                            wordBreak: "break-word",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {a.description}
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#adc178",
                            color: "#4E5D42",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            py: 1,
                            px: 4,
                            borderRadius: "30px",
                            mt: 2,
                            "&:hover": {
                              backgroundColor: "#6a994e",
                            },
                          }}
                          onClick={() => handleClick(a.id)}
                        >
                          View Details
                        </Button>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Pagination */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "center",
              }}
            >
              <IconButton
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                sx={{ color: "#4E5D42" }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography fontWeight="bold" color="#4E5D42">
                Page {currentPage} of {totalPages}
              </Typography>
              <IconButton
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                sx={{ color: "#4E5D42" }}
              >
                <ArrowForwardIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
