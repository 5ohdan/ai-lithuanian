"use client";

import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";
import { useIsMobile } from "../../hooks/use-mobile";

export function PackItemSkeleton() {
  const [skeletonsPerRow, setSkeletonsPerRow] = useState(4);
  const isMobile = useIsMobile();

  useEffect(() => {
    const calculateSkeletonsPerRow = () => {
      // Define dimensions based on device type
      const deviceIsMobile = !!isMobile;
      const skeletonWidth = deviceIsMobile ? 64 : 80; // 16px (w-16) vs 20px (w-20)
      const gapWidth = 8; // gap-2 = 8px
      const containerPadding = deviceIsMobile ? 16 : 32; // p-2 (8px*2) vs p-4 (16px*2)

      const container = document.querySelector(".pack-skeleton-container");
      if (container) {
        const containerWidth = container.clientWidth;
        const availableWidth = containerWidth - containerPadding * 2;
        const skeletons = Math.floor((availableWidth + gapWidth) / (skeletonWidth + gapWidth));
        setSkeletonsPerRow(Math.max(1, skeletons));
      }
    };

    calculateSkeletonsPerRow();
    window.addEventListener("resize", calculateSkeletonsPerRow);
    return () => window.removeEventListener("resize", calculateSkeletonsPerRow);
  }, [isMobile]);

  return (
    <div className="pack-skeleton-container flex flex-col gap-2 rounded-lg bg-neutral-100/85 p-2 sm:min-h-28 sm:gap-4 sm:p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-[180px] rounded-md bg-neutral-200/75 sm:h-7 sm:w-[250px]" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: skeletonsPerRow }).map((_, index) => (
          <Skeleton key={index} className="h-5 w-16 rounded-md bg-neutral-200/75 sm:h-7 sm:w-20" />
        ))}
      </div>
    </div>
  );
}
