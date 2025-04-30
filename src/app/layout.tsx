import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner";
import { Header } from "~/components/header";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "AI Lithuanian",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <link rel="preload" href="/bg_smol.jpg" as="image" />
      </head>
      <body>
        <Toaster richColors />
        <div className="flex h-svh w-full justify-self-center sm:p-10">
          <main className="relative flex h-full w-full flex-col justify-self-center bg-neutral-900 sm:rounded-3xl">
            <div className="absolute inset-0 z-0 overflow-hidden sm:rounded-3xl">
              <Image
                src="/bg_smol.jpg"
                alt="Background"
                fill
                priority
                quality={75}
                className="object-cover object-center"
              />
            </div>
            <div className="relative z-10 flex h-full w-full flex-col">
              <Header />
              <div className="flex h-full w-full items-center justify-center">
                {children}
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
