import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import Navbar from "@/src/components/Navbar";
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
    return (
        <html lang="en">
            <body className={`flex flex-col ${sarabun.variable} antialiased`}>
                <Navbar isSignIn={false} />
                <div className="w-full h-full flex flex-col items-center">
                    {children}
                </div>
            </body>
        </html>
    );
}
