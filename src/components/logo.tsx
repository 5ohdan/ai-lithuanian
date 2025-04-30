import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import logo from "public/logo.svg";

export function Logo() {
  return (
    <Link href="/new-pack" className="max-w-32 sm:max-w-fit">
      <Image src={logo as StaticImageData} alt="Logo" unoptimized width={200} />
    </Link>
  );
}
