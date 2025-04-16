import Image, { type StaticImageData } from "next/image";
import noSets from "public/no-sets-full.svg";

export function NoSetsImg() {
  return (
    <Image
      src={noSets as StaticImageData}
      alt="No sets"
      width={300}
      height={280}
      unoptimized
    />
  );
}
