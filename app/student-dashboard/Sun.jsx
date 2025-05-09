import Image from "next/image";

export default function Sun() {
  return (
    <Image
      src="/images/sun.png"
      alt="sun"
      width={250}
      height={250}
      style={{
        position: "fixed",
        top: 3,
        left: "1000px",
        zIndex: 4,
      }}
    />
  );
}
