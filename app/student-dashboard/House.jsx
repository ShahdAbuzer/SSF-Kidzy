"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function House() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true); // يفتح الباب
    setTimeout(() => {
      router.push("/");
    }, 600); // بعد شوي يوديك على الهوم
  };

  return (
    <Image
      src={open ? "/images/house-open.png" : "/images/house.png"} // ✨ بدل الصورة
      alt="house"
      width={400}
      height={400}
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "150px",
        left: "570px",
        zIndex: 3,
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
      }}
    />
  );
}
