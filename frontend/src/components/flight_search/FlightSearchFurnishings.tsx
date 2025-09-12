import Image from 'next/image'

export default function FlightSearchFunishing() {
    return (
        <div className="flex w-[77.5rem] h-[42.5rem] flex-col items-center gap-[var(--Spacing-xxl,40px)]">
            <div className="flex w-[77.5rem] h-[15.625rem] py-[var(--Spacing-md,1rem)] justify-center items-center gap-[var(--Spacing-xxxl,4rem)] self-stretch bg-color-background">

                <div className="flex w-[22.1875rem] h-[14.625rem] p-[var(--Spacing-sm,0.5rem)] flex-col items-start gap-[0.625rem] flex-[1_0_0] bg-color-background">
                    <div className="flex w-[22.1875rem] h-[3rem] items-center gap-[0.625rem] self-stretch bg-color-background">
                        <Image src="/flight-search-funishings/fi-br-search-heart.svg" alt="Logo" width={48} height={48} />
                    </div>
                    <h1 className="w-[19.375rem] h-[2.625rem] flex-shrink-0 text-justify text-[32px] font-sarabun font-bold leading-[120%] text-primary-600">
                        Easy Search
                    </h1>
                    <p className="w-[19.375rem] h-[6.25rem] flex-shrink-0 text-justify text-[14px] font-sarabun font-normal leading-[120%] text-primary-400 max-w-[19.375rem]">
                        Our website provide user friendly search engine, you can find by entering flight details and preferences. This features save user time by providing various options for sort and filter.                 
                    </p>
                </div>

                <div className="flex w-[22.1875rem] h-[14.625rem] p-[var(--Spacing-sm,0.5rem)] flex-col items-start gap-[0.625rem] flex-[1_0_0] bg-color-background">
                    <div className="flex w-[22.1875rem] h-[3rem] items-center gap-[0.625rem] self-stretch bg-color-background">
                        <Image src="/flight-search-funishings/fi-br-time-check.svg" alt="Logo" width={48} height={48} />
                    </div>
                    <h1 className="w-[19.375rem] h-[2.625rem] flex-shrink-0 text-justify text-[32px] font-sarabun font-bold leading-[120%] text-primary-600">
                        Real Time Data
                    </h1>
                    <p className="w-[19.375rem] h-[6.25rem] flex-shrink-0 text-justify text-[14px] font-sarabun font-normal leading-[120%] text-primary-400 max-w-[19.375rem]">
                        User can view real time price, availability, and flight informations anytime and anywhere around the world. Our website integrates with multiple airlines, ensuring accurate information for user to make the best decisions.                 
                    </p>
                </div>

                <div className="flex w-[22.1875rem] h-[14.625rem] p-[var(--Spacing-sm,0.5rem)] flex-col items-start gap-[0.625rem] flex-[1_0_0] bg-color-background">
                    <div className="flex w-[22.1875rem] h-[3rem] items-center gap-[0.625rem] self-stretch bg-color-background">
                        <Image src="/flight-search-funishings/fi-br-money.svg" alt="Logo" width={48} height={48} />
                    </div>
                    <h1 className="w-[19.375rem] h-[2.625rem] flex-shrink-0 text-justify text-[32px] font-sarabun font-bold leading-[120%] text-primary-600">
                        Secure Payment
                    </h1>
                    <p className="w-[19.375rem] h-[6.25rem] flex-shrink-0 text-justify text-[14px] font-sarabun font-normal leading-[120%] text-primary-400 max-w-[19.375rem]">
                        Pay your way with a wide range of options, including online banking and QR code. Our platform uses industry-standard encryption to ensure every transaction is secure, fast, and convenient.                 
                    </p>
                </div>

            </div>

            <div className="flex flex-col items-start gap-[var(--Spacing-lg,1.5rem)] flex-[1_0_0] self-stretch p-[var(--Spacing-lg,1.5rem)] px-[var(--Spacing-xxl,2.5rem)] rounded-t-[var(--Radius-lg,1rem)] bg-[var(--color-primary-50)]">
                <h1 className="w-[72.5rem] h-[3.4375rem] self-stretch text-justify text-[40px] font-sarabun font-medium leading-[120%] text-primary-600">
                    Popular Attractions
                </h1>
                
                <div className="flex items-center gap-[var(--Spacing-xl,2rem)] self-stretch">
                    <div className="flex flex-col justify-center items-start gap-[var(--Spacing-sm-md,0.75rem)]">
                        <Image src="/flight-search-funishings/paris-unsplash.jpg" alt="city-paris" width={314} height={178} className="rounded-[var(--Spacing-md,1rem)] object-cover"/>
                        <h3 className="text-primary-400 font-sarabun text-[20px] font-semibold leading-[120%]">
                            Paris, France
                        </h3>
                    </div>
                    <div className="flex flex-col justify-center items-start gap-[var(--Spacing-sm-md,0.75rem)]">
                        <Image src="/flight-search-funishings/sydney-unsplash.jpg" alt="city-sydney" width={314} height={178} className="rounded-[var(--Spacing-md,1rem)] object-cover"/>
                        <h3 className="text-primary-400 font-sarabun text-[20px] font-semibold leading-[120%]">
                            Sydney, Australia
                        </h3>
                    </div>
                    <div className="flex flex-col justify-center items-start gap-[var(--Spacing-sm-md,0.75rem)]">
                        <Image src="/flight-search-funishings/bangkok-unsplash.jpg" alt="city-bangkok" width={314} height={178} className="rounded-[var(--Spacing-md,1rem)] object-cover"/>
                        <h3 className="text-primary-400 font-sarabun text-[20px] font-semibold leading-[120%]">
                            Bangkok, Thailand
                        </h3>
                    </div>
                </div>
            </div>

        </div>
    );
}