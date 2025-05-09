"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Paper,
} from "@mui/material";

import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

// 🔐 Helper to add Authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken"); // تأكدي التوكن محفوظ باسم accessToken
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [secId, setSecId] = useState("");
  const [courseId, setCourseId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch section info & events when secId changes
  useEffect(() => {
    const fetchSectionAndEvents = async () => {
      if (!secId) return;

      setLoading(true);

      try {
        // 🟢 Get courseId from section
        const sectionRes = await axios.get(
          `http://localhost:8080/api/sections/${secId}`,
          getAuthHeaders()
        );
        const courseIdFromSection = sectionRes.data.courseId;
        setCourseId(courseIdFromSection);

        // 🟢 Get events for section
        const eventsRes = await axios.get(
          `http://localhost:8080/api/calendar/section`,
          {
            params: { courseId: courseIdFromSection, secId },
            ...getAuthHeaders(),
          }
        );

        const formattedEvents = eventsRes.data
          .filter((event) => event.eventTime)
          .map((event) => ({
            id: event.id,
            title: event.title,
            date: new Date(event.eventTime).toDateString(),
            description: event.description,
          }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("❌ Error fetching section or events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionAndEvents();
  }, [secId]);

  const handleAddEvent = async () => {
    if (!title || !description || !secId || !courseId) return;
  
    const dateTime = new Date(selectedDate);
    dateTime.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0);
  
    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("You must be logged in to add an event.");
      return;
    }
  
    try {
      setSubmitting(true);
  
      const payload = {
        title,
        description,
        eventTime: dateTime.toISOString(),
        courseId,
        secId,
      };
  
      const res = await axios.post(
        "http://localhost:8080/api/calendar",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Event added:", res.data);
  
      const newEvent = {
        id: res.data.id,
        title: res.data.title,
        description: res.data.description,
        date: new Date(res.data.eventTime).toDateString(),
      };
  
      setEvents([...events, newEvent]);
      setTitle("");
      setDescription("");
      setSecId("");
      setCourseId(null);
      setShowForm(false);
    } catch (error) {
      console.error("❌ Error adding event:", error);
      alert("Failed to add event. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const eventsOnSelectedDate = events.filter(
    (event) => event.date === selectedDate.toDateString()
  );

  if (loading && secId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box m={4} maxHeight="100vh" overflow="auto">
        <Typography variant="h4" gutterBottom>
          Section Calendar 📅
        </Typography>

        <Calendar onChange={setSelectedDate} value={selectedDate} />

        <Typography variant="h6" mt={3}>
          Events on {selectedDate.toDateString()}:
        </Typography>

        {eventsOnSelectedDate.length > 0 ? (
          <List>
            {eventsOnSelectedDate.map((event) => (
              <ListItem key={event.id}>
                <ListItemText primary={event.title} secondary={event.description} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No events on this day.</Typography>
        )}

        <Box mt={4}>
          <Button
            variant="outlined"
            onClick={() => setShowForm(!showForm)}
            sx={{ mb: 2 }}
          >
            {showForm ? "Cancel" : "➕ Add New Event"}
          </Button>

          {showForm && (
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3, maxWidth: 600 }}>
              <Typography variant="h6" gutterBottom>
                New Event on {selectedDate.toDateString()}
              </Typography>

              <TextField
                label="Section ID (e.g. S1)"
                value={secId}
                onChange={(e) => setSecId(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />

              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <TimePicker
                label="Select Time"
                value={selectedTime}
                onChange={(time) => setSelectedTime(time)}
                sx={{ mb: 2, width: "100%" }}
              />
              <Button
                variant="contained"
                onClick={handleAddEvent}
                disabled={submitting}
                fullWidth
              >
                {submitting ? "Adding..." : "Add Event"}
              </Button>
            </Paper>
          )}
        </Box>
      </Box>
    </LocalizationProvider>
  );
}
