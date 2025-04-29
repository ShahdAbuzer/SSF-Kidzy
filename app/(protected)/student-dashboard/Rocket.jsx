import Image from "next/image";

export default function Rocket() {
  return (
    <Image
      src="/images/rocket.png"
      alt="rocket"
      width={100}
      height={100}
      style={{
        position: "absolute",
        bottom: "280px",
        right: "550px",
        zIndex: 3,
      }}
    />
  );
}
