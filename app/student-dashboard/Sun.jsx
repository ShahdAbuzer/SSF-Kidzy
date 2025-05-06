import Image from "next/image";

export default function Sun() {
  return (
    <Image
      src="/images/sun.png"
      alt="sun"
      width={200}
      height={200}
      style={{
        position: "absolute",
        top: 150,
        left: "800px",
        zIndex: 4,
      }}
    />
  );
}
