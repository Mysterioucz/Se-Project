import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
<<<<<<< HEAD
import SessionProvider from "@src/lib/SessionProvider";
import { getServerSession } from "next-auth";

const sarabun = Sarabun({
    variable: "--font-sarabun",
    subsets: ["latin"],
    weight: ["400", "700"],
=======
import SessionProvider from "@/lib/SessionProvider";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["latin"],
  weight: ["400", "700"],
>>>>>>> feat/account-setting
});

export const metadata: Metadata = {
  title: "FlyWithSigma",
  description: "FlyWithSigma - Your Ultimate Flight Companion",
};

export default async function RootLayout({
<<<<<<< HEAD
    children,
=======
  children,
>>>>>>> feat/account-setting
}: Readonly<{
  children: React.ReactNode;
}>) {
<<<<<<< HEAD
    const session = await getServerSession();

    return (
        <html lang="en">
            <body className={`${sarabun.variable} antialiased`}>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <SessionProvider session={session}>
                        {children}
                    </SessionProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
=======
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${sarabun.variable} antialiased`}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <SessionProvider session={session}>
            <div className="flex flex-col">
              <Navbar></Navbar>
              {children}
            </div>
          </SessionProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
>>>>>>> feat/account-setting
}
