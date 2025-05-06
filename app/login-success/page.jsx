"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    const fetchStudentInfo = async () => {
      try {
        // 🟢 خزّن التوكن أول
        localStorage.setItem("accessToken", token);

        // 🧠 جيب بيانات الطالب
        const res = await fetch("http://localhost:8080/api/students/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        console.log("✅ student info from /me:", data);

        
        localStorage.setItem("studentId", data.studentId)

        router.replace("/student-dashboard");
      } catch (error) {
        console.error("Login error:", error);
        router.replace("/login");
      }
    };

    if (token) {
      fetchStudentInfo();
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return (
    <p style={{ textAlign: "center", marginTop: "2rem" }}>
      Logging you in with Google...
    </p>
  );
}
