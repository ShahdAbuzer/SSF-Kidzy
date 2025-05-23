import Image from "next/image";

export default function WoodenBoard() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "960px",
        zIndex: 3,
        width: "120px",
        height: "120px",
      }}
    >
      <Image
        src="/images/wooden-board.png"
        alt="wooden board"
        width={120}
        height={120}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily:"'Jaldi', sans-serif",
          fontSize: "15px",
          color: "#6e472b",
          fontWeight: "bold",
        }}
      >
      Themes
      </div>
    </div>
  );
}
