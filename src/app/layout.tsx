import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner";
import { Header } from "~/components/header";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Lithuanian",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <Toaster richColors />
        <div className="flex h-screen w-full justify-self-center px-10 py-10">
          <main className="relative flex h-full w-full flex-col justify-self-center rounded-3xl bg-neutral-900 bg-[url('/bg_smol.jpg')] bg-cover bg-center">
            <Header />
            <div className="flex h-full items-center justify-center">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
