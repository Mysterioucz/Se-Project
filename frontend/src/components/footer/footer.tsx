import Image from "next/image";
import Link from "next/link";
import { CallHistory, EnvelopeIcon } from "../icons/module";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 mt-8">
      <div className="flex w-[1440px] px-[64px] py-[40px] items-start gap-[128px] mx-auto">
        {/* Section 1 */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-row items-center gap-4 self-stretch">
            <Image
              src="/logo/logo_nobg.svg"
              alt="Logo"
              width={55}
              height={55}
              className="aspect-square"
            />
            <p className="text-[#044359] font-sarabun text-[32px] font-bold leading-[120%]">
              FlyWithSigma
            </p>
          </div>
          <p className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%] max-w-[291px]">
            The future of travel: smooth, aesthetic, and always on trend.
          </p>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col items-start gap-6">
          <p className="text-[#044359] font-sarabun text-[18px] font-semibold leading-[120%]">
            Support
          </p>
          <div className="flex flex-col justify-center items-start gap-3 self-stretch">
            <div className="flex items-center gap-2">
              <CallHistory className="w-4 h-4 flex-shrink-0" />
              <span className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%]">
                +1 (555) 123-4567
              </span>
            </div>

            <div className="flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
              <span className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%]">
                support@flywithsigma.com
              </span>
            </div>

            <nav className="flex flex-col justify-center items-start gap-3 self-stretch">
              <Link
                href="/contact"
                className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%] hover:underline"
              >
                Contact Us
              </Link>
              <Link
                href="/help"
                className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%] hover:underline"
              >
                Help Center
              </Link>
            </nav>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col items-start gap-6">
          <p className="text-[#044359] font-sarabun text-[18px] font-semibold leading-[120%]">
            Legal
          </p>

          <nav className="flex flex-col justify-center items-start gap-3 self-stretch">
            <Link
              href="/privacy"
              className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%] hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%] hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%] hover:underline"
            >
              Cookie Policy
            </Link>
            <Link
              href="/accessibility"
              className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%] hover:underline"
            >
              Accessibility
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
