"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Grid,
  IconButton,
  Skeleton,
  Backdrop,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoaderWaves from "../../../(protected)/components/Loader";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const isMobile = useMediaQuery("(max-width:900px)");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 1200);
    fetch("http://localhost:8080/api/assignments", {
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
      })
      .finally(() => setDataLoading(false));
    return () => clearTimeout(timer);
  }, []);

 const handleSubmissionClick = (assignmentId) => {
  router.push(`/student-dashboard/progress/assignment/assignment-submission?assignmentId=${assignmentId}`);
};


  const filtered = assignments
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

  const emojiList = ["📚", "📝", "📎", "🔖", "🧸", "🧠", "🌼", "🍀"];

  return (
    <>
      <Backdrop
        open={pageLoading}
        sx={{
          color: "#fff",
          zIndex: 9999,
          backgroundColor: "rgba(255,255,255,0.85)",
        }}
      >
        <LoaderWaves />
      </Backdrop>

      <Box
        sx={{
          height: "100vh",
          overflowY: "auto",
          background: "#FFF9E5",
        }}
      >
        <Box
          sx={{
            fontFamily: "'Jaldi', sans-serif",
            py: 6,
            px: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {!isMobile && (
            <img
              src="/images/Bird.svg"
              alt="Bird"
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
            All Assignments
          </Typography>

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

          {error ? (
            <Typography color="red">{error}</Typography>
          ) : dataLoading ? (
            <Grid container spacing={3} justifyContent="center">
              {[1, 2, 3, 4].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={300}
                    sx={{ borderRadius: 5 }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : filtered.length === 0 ? (
            <Typography color="#555" textAlign="center" fontSize="1.2rem">
              No assignments match your search.
            </Typography>
          ) : (
            <>
              <Grid container spacing={3} justifyContent="center" mb={4}>
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
                          display: "flex",
                                          maxWidth: 400,
                maxHeight: 300,
                minHeight: 300,
                minWidth: 400,
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "space-between",
                          textAlign: "center",
                        }}
                      >
                        <Box sx={{ fontSize: "2.8rem" }}>
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
                            fontSize: { xs: "0.85rem", sm: "0.95rem" },
                          }}
                        >
                          {a.description}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="#4E5D42"
                          mt={1}
                          fontStyle="italic"
                        >
                          Due: {a.dueDate || "No due date"}
                        </Typography>
                        <Button
                          variant="contained"
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
                          onClick={() => handleSubmissionClick(a.id)}
                        >
                          Submit
                        </Button>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  mt: 2,
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
    </>
  );
}
