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

    // Initial check
    checkPacks();

    // Subscribe to storage changes
    const unsubscribe = storage.subscribe(checkPacks);

    // Cleanup subscription on unmount
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
            className="group self-center rounded-md bg-white px-4 py-2 font-medium transition-all"
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
