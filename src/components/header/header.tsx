"use client";

import { Logo } from "./logo";
import { Links } from "./links";
import { useSession } from "~/lib/auth-client";

export function Header() {
  const session = useSession();
  return (
    <header className="absolute top-0 left-0 flex w-full items-center justify-between px-2 pt-4 sm:px-10 sm:pt-7">
      <Logo />
      {session.data?.user && <Links />}
    </header>
  );
}
