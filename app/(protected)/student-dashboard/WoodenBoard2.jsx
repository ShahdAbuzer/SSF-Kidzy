import Image from "next/image";

export default function WoodenBoard2() {
  return (
    <Image
      src="/images/wooden-board.png"
      alt="wooden board"
      width={100}
      height={100}
      style={{
        position: "absolute",
        bottom: "220px",
        right: "430px",
        zIndex: 3,
      }}
    />
  );
}
