import Image from "next/image";

export function NoPacksImg({ className }: { className?: string }) {
  return (
    <Image
      src="/no-packs-full.svg"
      alt="No packs"
      width={300}
      height={280}
      unoptimized
      className={className}
    />
  );
}
