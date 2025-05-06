import Image from "next/image";

export default function IslandBackground() {
  return (
    <Image
    src="/images/island.svg"
    alt="island background"
    fill
    style={{
      objectFit: "cover",
      position: "absolute",
      top: -60,
      left: 50,
      zIndex: 1,
    }}
  />
  
  );
}
