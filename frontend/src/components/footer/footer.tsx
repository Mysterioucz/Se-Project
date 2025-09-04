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
          margin: "0 auto",
        }}
      >
        {/* Section 1 */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-row items-center gap-4 self-stretch">
            <p
              style={{
                color: "#044359",
                fontFamily: "Sarabun",
                fontSize: "32px",
                fontWeight: 700,
                lineHeight: "120%",
              }}
            >
              FlyWithSigma
            </p>
          </div>
          <p
            style={{
              color: "#5F696C",
              fontFamily: "Sarabun",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "120%",
              maxWidth: "291px",
            }}
          >
            The future of travel: smooth, aesthetic, and always on trend.
          </p>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col items-start gap-6">
          <p
            style={{
              color: "#044359",
              fontFamily: "Sarabun",
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "120%",
            }}
          >
            Support
          </p>
          <div className="flex flex-col justify-center items-start gap-3 self-stretch">
            <div className="flex items-center gap-2">
              {/* Phone Icon */}
              <span
                style={{
                  color: "#5F696C",
                  fontFamily: "Sarabun",
                  fontSize: "16px",
                  fontWeight: 400,
                  lineHeight: "120%",
                }}
              >
                +1 (555) 123-4567
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Mail Icon */}
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
        </div>

        {/* Section 3 */}
        <div className="flex flex-col items-start gap-6">
          <p
            style={{
              color: "#044359",
              fontFamily: "Sarabun",
              fontSize: "18px",
              fontWeight: 600,
              lineHeight: "120%",
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