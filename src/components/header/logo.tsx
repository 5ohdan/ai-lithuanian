import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/new-pack" className="max-w-32 sm:max-w-fit">
      <Image src="/logo.svg" alt="Logo" unoptimized width={200} height={40} />
    </Link>
  );
}
