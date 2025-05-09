// app/(protected)/UserLoader.js
"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";

export default function UserLoader() {
  useEffect(() => {
    const endpoints = [
      { role: "STUDENT",    url: "http://localhost:8080/api/students/me" },
      { role: "INSTRUCTOR", url: "http://localhost:8080/api/instructors/current" },
      { role: "ADMIN",      url: "http://localhost:8080/api/admin/current" },
    ];

    const loadCurrentUser = async () => {
      try {
        for (const ep of endpoints) {
          const res = await fetch(ep.url, { credentials: "include" });

          if (res.ok) {
            const data = await res.json();
            // 🟢 خزّن الاسم والمعرّف والـ role
            Cookies.set("currentUserName", data?.name || "", {
              path: "/", sameSite: "lax",
            });
            Cookies.set("currentUserId",   String(data?.id || ""), {
              path: "/", sameSite: "lax",
            });
            Cookies.set("currentUserRole", ep.role, {
              path: "/", sameSite: "lax",
            });
            return; // وقف عند أوّل نجاح
          }
        }

        // لو ولا وحدة زبطت
        console.warn("No matching /me endpoint responded with 200.");
      } catch (err) {
        console.error("❌ UserLoader error:", err);
      }
    };

    loadCurrentUser();
  }, []);

  // مجرد سايد إفّكت – ما في UI
  return null;
}
