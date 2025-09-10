import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import SessionProvider from "@src/lib/SessionProvider";
import { getServerSession } from "next-auth";

const sarabun = Sarabun({
    variable: "--font-sarabun",
    subsets: ["latin"],
    weight: ["400", "700"],
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
}
