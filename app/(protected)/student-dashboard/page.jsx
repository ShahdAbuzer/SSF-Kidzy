"use client";

import dynamic from "next/dynamic";

const CanvasDashboard = dynamic(
  () => import("./CanvasDashboard"),
  { ssr: false }
);

export default function StudentDashboardPage() {
  return <CanvasDashboard />;
}
