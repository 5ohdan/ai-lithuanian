import Image, { type StaticImageData } from "next/image";
import logo from "~/assets/logo.svg";

export function Logo() {
  return (
    <Image
      src={logo as StaticImageData}
      alt="Logo"
      width={216}
      height={56}
      unoptimized
    />
  );
}
