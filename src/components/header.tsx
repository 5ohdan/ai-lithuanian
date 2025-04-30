"use client";

import { Logo } from "./logo";
import { Links } from "./links";

export function Header() {
  return (
    <header className="absolute left-0 top-0 flex w-full items-center justify-between px-2 pt-2 sm:px-10 sm:pt-7">
      <Logo />
      <Links />
    </header>
  );
}
