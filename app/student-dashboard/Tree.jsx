import Image from "next/image";

export default function Tree() {
  return (
    <Image
      src="/images/tree.png"
      alt="tree"
      width={300}
      height={300}
      style={{
        position: "fixed",
        bottom: "130px",
        left: "250px",
        zIndex: 2,
      }}
    />
  );
}