import Image from "next/image";

export default function Treasure() {
  return (
    <Image
      src="/images/treasure.png"
      alt="treasure"
      width={100}
      height={100}
      style={{
        position: "absolute",
        bottom: "270px",
        left: "980px",
        zIndex: 3,
      }}
    />
  );
}
