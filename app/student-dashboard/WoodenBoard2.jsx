import Image from "next/image";

export default function WoodenBoard2() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "80px",
        left: "850px",
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
          top: "38%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "'Comic Sans MS', cursive",
           fontFamily:"'Jaldi', sans-serif",
          fontSize: "15px",
          color: "#6e472b",
          fontWeight: "bold",
         
        }}
      >
        Games
      </div>
    </div>
  );
}
