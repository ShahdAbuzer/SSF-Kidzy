// app/(auth)/login-success/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginSuccessPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    const loadCurrentUser = async () => {
      if (!token) {
        router.replace("/login");
        return;
      }

      // نحاول على 3 نهايات مختلفة عشان نحدد الـ role
      const endpoints = [
        { role: "STUDENT",    url: "http://localhost:8080/api/students/me",         dashboard: "/student-dashboard" },
        { role: "INSTRUCTOR", url: "http://localhost:8080/api/instructors/current", dashboard: "/instructor-dashboard" },
        { role: "ADMIN",      url: "http://localhost:8080/api/admin/current",      dashboard: "/admin-dashboard" },
      ];

      try {
        for (const ep of endpoints) {
          const res = await fetch(ep.url, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });

          if (res.ok) {
            const data = await res.json();

            // ✍️ خزّن بيانات المستخدم الفعلي
            Cookies.set("currentUserId",   String(data.id),   { path: "/", sameSite: "lax" });
            Cookies.set("currentUserName", data.name || "",   { path: "/", sameSite: "lax" });
            Cookies.set("currentUserRole", ep.role,           { path: "/", sameSite: "lax" });
            Cookies.set("accessToken",     token,             { path: "/", sameSite: "lax" });

            // (اختياري) ستورج مؤقّت لو بتحبّي
            sessionStorage.setItem("currentUser", JSON.stringify(data));

            // توجيه للداشبورد المناسب
            router.replace(ep.dashboard);
            return;
          }
        }

        // لو ما لاقى أي دور
        console.warn("No /me endpoint matched this token.");
        router.replace("/login");
      } catch (err) {
        console.error("Login error:", err);
        router.replace("/login");
      }
    };

    loadCurrentUser();
  }, [router, searchParams]);

  return (
    <p style={{ textAlign: "center", marginTop: "2rem" }}>
      Logging you in… ⏳
    </p>
  );
}
