import Image from "next/image";

export default function Rock() {
  return (
    <Image
      src="/images/rock.png"
      alt="rock"
      width={250}
      height={250}
      style={{
        position: "absolute",
        bottom: "100px",
        left: "calc(45% - 110px)",
        zIndex: 4,
      }}
    />
  );
}
