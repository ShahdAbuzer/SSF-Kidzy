"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);

      router.replace("/");
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
