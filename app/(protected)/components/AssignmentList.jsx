"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  LinearProgress,
  IconButton,
  Stack,
  Grid,
  Tooltip,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";

const palette = {
  primary: "#38761d",
  accent: "#ea9127",
  cardBg: "#f9f9fc",
  avatarBg: "#eaf6e7",
  progress: "#ea9127",
  textPrimary: "#1a223f",
  textSecondary: "#6b7a99",
};

function getInitials(title) {
  return title ? title[0].toUpperCase() : "A";
}

export default function AssignmentList({ loading, assignments, onEdit }) {
  const router = useRouter();

  if (loading)
    return (
      <Box textAlign="center" py={3}>
        <Typography color={palette.textSecondary}>⏳ Loading assignments...</Typography>
      </Box>
    );
  if (!assignments || assignments.length === 0)
    return (
      <Box textAlign="center" py={3}>
        <Typography color={palette.textSecondary}>📭 No assignments for this course.</Typography>
      </Box>
    );

  return (
    <Stack spacing={2}>
      {assignments.map((a) => {
        // Calculate progress (example: you can adjust as needed)
        const due = a.dueDate ? new Date(a.dueDate) : null;
        const now = new Date();
        let progress = 0;
        if (due) {
          const total = due - new Date(a.createdAt || now);
          const elapsed = now - new Date(a.createdAt || now);
          progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
        }

        return (
          <Paper
            key={a.id}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 4,
              bgcolor: palette.cardBg,
              display: "flex",
              alignItems: "center",
              gap: 2,
              boxShadow: "0 2px 8px rgba(56,118,29,0.07)",
            }}
          >
            {/* Avatar */}
            <Avatar
              sx={{
                bgcolor: palette.primary,
                color: "#fff",
                width: 48,
                height: 48,
                fontWeight: 700,
                fontSize: 22,
                textTransform: "uppercase",
              }}
            >
              {getInitials(a.title)}
            </Avatar>
            {/* Info */}
            <Box flex={1}>
              <Typography fontWeight={700} color={palette.textPrimary} fontSize={18}>
                {a.title}
              </Typography>
              <Typography color={palette.textSecondary} fontSize={14}>
                Due: {a.dueDate ? a.dueDate.replace("T", " ").slice(0, 16) : "N/A"}
              </Typography>
              {/* Progress bar */}
              <Box mt={1}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    background: "#e4e9ef",
                    "& .MuiLinearProgress-bar": {
                      background: palette.progress,
                    },
                  }}
                />
              </Box>
            </Box>
            {/* Actions */}
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit">
                <IconButton
                  onClick={() => onEdit(a)}
                  sx={{
                    bgcolor: "#fff",
                    color: palette.accent,
                    border: `1px solid ${palette.accent}`,
                    "&:hover": { bgcolor: palette.accent, color: "#fff" },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Submissions">
                <IconButton
onClick={() => router.push(`/instructor-dashboard/course/courses/assignment-inst/${a.id}`)}
                  sx={{
                    bgcolor: "#fff",
                    color: palette.primary,
                    border: `1px solid ${palette.primary}`,
                    "&:hover": { bgcolor: palette.primary, color: "#fff" },
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
