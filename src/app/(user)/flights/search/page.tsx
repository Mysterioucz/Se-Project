"use client";
import FlightFilterTab from "@/src/app/(user)/flights/search/_components/filter";
import FlightSearchFunishing from "@/src/app/(user)/flights/search/_components/FlightSearchFurnishings";
import FlightSearchBar, {
    PassengerCount,
    SelectedValues,
} from "@/src/app/(user)/flights/search/_components/search";
import FlightSortTab from "@/src/app/(user)/flights/search/_components/sort";
import FlightCard from "@/src/components/flightCard/flight_card";
import Footer from "@/src/components/footer/footer";
import { MagnifyIcon } from "@/src/components/icons/module";
import Navbar from "@/src/components/Navbar";
import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import SummaryModal from "./_components/SummaryModal";
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

export default function Page() {
    //TODO: Need to refactor the whole page to be stateless and use searchParams instead
    const [selectedFlightBuffer, setSelectedFlightBuffer] = useState<
        MappedFlightData[]
    >([]);
    const [selectedDateBuffer, setSelectedDateBuffer] = useState<
        (Date | null)[]
    >([]);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
    const [swap, setSwap] = useState<boolean>(false);

    const [selectedValues, setSelectedValues] =
        useState<SelectedValues>(INIT_SELECTED_VALUES);
    const [passengerCount, setPassengerCount] =
        useState<PassengerCount>(INIT_PASSENGER_COUNT);
    const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(
        INIT_SELECTED_START_DATE,
    );
    const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(
        INIT_SELECTED_END_DATE,
    );

    const [selectedAirlines, setSelectedAirlines] = useState<string[]>(
        INIT_SELECTED_AIRLINES,
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
        "depart",
    );

    const fetchData = async () => {
        setPageState("loading");
        const totalPassenger =
            passengerCount.adult +
            passengerCount.children +
            passengerCount.infants;
        try {
            const url = new URL(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flights`,
            ); // Base URL for API
            const params = new URLSearchParams();
            // Search
            params.append(`flightType`, "One Way");
            params.append(`classType`, selectedValues.class);
            if (selectedValues.leave != `Leaving from?`)
                if (!swap) params.append(`departureCity`, selectedValues.leave);
                else params.append(`departureCity`, selectedValues.go);
            if (selectedValues.go != `Going to?`)
                if (!swap) params.append(`arrivalCity`, selectedValues.go);
                else params.append(`arrivalCity`, selectedValues.leave);
            if (selectedStartDate) {
                if (swap && selectedEndDate) {
                    const departDate = selectedEndDate
                        .toISOString()
                        .split("T")[0]; // Convert to 'YYYY-MM-DD'
                    params.append("departDate", departDate);
                } else {
                    const departDate = selectedStartDate
                        .toISOString()
                        .split("T")[0]; // Convert to 'YYYY-MM-DD'
                    params.append("departDate", departDate);
                }
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
                },
            ).then((res) => res.json());

            // Transform data to match FlightCard
            const convertedData = flightData.data.map((flight: FlightData) => ({
                airlineTimeStamp: {
                    airlineName: flight.airlineName,
                    depart: {
                        date: flight.departureTime,
                        time: flight.departHours,
                        airport: flight.departureAirportID,
                        city: flight.departCity,
                    },
                    arrive: {
                        date: flight.arrivalTime,
                        time: flight.arrivalHours,
                        airport: flight.arrivalAirportID,
                        city: flight.arrivalCity,
                    },
                    duration: flight.duration,
                    stops: flight.transitAmount,
                },
                flightNo: flight.flightNo,
                flightType: selectedValues.flight,
                classType: selectedValues.class,
                passengers: passengerCount,
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
            alert("Failed to fetch flight data. Please try again later.");
            setPageState("empty");
        }
    };

    useEffect(() => {
        if (pageState !== "initial") {
            fetchData();
        }
    }, [sort]);

    useEffect(() => {
        if (selectedValues.flight !== "One Way") {
            fetchData();
        }
    }, [swap]);

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

    function handleSelectFlightCard(flight: MappedFlightData) {
        if (selectedValues.flight === "One Way") {
            selectedFlightBuffer.push(flight);
            setSelectedFlightBuffer(selectedFlightBuffer);
            selectedDateBuffer.push(selectedStartDate);
            setSelectedDateBuffer(selectedDateBuffer);
            setSummaryModalOpen(true);
            return;
        }

        if (
            selectedValues.flight === "Round Trip" &&
            selectedFlightBuffer.length == 0
        ) {
            setSwap(true);
            selectedFlightBuffer.push(flight);
            setSelectedFlightBuffer(selectedFlightBuffer);
            selectedDateBuffer.push(selectedStartDate);
            setSelectedDateBuffer(selectedDateBuffer);
            setFlightState("return");
        } else {
            selectedFlightBuffer.push(flight);
            setSelectedFlightBuffer(selectedFlightBuffer);
            selectedDateBuffer.push(selectedStartDate);
            setSelectedDateBuffer(selectedDateBuffer);
            setSummaryModalOpen(true);
            return;
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
                <div className="flex w-full flex-col items-center gap-4 overflow-y-auto">
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
                <div className="text-primary-300 flex h-full w-full flex-col items-center justify-center py-4">
                    <CircularProgress />
                </div>
            );
        } else if (pageState === "empty") {
            return (
                <div className="text-primary-300 flex h-full w-full flex-col items-center justify-center py-4">
                    <div className="h-20 w-20">
                        <MagnifyIcon />
                    </div>
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
                        onClick={() => handleSelectFlightCard(flight)}
                    />
                ),
            );
        }
    }

    const resetState = () => {
        setSelectedFlightBuffer([]);
        setSelectedDateBuffer([]);
        setSummaryModalOpen(false);
        setFlightState("depart");
        setSwap(false);
    };

    return (
        <div
            className={`flex min-h-screen w-full flex-col items-center gap-10 ${
                pageState === "initial" ? "" : "bg-primary-50"
            } justify-top`}
        >
            <Navbar />
            <div className="flex h-full w-full flex-col px-[5rem]">
                <div className="flex w-full flex-col gap-4">
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
                        resetState={resetState}
                        onSearch={fetchData}
                    />

                    <div className="flex w-full gap-4">{renderContent()}</div>
                </div>
            </div>
            <div>
                <SummaryModal
                    isOpen={isSummaryModalOpen}
                    onClose={() => {
                        resetState();
                    }}
                    FlightType={selectedValues.flight}
                    ClassType={selectedValues.class}
                    selectedFlights={selectedFlightBuffer}
                    selectedDates={selectedDateBuffer}
                />
            </div>
            {pageState === "initial" ? <Footer /> : null}
        </div>
    );
}
