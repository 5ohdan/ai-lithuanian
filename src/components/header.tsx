import { Logo } from "./logo";
import { Links } from "./links";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="absolute left-0 top-0 flex w-full items-center justify-between px-10 pt-7">
      <Logo />
      <div className="flex items-center gap-4">
        <Links />
        <span className="size-7">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </span>
      </div>
    </header>
  );
}
