export default function ResponseTime() {
    return (
        <div className="flex flex-col gap-[2rem] border-2 border-solid border-[var(--color-primary-400)] p-[2rem]">
            <div className="text-[1.5rem] !font-semibold text-[var(--color-primary-700)]">
                Response Time
            </div>
            <div className="flex flex-col gap-[0.5rem]">
                <div className="flex gap-[0.625rem]">
                    <p className="!font-semibold !text-[1.125rem] text-[var(--color-primary-700)]">Normal :</p>
                    <p className="!font-semibold !text-[1.125rem]">within 2 hours</p>
                </div>
                <div className="flex gap-[0.625rem]">
                    <p className="!font-semibold !text-[1.125rem] text-[var(--color-primary-700)]">High :</p>
                    <p className="!font-semibold !text-[1.125rem]">within 1 hours</p>
                </div>
            </div>

        </div>
    );
}