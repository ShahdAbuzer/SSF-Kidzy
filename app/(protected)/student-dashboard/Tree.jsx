import Image from "next/image";

export default function Tree() {
  return (
    <Image
      src="/images/tree.png"
      alt="tree"
      width={250}
      height={250}
      style={{
        position: "absolute",
        bottom: "250px",
        left: "270px",
        zIndex: 2,
      }}
    />
  );
}
