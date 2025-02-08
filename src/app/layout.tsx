import "~/styles/globals.css";
import { Toaster } from "~/components/ui/sonner";

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
      <body className="flex min-h-screen w-full flex-col justify-self-center md:w-3/4 lg:w-2/3 xl:w-1/2">
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
