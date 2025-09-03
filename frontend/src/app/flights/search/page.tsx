import Flight_Search_Bar from "@/components/flight_search_bar";
import Flight_Seach_Form from "@/components/flight_search_bar";
import Flight_Search_Sort_Tab from "@/components/flight_search_sort_tab";

export default function Page() {
    return (
        <main>
            <div className="flex flex-col">
                {/* <Flight_Search_Bar /> */}
                <Flight_Search_Sort_Tab />
            </div>
        </main>
    );
}