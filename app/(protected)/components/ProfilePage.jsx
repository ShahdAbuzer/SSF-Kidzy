"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Cookies from "js-cookie";
import { TextField, Button, Paper, Box, Typography } from "@mui/material";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userId = Cookies.get("currentUserId");
    if (userId) {
      setCurrentUserId(userId);
      fetchUserData(userId);
    }
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/instructors/${id}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8080/api/instructors/${currentUserId}`,
        userData
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  if (!userData) return <Typography>Loading...</Typography>;

  return (
    <Box suppressHydrationWarning sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper sx={{ padding: 3, width: "100%", maxWidth: "600px" }}>
        <Typography variant="h5" gutterBottom>
          Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={userData.username}
            onChange={(e) =>
              setUserData({ ...userData, username: e.target.value })
            }
            disabled={!isEditing}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            value={userData.name}
            onChange={(e) =>
              setUserData({ ...userData, name: e.target.value })
            }
            disabled={!isEditing}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            disabled={!isEditing}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Salary"
            value={userData.salary}
            onChange={(e) =>
              setUserData({ ...userData, salary: parseFloat(e.target.value) })
            }
            disabled={!isEditing}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Date"
            value={userData.startDate}
            onChange={(e) =>
              setUserData({ ...userData, startDate: e.target.value })
            }
            disabled={!isEditing}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Degree"
            value={userData.degree}
            onChange={(e) =>
              setUserData({ ...userData, degree: e.target.value })
            }
            disabled={!isEditing}
            fullWidth
            margin="normal"
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            {isEditing ? (
              <>
                <Button type="submit" variant="contained">
                  Save
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
