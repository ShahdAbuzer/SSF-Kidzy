"use client";

import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/auth/LoginForm"));

export default function LoginWrapper() {
  return <LoginForm />;
}
