"use client";
import {
    PassengerData,
    ServiceType,
    type BaggageAllowance,
} from "@/src/contexts/checkout/types";
import { useCheckout } from "@/src/contexts/CheckoutContext";
import SelectComponent from "@components/select";
import { MenuItem } from "@mui/material";
import Image from "next/image";
import { useEffect, useState } from "react";

interface BaggageAllowanceProps {
    passengers?: string[];
    departurePlace?: string;
    arrivalPlace?: string;
    hasReturn?: boolean;
    onChange?: (baggageSelections: {
        depart: string[];
        return?: string[];
    }) => void;
    passengersData?: PassengerData[];
    initialCheckedDepart?: number[];
    initialCheckedReturn?: number[];
}

interface ServiceProps {
    passengers: string[];
    departurePlace: string;
    arrivalPlace: string;
    initialCheckedBaggage: number[];
    onChange?: (baggageSelections: ServiceType[]) => void;
    updateBaggageAt?: (
        index: number,
        baggagePatch: Partial<BaggageAllowance>,
    ) => void;
    baggageOptions: Array<ServiceType>;
}

export type fetchedServiceType = {
    service: ServiceType;
};

export async function fetchAdditionalServices(
    flightNo: string,
    departureTime: Date,
    arrivalTime: Date,
): Promise<fetchedServiceType[]> {
    // Placeholder for fetching additional services if needed
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flights/lookup?flightNo=${flightNo}&departTime=${departureTime}&arrivalTime=${arrivalTime}`,
    );
    const res = await response.json();
    return res.data.flight.availableServices as fetchedServiceType[];
}

function AdditionalServiceSection({
    passengers,
    departurePlace,
    arrivalPlace,
    initialCheckedBaggage,
    onChange,
    updateBaggageAt,
    baggageOptions,
    type = "depart",
}: ServiceProps & { type?: "depart" | "return" }) {
    const [selectedOptions, setSelectedOptions] = useState<ServiceType[]>([]);

    const handleOptionChange = (index: number, value: ServiceType) => {
        const updated = [...selectedOptions];
        updated[index] = value;
        setSelectedOptions(updated);

        if (updateBaggageAt) {
            if (type === "return") {
                updateBaggageAt(index, { returnBaggage: value });
            } else if (type === "depart") {
                updateBaggageAt(index, { departureBaggage: value });
            }
        }

        onChange?.(updated);
    };

    const isReturn = type === "return";
    const from = isReturn ? arrivalPlace : departurePlace;
    const to = isReturn ? departurePlace : arrivalPlace;

    return (
        <div className={`m-0 flex flex-col p-0 ${isReturn ? "mt-4" : ""}`}>
            <div className="flex items-center gap-[0.5rem] self-stretch rounded-[0.25rem] bg-white p-[0.25rem]">
                <div className="bg-primary-300 flex items-center justify-center rounded-[0.25rem] p-[0.25rem]">
                    <div className="font-sarabun text-[0.75rem] leading-[1.2] font-normal text-white not-italic">
                        {isReturn ? "Return" : "Depart"}
                    </div>
                </div>

                <div className="text-primary-300 font-sarabun text-[0.875rem] leading-[1.2] font-normal not-italic">
                    {from} ⇒ {to}
                </div>
            </div>

            {passengers.map((name, index) => (
                <div
                    key={index}
                    className="flex items-start gap-[1rem] self-stretch"
                >
                    <div className="flex w-[9.688rem] flex-col items-center justify-center self-stretch py-[1rem]">
                        <div className="font-sarabun text-[1rem] leading-[1.2] font-normal text-nowrap text-black not-italic">
                            {name}
                        </div>
                    </div>

                    <div className="flex w-[9.688rem] flex-col items-center justify-center self-stretch py-[1rem]">
                        <div className="font-sarabun text-center text-[0.875rem] leading-[1.2] font-normal text-black not-italic">
                            1 piece, 7 kg including carry-on baggage
                        </div>
                    </div>

                    <div className="flex w-[9.688rem] flex-col items-center justify-center self-stretch py-[1rem]">
                        <div className="font-sarabun text-center text-[0.875rem] leading-[1.2] font-normal text-black not-italic">
                            1 piece, 7 kg including personal items
                        </div>
                    </div>

                    <div className="flex w-[9.625rem] flex-col items-center justify-center gap-[0.5rem] px-[0.5rem] py-[1rem]">
                        <div className="font-sarabun text-center text-[0.875rem] leading-[1.2] font-normal text-black not-italic">
                            {(initialCheckedBaggage[index] ?? 0) > 0
                                ? `1 x ${initialCheckedBaggage[index]} kg`
                                : "Not Included"}
                        </div>

                        <SelectComponent
                            labelId={`${type}-baggage-select-label-${index}`}
                            id={`${type}-baggage-select-${index}`}
                            value={selectedOptions[index]?.Description || ""}
                            placeholder="Add Baggage"
                            maxChildrenHeight="max-h-[16rem]"
                            width="w-[10rem]"
                            height="h-[2.5rem]"
                            onChange={(e) => {
                                const selectedDescription = e.target
                                    .value as string;
                                const selectedOption = baggageOptions.find(
                                    (option) =>
                                        option.Description ===
                                        selectedDescription,
                                );
                                if (selectedOption) {
                                    handleOptionChange(index, selectedOption);
                                }
                            }}
                        >
                            {baggageOptions.map((option) => (
                                <MenuItem
                                    key={option.Description}
                                    value={option.Description}
                                >
                                    {option.Description + " - $" + option.Price}
                                </MenuItem>
                            ))}
                        </SelectComponent>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function BaggageAllowance({
    departurePlace = "DeparturePlace",
    arrivalPlace = "ArrivalPlace",
    hasReturn = false,
    onChange,
    passengersData,
    initialCheckedDepart,
    initialCheckedReturn,
}: BaggageAllowanceProps & {
    initialCheckedDepart?: number[];
    initialCheckedReturn?: number[];
}) {
    const [Passengers, setPassengers] = useState<string[]>([]);
    const DeparturePlace = departurePlace?.trim() || "DeparturePlace";
    const ArrivalPlace = arrivalPlace?.trim() || "ArrivalPlace";
    const [baggageOptions, setBaggageOptions] = useState<Array<ServiceType>>(
        [],
    );
    const { cartData } = useCheckout();

    // Sync passengers when passengersData prop changes
    useEffect(() => {
        const passengerNames =
            passengersData?.map(
                (p) => p.givenName.trim() + " " + p.lastName.trim(),
            ) || [];
        setPassengers(passengerNames);
    }, [passengersData]);

    // Fetch baggage services
    useEffect(() => {
        const fetchServices = async () => {
            try {
                return await fetchAdditionalServices(
                    cartData.Depart.FlightNo,
                    cartData.Depart.DepartTime,
                    cartData.Depart.ArrivalTime,
                );
            } catch (error) {
                console.error("Error fetching additional services:", error);
                return [];
            }
        };

        fetchServices().then((data: fetchedServiceType[]) => {
            // Add safety check for data
            if (!data || !Array.isArray(data)) {
                console.warn("Invalid data received:", data);
                return;
            }

            const baggageData = data
                .map((item) => item.service) // Extract the nested service object
                .filter((service: ServiceType) => {
                    // Add safety check for service and ServiceName
                    if (!service || !service.ServiceName) {
                        return false;
                    }

                    const matches =
                        service.ServiceName.toLowerCase().includes("baggage");
                    return matches;
                });

            if (baggageData.length > 0) {
                setBaggageOptions(baggageData);
            } else {
                console.warn("No baggage services found after filtering!");
            }
        });
    }, [
        cartData.Depart.FlightNo,
        cartData.Depart.DepartTime,
        cartData.Depart.ArrivalTime,
    ]);
    const initialCheckedDepartMock = [15, 20, 0];
    const initialCheckedReturnMock = [0, 10, 25];

    const makeInitial = (arr?: number[], fallback?: number[]) =>
        Array.from({ length: Passengers.length }, (_, i) =>
            arr && arr[i] != null ? arr[i] : fallback ? (fallback[i] ?? 0) : 0,
        );

    const initialDepart = makeInitial(
        initialCheckedDepart,
        initialCheckedDepartMock,
    );
    const initialReturn = makeInitial(
        initialCheckedReturn,
        initialCheckedReturnMock,
    );

    const [departSelections, setDepartSelections] = useState<ServiceType[]>([]);
    const [returnSelections, setReturnSelections] = useState<ServiceType[]>([]);
    const { updateBaggageAt } = useCheckout();

    const handleDepartChange = (selections: ServiceType[]) => {
        setDepartSelections(selections);
        const selectionStrings = selections.map(
            (s) => s?.Description || "Not Included",
        );
        onChange?.(
            hasReturn
                ? {
                      depart: selectionStrings,
                      return: returnSelections.map(
                          (s) => s?.Description || "Not Included",
                      ),
                  }
                : { depart: selectionStrings },
        );
    };

    const handleReturnChange = (selections: ServiceType[]) => {
        setReturnSelections(selections);
        const selectionStrings = selections.map(
            (s) => s?.Description || "Not Included",
        );
        onChange?.({
            depart: departSelections.map(
                (s) => s?.Description || "Not Included",
            ),
            return: selectionStrings,
        });
    };

    return (
        <div className="bg-primary-50 flex w-[44.625rem] flex-col items-start justify-center rounded-[0.5rem] px-[1.5rem] py-[0.75rem]">
            <div className="flex items-start gap-4 self-stretch">
                <div className="flex h-[9.625rem] w-[9.625rem] flex-col items-center justify-center gap-[0.625rem] p-[0.625rem]"></div>

                <div className="flex h-[9.625rem] w-[9.625rem] flex-col items-center justify-center gap-[0.625rem] p-[0.625rem]">
                    <div className="flex aspect-square h-[3.563rem] w-[3.563rem] shrink-0 items-center justify-center px-[0.371rem] py-[0.297rem]">
                        <Image
                            src="/additional-services/backpack.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="font-sarabun text-[1rem] leading-[1.2] font-normal text-black not-italic">
                        Personal Item
                    </div>
                </div>

                <div className="flex h-[9.625rem] w-[9.625rem] flex-col items-center justify-center gap-[0.625rem] p-[0.625rem]">
                    <div className="flex aspect-square h-[3.563rem] w-[3.563rem] shrink-0 items-center justify-center px-[0.371rem] py-[0.297rem]">
                        <Image
                            src="/additional-services/carryon-baggage.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="font-sarabun text-[1rem] leading-[1.2] font-normal text-black not-italic">
                        Carry-on Baggage
                    </div>
                </div>

                <div className="flex h-[9.625rem] w-[9.625rem] flex-col items-center justify-center gap-[0.625rem] p-[0.625rem]">
                    <div className="flex aspect-square h-[3.563rem] w-[3.563rem] shrink-0 items-center justify-center px-[0.371rem] py-[0.297rem]">
                        <Image
                            src="/additional-services/checked-baggage.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="font-sarabun text-[1rem] leading-[1.2] font-normal text-black not-italic">
                        Checked Baggage
                    </div>
                </div>
            </div>

            <AdditionalServiceSection
                passengers={Passengers}
                departurePlace={DeparturePlace}
                arrivalPlace={ArrivalPlace}
                initialCheckedBaggage={initialDepart}
                onChange={handleDepartChange}
                updateBaggageAt={updateBaggageAt}
                baggageOptions={baggageOptions}
                type="depart"
            />

            {hasReturn && (
                <AdditionalServiceSection
                    passengers={Passengers}
                    departurePlace={DeparturePlace}
                    arrivalPlace={ArrivalPlace}
                    initialCheckedBaggage={initialReturn}
                    onChange={handleReturnChange}
                    updateBaggageAt={updateBaggageAt}
                    baggageOptions={baggageOptions}
                    type="return"
                />
            )}
        </div>
    );
}
