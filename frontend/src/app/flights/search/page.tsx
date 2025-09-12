import Footer from "@components/footer/footer"
import Navbar from "@/src/components/Navbar";
import FlightSearchFunishing from "@components/flight_search/FlightSearchFurnishings";
export default function Page() {
    return (
        <div className="flex flex-col items-start gap-[var(--Spacing-xxl,40px)] h-dvh">
            <Navbar displayName="John Doe" />
            <FlightSearchFunishing />
            <Footer />
        </div>
    );
}
