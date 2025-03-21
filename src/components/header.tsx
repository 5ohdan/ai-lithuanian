import { Logo } from "./logo";
import Link from "next/link";

export function Header() {
  return (
    <header className="absolute left-0 top-0 flex w-full items-center justify-between px-10 pt-7">
      <Logo />
      <div className="flex h-12 gap-2">
        <Link
          href="/wordsets"
          className="self-center rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          View Word Sets →
        </Link>
      </div>
    </header>
  );
}
