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
      <body className="min-w-screen min-h-screen">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
