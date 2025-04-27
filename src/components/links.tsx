"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getStorage } from "~/lib/storage";
import { useState, useEffect } from "react";

const storage = getStorage();

export function Links() {
  const pathname = usePathname();
  const [hasPacks, setHasPacks] = useState(false);

  useEffect(() => {
    setHasPacks(storage.getPacks().length > 0);
  }, []);

  const links = [
    {
      label: "+ New pack",
      href: "/new-pack",
      disabled: false,
    },
    {
      label: "Packs →",
      href: "/packs",
      disabled: !hasPacks,
    },
  ];

  return (
    <div className="flex h-12 gap-2">
      {links
        .filter((link) => link.href !== pathname && !link.disabled)
        .map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="self-center rounded-md bg-primary bg-white px-4 py-2 font-medium text-black hover:text-black/90"
          >
            {link.label}
          </Link>
        ))}
    </div>
  );
}
