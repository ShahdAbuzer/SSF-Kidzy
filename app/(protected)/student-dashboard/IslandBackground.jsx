import Image from "next/image";

export default function IslandBackground() {
  return (
    <Image
      src="/images/island.png"
      alt="island background"
      width={1440}
      height={900}
      style={{
        position: "absolute",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1,
      }}
    />
  );
}
