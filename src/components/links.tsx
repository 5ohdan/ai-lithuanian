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
    const checkPacks = () => {
      setHasPacks(storage.getPacks().length > 0);
    };

    checkPacks();

    const unsubscribe = storage.subscribe(checkPacks);

    return () => unsubscribe();
  }, []);

  const links = [
    {
      label: ["+ ", "New pack"],
      href: "/new-pack",
      disabled: false,
    },
    {
      label: ["Packs", " →"],
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
            className="group self-center rounded-md px-4 py-2 font-medium text-white transition-all hover:bg-neutral-800/85"
          >
            {link.label.map((label) => (
              <span key={label} className="transition-all group-hover:mx-0.5">
                {label}
              </span>
            ))}
          </Link>
        ))}
    </div>
  );
}
