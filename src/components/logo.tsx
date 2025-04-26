import Image, { type StaticImageData } from "next/image";
import logo from "public/logo.svg";

export function Logo() {
  return (
    <Image src={logo as StaticImageData} alt="Logo" width={200} unoptimized />
  );
}
