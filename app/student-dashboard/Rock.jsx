"use client";

import { useEffect, useState } from "react";
import { Typography, LinearProgress, Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Rock() {
  const router = useRouter();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/students/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStudent(data));
  }, []);

 

  const handleClick = () => {
    router.push("student-dashboard/progress");
  };

  const progress = student ? Math.min((student.points / 10000) * 100, 100) : 0;

  return (
    <Box
      onClick={handleClick}
      sx={{
        position: "fixed",
        bottom: "-63vh",
        left: "49%",
        transform: "translateX(-50%)",
        zIndex: 4,
        cursor: "pointer",
        width: 250,
        height: 250,
        transition: "transform 0.3s ease",
        animation: "float 3s ease-in-out infinite",
        position: "relative",
      }}
    >
      {/* ✅ صورة الصخرة */}
      <Image
        src="/images/rock.png"
        alt="Rock Button"
        fill
        style={{
          objectFit: "contain",
          borderRadius: "20px",
          filter: "drop-shadow(0 5px 3px rgba(0, 0, 0, 0.25))",
        }}
      />

     
        {student && (
          <Box
            sx={{
          position: "absolute",
          top: "46.5%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#6F7378", // dark green
              fontWeight: "bold",
              mb: 1,
            }}
          >
            {student.level}
          </Typography>

          {/* 🔵 نقاط الطالب */}
          <Typography
            variant="caption"
            sx={{
              color: "#fff",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
              mb: 0,
              display: "block",
            }}
          >
            {student.points} / 10000 XP
          </Typography>

          {/* 🔵 البروجريس بار */}
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "#ffffff50",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#F5A623",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
