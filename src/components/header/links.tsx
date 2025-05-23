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
      label: ["+ ", "New wordset"],
      href: "/new-pack",
      disabled: false,
    },
    {
      label: ["Saved"],
      href: "/packs",
      disabled: !hasPacks,
    },
  ];

  return (
    <div className="flex h-9 gap-2 sm:h-12">
      {links
        .filter((link) => link.href !== pathname && !link.disabled)
        .map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group self-center rounded-md border border-white/85 px-3 py-2 text-sm font-medium text-white transition-all hover:bg-neutral-800/85 sm:px-4 sm:text-base"
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
