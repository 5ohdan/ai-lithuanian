import { Logo } from "./logo";
import { Links } from "./links";
import Link from "next/link";

export function Header() {
  return (
    <header className="absolute left-0 top-0 flex w-full items-center justify-between px-10 pt-7">
      <Link href="/new-set">
        <Logo />
      </Link>
      <Links />
    </header>
  );
}
