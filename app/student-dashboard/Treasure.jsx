"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Treasure() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setIsOpen(true);
    setTimeout(() => {
      router.push("student-dashboard/buy-games-and-themes");
    }, 180);
  };

  return (
    <Image
      src={`/images/${isOpen ? "treasure-open.png" : "treasure.png"}`}
      alt="treasure"
      width={100}
      height={100}
      onClick={handleClick}
      style={{
        position: "absolute",
        bottom: "360px",
        left: "970px",
        zIndex: 3,
        cursor: "pointer",
        transition: "transform 0.2s ease",
      }}
    />
  );
}
