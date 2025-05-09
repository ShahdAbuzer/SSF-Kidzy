"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Rocket() {
  const [launched, setLaunched] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    setLaunched(true);

    setTimeout(() => {
      router.push("/current-games");
    }, 200); // نعطي وقت يكمل الأنيميشن
  };

  return (
    <Image
      src={"/images/rocket.png" }
      alt="rocket"
      width={100}
      height={100}
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: launched ? "100vh" : "160px",
        left: "865px",
        zIndex: 3,
        cursor: "pointer",
        transition: "bottom 0.5s ease-in, transform 0.3s",
        transform: launched ? "rotate(-40deg)" : "none", // شوي ميول بالطيران
      }}
    />
  );
}
