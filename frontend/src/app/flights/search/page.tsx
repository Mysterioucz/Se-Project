import Flight_Search_Bar from "@/components/flight_search_bar";
import Flight_Search_Sort_Tab from "@/components/flight_search_sort_tab";
import Flight_Search_Filter_Tab from "@/components/flight_search_filter_tab";
import ArrivalTimeSlider from "@/components/time_slider";

export default function Page() {
    return (
        <main>
            <div>
                <Flight_Search_Bar />
                <Flight_Search_Sort_Tab />
                <Flight_Search_Filter_Tab />
            </div>
        </main>
    );
}