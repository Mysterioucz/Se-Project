import BaggageAllowance from "@/src/components/additionalServices/baggageAllowance";
import InformationCard from "@/src/app/(user)/[cartId]/checkout/info/_components/information_card";

export default function Page({ params }: { params: { flightId: string } }) {
    const flightId = params.flightId;
    const cardTitle = ["Who's traveling?", "Baggage Allowance"];
    return (
        <div className="flex flex-col w-full h-fit gap-6">
            <span className="text-[3rem] font-bold">{cardTitle[0]}</span>
            <InformationCard />
            <span className="text-[3rem] font-bold">{cardTitle[1]}</span>
            <BaggageAllowance />
        </div>
    );
}
