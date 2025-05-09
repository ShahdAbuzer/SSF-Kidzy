import Image from "next/image";

export default function WoodenBoard() {
  return (
    <Image
      src="/images/wooden-board.png"
      alt="wooden board"
      width={120}
      height={120}
      style={{
        position: "fixed",
        bottom: "80px",
        left: "960px", // بدّل right بـ left وثبت مكانه حسب الخلفية
        zIndex: 3,
      }}
    />
  );
}
