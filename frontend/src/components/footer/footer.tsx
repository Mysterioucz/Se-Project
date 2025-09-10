import Image from "next/image";
import Link from "next/link";

export default function Footer() {
<<<<<<< HEAD
  return (
    <footer className="bg-white text-gray-800 mt-8">
      <div className="flex w-[90rem] px-[4rem] py-[2.5rem] items-start gap-[8rem] mx-auto">
        {/* Section 1 */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-row items-center gap-4 self-stretch">
            <Image
              src="/logo/logo_nobg.svg"
              alt="Logo"
              width={55}
              height={55}
              className="aspect-square w-[3.4375rem] h-[3.4375rem]"
            />
            <p className="text-[#044359] font-sarabun text-[2rem] font-bold leading-[120%]">
              FlyWithSigma
            </p>
          </div>
          <p className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%] max-w-[18.1875rem]">
            The future of travel: smooth, aesthetic, and always on trend.
          </p>
        </div>

        {/* Section 2 */}
        <div className="flex flex-col items-start gap-6">
          <p className="text-[#044359] font-sarabun text-[1.125rem] font-semibold leading-[120%]">
            Support
          </p>
          <div className="flex flex-col justify-center items-start gap-3 self-stretch">
            <div className="flex items-center gap-2">
              <Image
                src="/footer-icon/fi-br-call-history.svg"
                alt="Logo"
                width={16}
                height={16}
                className="aspect-square w-[1rem] h-[1rem]"
              />
              <span className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%]">
                +1 (555) 123-4567
              </span>
=======
    return (
        <footer className="bg-white text-gray-800 mt-8">
            <div className="flex w-[1440px] px-[64px] py-[40px] items-start gap-[128px] mx-auto">
                {/* Section 1 */}
                <div className="flex flex-col items-start gap-6">
                    <div className="flex flex-row items-center gap-4 self-stretch">
                        <Image
                            src="/icons/Logo_png.png"
                            alt="Logo"
                            className="aspect-square"
                            width={55}
                            height={55}
                        />
                        <p className="text-[#044359] font-sarabun text-[32px] font-bold leading-[120%]">
                            FlyWithSigma
                        </p>
                    </div>
                    <p className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%] max-w-[291px]">
                        The future of travel: smooth, aesthetic, and always on
                        trend.
                    </p>
                </div>

                {/* Section 2 */}
                <div className="flex flex-col items-start gap-6">
                    <p className="text-[#044359] font-sarabun text-[18px] font-semibold leading-[120%]">
                        Support
                    </p>
                    <div className="flex flex-col justify-center items-start gap-3 self-stretch">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/icons/icon_stroke/fi-br-call-history.svg"
                                alt="telephone"
                                className="flex w-[16px] h-[16px] justify-center items-center aspect-square"
                                width={55}
                                height={55}
                            />
                            <span className="text-[#5F696C] font-sarabun text-[16px] font-normal leading-[120%]">
                                +1 (555) 123-4567
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Image
                                src="/icons/icon_stroke/fi-br-envelope.svg"
                                alt="email"
                                className="flex w-[16px] h-[16px] justify-center items-center aspect-square"
                                width={55}
                                height={55}
                            />
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
>>>>>>> main
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/footer-icon/fi-br-envelope.svg"
                alt="Logo"
                width={16}
                height={16}
                className="aspect-square w-[1rem] h-[1rem]"
              />
              <span className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%]">
                support@flywithsigma.com
              </span>
            </div>

            <nav className="flex flex-col justify-center items-start gap-3 self-stretch">
              <Link
                href="/contact"
                className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%] hover:underline"
              >
                Contact Us
              </Link>
              <Link
                href="/help"
                className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%] hover:underline"
              >
                Help Center
              </Link>
            </nav>
          </div>
        </div>

        {/* Section 3 */}
        <div className="flex flex-col items-start gap-6">
          <p className="text-[#044359] font-sarabun text-[1.125rem] font-semibold leading-[120%]">
            Legal
          </p>

          <nav className="flex flex-col justify-center items-start gap-3 self-stretch">
            <Link
              href="/privacy"
              className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%] hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%] hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%] hover:underline"
            >
              Cookie Policy
            </Link>
            <Link
              href="/accessibility"
              className="text-[#5F696C] font-sarabun text-[1rem] font-normal leading-[120%] hover:underline"
            >
              Accessibility
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}