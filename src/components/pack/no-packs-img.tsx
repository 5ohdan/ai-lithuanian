import Image, { type StaticImageData } from "next/image";
import noPacks from "public/no-packs-full.svg";

export function NoPacksImg({ className }: { className?: string }) {
  return (
    <Image
      src={noPacks as StaticImageData}
      alt="No packs"
      width={300}
      height={280}
      unoptimized
      className={className}
    />
  );
}
