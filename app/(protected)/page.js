// app/page.js  (no "use client", no metadata here)
"use client";
import styles from "./page.module.css";
import { Button } from "@mui/material";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1>Welcome to Kidzy LMS</h1>

      <Button
  onClick={async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.href = "/login";
  }}
  sx={{
    backgroundColor: "#f44336",
    color: "#fff",
    borderRadius: 2,
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#d32f2f",
    },
  }}
>
  Logout
</Button>

    </div>
  );
}
