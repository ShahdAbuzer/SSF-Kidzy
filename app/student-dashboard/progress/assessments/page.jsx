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
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchIcon from "@mui/icons-material/Search";
import LoaderWaves from "../../../(protected)/components/Loader";

export default function AssessmentsListPage() {
  const [assessments, setAssessments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const itemsPerPage = 4;

  const isMobile = useMediaQuery("(max-width:900px)");
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/assessments", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setAssessments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch assessments:", err);
      })
      .finally(() => setDataLoading(false));
  }, []);

  const handleClick = (id) => {
    router.push(`/student-dashboard/progress/assessments/assessment-details/${id}`);
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
    <Box sx={{ height: "100vh", overflowY: "auto", background: "#FFF9E5", py: 6, px: 2 }}>
      <Box
        sx={{
          fontFamily: "'Jaldi', sans-serif",
          maxWidth: 1200,
          mx: "auto",
          position: "relative",
        }}
      >
        {!isMobile && (
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
        )}

        <Typography
          variant="h4"
          color="#2E6F40"
          fontWeight="bold"
          mb={4}
          textAlign="center"
          fontSize={{ xs: "2rem", sm: "2.5rem" }}
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
              width: { xs: "100%", sm: 250 },
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
              width: { xs: "100%", sm: 200 },
              "& .MuiOutlinedInput-root": { borderRadius: 3 },
            }}
          >
            <MenuItem value="asc">A → Z</MenuItem>
            <MenuItem value="desc">Z → A</MenuItem>
          </TextField>
        </Box>

        {/* Grid List */}
        {dataLoading ? (
          <Grid container spacing={3} justifyContent="center">
            {[...Array(4)].map((_, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{
                    borderRadius: 5,
                    width: "100%",
                    height: 280,
                    mx: "auto",
                    bgcolor: "#fff3d8",
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : filtered.length === 0 ? (
          <Typography
            color="#555"
            textAlign="center"
            fontSize={{ xs: "1rem", sm: "1.2rem" }}
          >
            No assessments match your search.
          </Typography>
        ) : (
          <>
            <Grid container spacing={3} justifyContent="center">
              {currentItems.map((a, idx) => (
                <Grid item xs={12} sm={6} md={4} key={a.id}>
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
                        height: 320,
                        width: "100%",
                        display: "flex",
                                        maxWidth: 300,
                maxHeight: 300,
                minHeight: 300,
                minWidth: 300,
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        textAlign: "center",
                      }}
                    >
                      <Box sx={{ fontSize: "2.5rem" }}>
                        {emojiList[idx % emojiList.length]}
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                        color="#256029"
                        sx={{
                          wordBreak: "break-word",
                          fontSize: { xs: "1rem", sm: "1.1rem" },
                        }}
                      >
                        {a.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="#4E5D42"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          px: 1,
                          fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        }}
                      >
                        {a.description}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => handleClick(a.id)}
                        sx={{
                          backgroundColor: "#adc178",
                          color: "#4E5D42",
                          fontWeight: "bold",
                          fontSize: "0.95rem",
                          py: 1,
                          px: 3,
                          borderRadius: "30px",
                          "&:hover": {
                            backgroundColor: "#6a994e",
                          },
                        }}
                      >
                        View Details
                      </Button>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            <Box
              sx={{
                mt: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
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
