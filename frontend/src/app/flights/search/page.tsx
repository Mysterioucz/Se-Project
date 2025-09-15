"use client";
import FlightFilterTab from "@/src/components/flight_search/filter";
import FlightSearchBar, {
    PassengerCount,
    SelectedValues,
} from "@/src/components/flight_search/search";
import FlightSortTab from "@/src/components/flight_search/sort";
import FlightCard from "@/src/components/flightCard/flight_card";
import { MagnifyIcon } from "@/src/components/icons/module";
import { useEffect, useState } from "react";
import {
    FlightData,
    INIT_ARRIVAL_TIME,
    INIT_DEPARTURE_TIME,
    INIT_PASSENGER_COUNT,
    INIT_SELECTED_AIRLINES,
    INIT_SELECTED_END_DATE,
    INIT_SELECTED_START_DATE,
    INIT_SELECTED_VALUES,
    INIT_SORT,
    MappedFlightData,
} from "./helper";
import FlightSearchFunishing from "@/src/components/flight_search/FlightSearchFurnishings";
import Navbar from "@/src/components/Navbar";
import { CircularProgress } from "@mui/material";
import Footer from "@/src/components/footer/footer";

export default function Page() {
    //TODO: Need to refactor the whole page to be stateless and use searchParams instead
    const [selectedValues, setSelectedValues] =
        useState<SelectedValues>(INIT_SELECTED_VALUES);
    const [passengerCount, setPassengerCount] =
        useState<PassengerCount>(INIT_PASSENGER_COUNT);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
        INIT_SELECTED_START_DATE
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
        INIT_SELECTED_END_DATE
    );

    const [selectedAirlines, setSelectedAirlines] = useState<string[]>(
        INIT_SELECTED_AIRLINES
    );
    const [departureTime, setDepartureTime] = useState(INIT_DEPARTURE_TIME);
    const [arrivalTime, setArrivalTime] = useState(INIT_ARRIVAL_TIME);

    const [sort, setSort] = useState<string>(INIT_SORT);

    const [convertedFlightData, setConvertedFlightData] = useState<
        MappedFlightData[]
    >([]); // State for storing converted flight data

    const [pageState, setPageState] = useState<
        "initial" | "loading" | "loaded" | "empty"
    >("initial");

    const [flightState, setFlightState] = useState<"depart" | "return">(
        "depart"
    );

    const fetchData = async () => {
        setPageState("loading");
        const totalPassenger =
            passengerCount.adult +
            passengerCount.children +
            passengerCount.infants;
        try {
            const url = new URL(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flights`
            ); // Base URL for API
            const params = new URLSearchParams();
            // Search
            params.append(`flightType`, selectedValues.flight);
            params.append(`classType`, selectedValues.class);
            if (selectedValues.leave != `Leaving from?`)
                params.append(`departureCity`, selectedValues.leave);
            if (selectedValues.go != `Going to?`)
                params.append(`arrivalCity`, selectedValues.go);
            if (selectedStartDate) {
                const departDate = selectedStartDate
                    .toISOString()
                    .split("T")[0]; // Convert to 'YYYY-MM-DD'
                params.append("departDate", departDate);
            }

            if (selectedEndDate) {
                const returnDate = selectedEndDate.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'
                params.append("returnDate", returnDate);
            }
            params.append(`numberOfPassenger`, totalPassenger.toString());
            // Filter
            if (selectedAirlines.length > 0)
                params.append("airlines", selectedAirlines.join(","));
            params.append(`departureTimeRange`, departureTime.join(`,`));
            params.append(`arrivalTimeRange`, arrivalTime.join(`,`));
            // Sort
            if (sort !== "") params.append(`sortBy`, sort);

            const flightData = await fetch(
                url.toString() + `?${params.toString()}`,
                {
                    method: "GET",
                }
            ).then((res) => res.json());

            // Transform data to match FlightCard
            const convertedData = flightData.data.map((flight: FlightData) => ({
                airlineTimeStamp: {
                    airlineName: flight.airlineName,
                    depart: {
                        time: flight.departHours,
                        airport: flight.departureAirportID,
                        city: flight.departCity,
                    },
                    arrive: {
                        time: flight.arrivalHours,
                        airport: flight.arrivalAirportID,
                        city: flight.arrivalCity,
                    },
                    duration: flight.duration,
                    stops: flight.transitAmount,
                },
                priceCabinClass: {
                    price: flight.price,
                    currency: "USD",
                    cabinClass: flight.cabinClass,
                },
            }));
            if (convertedData.length === 0) {
                setPageState("empty");
            } else {
                setPageState("loaded");
            }
            setConvertedFlightData(convertedData);
        } catch (err) {
            // console.log(`Failed to fetch flights' data`, err);
            alert("Failed to fetch flight data. Please try again later.");
            setPageState("empty");
        }
    };

    useEffect(() => {
        if (pageState !== "initial") {
            fetchData();
        }
    }, [sort]);

    const [HeaderText, setHeaderText] = useState("Select flight informations");
    useEffect(() => {
        if (pageState === "initial") {
            setHeaderText("Select flight informations");
        } else if (selectedValues.flight === "One Way") {
            setHeaderText("Departing Flights");
            setFlightState("depart");
        } else if (selectedValues.flight === "Round Trip") {
            if (flightState === "depart") {
                setHeaderText("Departing Flights");
            } else if (flightState === "return") {
                setHeaderText("Returning Flights");
            }
        }
    }, [pageState, flightState]);

    function handleSelectFlightCard(id: string) {
        //TODO: handle flight selection state
        if (selectedValues.flight === "One Way") {
            alert(`You have selected your departing flight.`);
            return;
        }
        if (flightState === "depart") {
            setFlightState("return");
            alert(
                "Departure flight selected. Please select your returning flight."
            );
        }
    }
    function renderContent() {
        if (pageState == "initial") {
            return <FlightSearchFunishing />;
        }
        return (
            <>
                <FlightFilterTab
                    selectedAirlines={selectedAirlines}
                    setSelectedAirlines={setSelectedAirlines}
                    departureTime={departureTime}
                    setDepartureTime={setDepartureTime}
                    arrivalTime={arrivalTime}
                    setArrivalTime={setArrivalTime}
                    handleApply={fetchData}
                />
                <div className="flex flex-col gap-4 overflow-y-auto w-full items-center">
                    {renderSearchContent()}
                </div>
                <FlightSortTab sort={sort} setSort={setSort} />
            </>
        );
    }

    function renderSearchContent() {
        if (pageState === "initial") {
            return <FlightSearchFunishing />;
        } else if (pageState === "loading") {
            return (
                <div className="flex flex-col items-center h-full text-primary-300 justify-center w-full py-4">
                    <CircularProgress />
                </div>
            );
        } else if (pageState === "empty") {
            return (
                <div className="flex flex-col items-center h-full text-primary-300 justify-center w-full py-4">
                    <MagnifyIcon />
                    <h2>Flight Not Found</h2>
                </div>
            );
        } else if (pageState === "loaded") {
            return convertedFlightData.map(
                (flight: MappedFlightData, index: number) => (
                    <FlightCard
                        key={index}
                        id={index.toString()}
                        airlineTimeStamp={flight.airlineTimeStamp}
                        priceCabinClass={flight.priceCabinClass}
                        onClick={() => handleSelectFlightCard(index.toString())}
                    />
                )
            );
        }
    }

    return (
        <div
            className={`flex flex-col gap-10 w-full min-h-screen items-center ${
                pageState === "initial" ? "" : "bg-primary-50"
            } justify-top`}
        >
            <Navbar />
            <div className="flex flex-col w-full h-full px-[5rem]">
                <div className="flex flex-col gap-4 w-full">
                    <FlightSearchBar
                        headerText={HeaderText}
                        selectedValues={selectedValues}
                        setSelectedValues={setSelectedValues}
                        passengerCount={passengerCount}
                        setPassengerCount={setPassengerCount}
                        selectedStartDate={selectedStartDate}
                        setSelectedStartDate={setSelectedStartDate}
                        selectedEndDate={selectedEndDate}
                        setSelectedEndDate={setSelectedEndDate}
                        onSearch={fetchData}
                    />

                    <div className="flex w-full gap-4">{renderContent()}</div>
                </div>
            </div>
            {pageState === "initial" ? <Footer /> : null}
        </div>
    );
}
