"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Links() {
  const pathname = usePathname();
  const links = [
    {
      label: "New wordset +",
      href: "/new-set",
    },
    {
      label: "View Word Sets →",
      href: "/wordsets",
    },
  ];
  return (
    <div className="flex h-12 gap-2">
      {links
        .filter((link) => link.href !== pathname)
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
