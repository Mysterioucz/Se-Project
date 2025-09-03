import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-white text-gray-800 mt-8">
            <div
                className="flex"
                style={{
                    width: "1440px",
                    padding: "40px 64px",
                    alignItems: "flex-start",
                    gap: "128px",
                    margin: "0 auto", // center the footer horizontally
                }}
            >
                {/* Section 1 */}
                <div className="flex-1 text-left">
                    <p className="font-bold">FlyWithSigma</p>
                    <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>

                {/* Section 2 */}
                <div className="flex-1 flex flex-col items-start gap-6">
                    <p
                        style={{
                            color: "#044359", // Primary-800
                            fontFamily: "Sarabun",
                            fontSize: "18px",
                            fontWeight: 600,
                            lineHeight: "120%", // 21.6px
                        }}
                    >
                        Support
                    </p>

                    {/* Phone */}
                    <div className="flex flex-col justify-center items-start gap-3 self-stretch">
                        <span
                            style={{
                                color: "#5F696C", // Gray-400
                                fontFamily: "Sarabun",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "120%", // 19.2px
                            }}
                        >
                            +1 (555) 123-4567
                        </span>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col justify-center items-start gap-3 self-stretch">
                        <span
                            style={{
                                color: "#5F696C",
                                fontFamily: "Sarabun",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "120%",
                            }}
                        >
                            support@flywithsigma.com
                        </span>
                    </div>

                    {/* Links */}
                    <nav className="flex flex-col justify-center items-start gap-3 self-stretch">
                        <Link
                            href="/contact"
                            style={{
                                color: "#5F696C",
                                fontFamily: "Sarabun",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "120%",
                            }}
                            className="hover:underline"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href="/help"
                            style={{
                                color: "#5F696C",
                                fontFamily: "Sarabun",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "120%",
                            }}
                            className="hover:underline"
                        >
                            Help Center
                        </Link>
                    </nav>
                </div>

                {/* Section 3 */}
                <div className="flex-1 flex flex-col items-start gap-6">
                    <p
                        style={{
                            color: "#044359", // Primary-800
                            fontFamily: "Sarabun",
                            fontSize: "18px",
                            fontWeight: 600,
                            lineHeight: "120%", // 21.6px
                        }}
                    >
                        Legal
                    </p>

                    {/* Links */}
                    <nav className="flex flex-col justify-center items-start gap-3 self-stretch">
                        <Link
                            href="/privacy"
                            style={{
                                color: "#5F696C",
                                fontFamily: "Sarabun",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "120%",
                            }}
                            className="hover:underline"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/about"
                            style={{
                                color: "#5F696C",
                                fontFamily: "Sarabun",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "120%",
                            }}
                            className="hover:underline"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/cookies"
                            style={{
                                color: "#5F696C",
                                fontFamily: "Sarabun",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "120%",
                            }}
                            className="hover:underline"
                        >
                            Cookie Policy
                        </Link>
                        <Link
                            href="/accessibility"
                            style={{
                                color: "#5F696C",
                                fontFamily: "Sarabun",
                                fontSize: "16px",
                                fontWeight: 400,
                                lineHeight: "120%",
                            }}
                            className="hover:underline"
                        >
                            Accessibility
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
