import Image from "next/image";

export default function House() {
  return (
    <Image
      src="/images/house.png"
      alt="house"
      width={300}
      height={300}
      style={{
        position: "absolute",
        bottom: "270px",

        left: "calc(44% - 100px)",
        zIndex: 3,
      }}
    />
  );
}
