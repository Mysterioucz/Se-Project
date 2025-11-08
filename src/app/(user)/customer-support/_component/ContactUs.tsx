export default function ContactUs() {
    return (
        <div className="flex flex-col gap-[2rem] border-2 border-solid border-[var(--color-primary-400)] p-[2rem]">
            <h1 className="!text-[2rem] font-bold text-[var(--color-primary-700)]">
                Contact Us
            </h1>
            <div className="flex flex-col gap-[0.5rem]">
                <div className="flex gap-[0.625rem]">
                    <p className="!font-semibold !text-[1.125rem] text-[var(--color-primary-700)]">Call us :</p>
                    <p className="!font-semibold !text-[1.125rem]">088-888-8888</p>
                </div>
                <div className="flex gap-[0.625rem]">
                    <p className="!font-semibold !text-[1.125rem] text-[var(--color-primary-700)]">Email :</p>
                    <p className="!font-semibold !text-[1.125rem]">flywithsigma@fws.com</p>
                </div>
                <div className="flex gap-[0.625rem]">
                    <p className="!font-semibold !text-[1.125rem] text-[var(--color-primary-700)]">Line Official :</p>
                    <p className="!font-semibold !text-[1.125rem]">@flywithsigma</p>
                </div>
            </div>
            <div className="h-[2px] bg-[var(--color-primary-400)]"></div>
            <div className="text-[1.25rem] !font-semibold text-[var(--color-primary-700)]">
                Work hours: 8:00 - 17:00
            </div>
        </div>
    );
}