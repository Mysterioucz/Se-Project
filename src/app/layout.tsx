import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import SessionGuard from "@src/components/SessionGuard";
import SessionProvider from "@src/lib/SessionProvider";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { Sarabun } from "next/font/google";
import { nextAuthOptions } from "../lib/auth";
import "./globals.css";

const sarabun = Sarabun({
    variable: "--font-sarabun",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export const metadata: Metadata = {
    title: "FlyWithSigma",
    description: "FlyWithSigma - Your Ultimate Flight Companion",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(nextAuthOptions);

    return (
        <html lang="en">
            <body className={`${sarabun.variable} antialiased`}>
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <SessionProvider session={session}>
                        <SessionGuard />
                        {children}
                    </SessionProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
