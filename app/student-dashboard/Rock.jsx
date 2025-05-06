"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Rock() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/progress"); // 🟢 يتنقل لصفحة التقدم
  };

  return (
    <Image
      src="/images/rock.png"
      alt="rock"
      width={250}
      height={250}
      onClick={handleClick}
      style={{
        position: "absolute",
        bottom: "20vh",
        left: "49%",
        transform: "translateX(-50%)",
        zIndex: 4,
        cursor: "pointer",
      }}
    />
  );
}
