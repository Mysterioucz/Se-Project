import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
    variable: "--font-sarabun",
    subsets: ["latin"],
    weight: ["400", "700"]
});

export const metadata: Metadata = {
    title: "FlyWithSigma",
    description: "FlyWithSigma - Your Ultimate Flight Companion",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${sarabun.variable} antialiased`}
            >
                {children}
            </body>
        </html>
    );
}
