"use client";

import PaymentMethods from "./_components/PaymentMethods";

export default function Page() {
	return (
		<div className="flex flex-row px-[8rem] gap-[8rem] justify-between w-full">
			<div className="flex flex-col gap-[1.5rem] w-full">
				<div className="text-[3rem] font-bold text-[var(--color-primary-900)]">Payment</div>

				<div className="flex flex-col gap-[2rem]">
					<div className="gap-[2rem] p-[1.5rem] bg-[var(--color-primary-50)] rounded-[0.5rem]">
						<div className="text-[2rem] font-bold text-[var(--color-primary-900)] mb-[1.5rem]">
							Payment Methods
						</div>
						<PaymentMethods />
					</div>

					<div className="gap-[2rem] p-[1.5rem] bg-[var(--color-primary-50)] rounded-[0.5rem]">
						<div className="text-[2rem] font-bold text-[var(--color-primary-900)] mb-[1.5rem]">
							Contact Information
						</div>
						{/* TODO: Contact Information Form */}
					</div>
				</div>
			</div>

			{/* ด้านขวา */}
			<div className="w-[21.25rem] h-[47.5625rem] bg-red-500"></div>
		</div>
	);
}
