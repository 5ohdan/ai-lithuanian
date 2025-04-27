"use client";

import { Skeleton } from "./ui/skeleton";
import { useEffect, useState } from "react";

export function PackItemSkeleton() {
  const [skeletonsPerRow, setSkeletonsPerRow] = useState(7);

  useEffect(() => {
    const calculateSkeletonsPerRow = () => {
      const skeletonWidth = 80;
      const gapWidth = 8;
      const container = document.querySelector(".pack-skeleton-container");
      if (container) {
        const containerWidth = container.clientWidth;
        const skeletons = Math.floor(
          (containerWidth - gapWidth) / (skeletonWidth + gapWidth),
        );
        setSkeletonsPerRow(Math.max(1, skeletons));
      }
    };
    calculateSkeletonsPerRow();
    window.addEventListener("resize", calculateSkeletonsPerRow);

    return () => window.removeEventListener("resize", calculateSkeletonsPerRow);
  }, []);

  return (
    <div className="pack-skeleton-container flex min-h-28 flex-col gap-4 rounded-lg bg-neutral-100/85 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-[250px] rounded-md bg-neutral-200/75" />
        <Skeleton className="h-7 w-[150px] rounded-md bg-neutral-200/75" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: skeletonsPerRow }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-7 w-20 rounded-md bg-neutral-200/75"
          />
        ))}
      </div>
    </div>
  );
}
