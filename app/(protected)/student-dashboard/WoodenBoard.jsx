import Image from "next/image";

export default function WoodenBoard() {
  return (
    <Image
      src="/images/wooden-board.png"
      alt="wooden board"
      width={100}
      height={100}
      style={{
        position: "absolute",
        bottom: "220px",
        right: "550px",
        zIndex: 3,
      }}
    />
  );
}
