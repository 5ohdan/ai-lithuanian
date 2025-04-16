"use client";

import { Skeleton } from "./ui/skeleton";

export function WordsetItemSkeleton() {
  return (
    <div className="flex h-28 flex-col gap-2 rounded-lg bg-neutral-100/85 p-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-[250px] rounded-md bg-neutral-200/75" />
        <Skeleton className="h-7 w-[150px] rounded-md bg-neutral-200/75" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-7 w-20 rounded-md bg-neutral-200/75"
          />
        ))}
      </div>
    </div>
  );
}
