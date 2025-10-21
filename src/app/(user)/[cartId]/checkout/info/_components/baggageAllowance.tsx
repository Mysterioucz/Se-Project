"use client";
import {
    useCheckout,
    type BaggageAllowance,
} from "@/src/contexts/CheckoutContext";
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

interface ServiceType {
    ServiceName: string;
    Price: number;
    Description: string;
}

export async function fetchAdditionalServices(
    flightNo: string,
    departureTime: Date,
    arrivalTime: Date,
) {
    // Placeholder for fetching additional services if needed
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/flights/lookup?flightNo=${flightNo}&departTime=${departureTime}&arrivalTime=${arrivalTime}`,
    );
    const res = await response.json();
    return res.data.flight.availableServices;
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

        // Only call updateBaggageAt for return flights
        if (type === "return" && updateBaggageAt) {
            updateBaggageAt(index, { departureBaggage: value.Description });
        }

        onChange?.(updated);
    };

    const isReturn = type === "return";
    const from = isReturn ? arrivalPlace : departurePlace;
    const to = isReturn ? departurePlace : arrivalPlace;

    return (
        <div className={`flex flex-col p-0 m-0 ${isReturn ? "mt-4" : ""}`}>
            <div className="flex p-[0.25rem] items-center gap-[0.5rem] self-stretch rounded-[0.25rem] bg-white">
                <div className="flex p-[0.25rem] justify-center items-center rounded-[0.25rem] bg-primary-300">
                    <div className="text-white font-sarabun text-[0.75rem] not-italic font-normal leading-[1.2]">
                        {isReturn ? "Return" : "Depart"}
                    </div>
                </div>

                <div className="text-primary-300 font-sarabun text-[0.875rem] not-italic font-normal leading-[1.2]">
                    {from} ⇒ {to}
                </div>
            </div>

            {passengers.map((name, index) => (
                <div
                    key={index}
                    className="flex items-start gap-[1rem] self-stretch"
                >
                    <div className="flex w-[9.688rem] flex-col justify-center items-center self-stretch py-[1rem]">
                        <div className="text-black font-sarabun text-[1rem] not-italic font-normal leading-[1.2]">
                            {name}
                        </div>
                    </div>

                    <div className="flex w-[9.688rem] flex-col justify-center items-center self-stretch py-[1rem]">
                        <div className="text-black text-center font-sarabun text-[0.875rem] not-italic font-normal leading-[1.2]">
                            1 piece, 7 kg including carry-on baggage
                        </div>
                    </div>

                    <div className="flex w-[9.688rem] flex-col justify-center items-center self-stretch py-[1rem]">
                        <div className="text-black text-center font-sarabun text-[0.875rem] not-italic font-normal leading-[1.2]">
                            1 piece, 7 kg including personal items
                        </div>
                    </div>

                    <div className="flex w-[9.625rem] flex-col justify-center items-center px-[0.5rem] gap-[0.5rem] py-[1rem]">
                        <div className="text-black text-center font-sarabun text-[0.875rem] not-italic font-normal leading-[1.2]">
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
                            onChange={(e) =>
                                handleOptionChange(
                                    index,
                                    e.target.value as ServiceType,
                                )
                            }
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
    passengers = [],
    departurePlace = "DeparturePlace",
    arrivalPlace = "ArrivalPlace",
    hasReturn = false,
    onChange,
    initialCheckedDepart,
    initialCheckedReturn,
}: BaggageAllowanceProps & {
    initialCheckedDepart?: number[];
    initialCheckedReturn?: number[];
}) {
    const Passengers = passengers.length ? passengers : ["Passenger 1"];
    const DeparturePlace = departurePlace?.trim() || "DeparturePlace";
    const ArrivalPlace = arrivalPlace?.trim() || "ArrivalPlace";
    const [baggageOptions, setBaggageOptions] = useState<Array<ServiceType>>(
        [],
    );
    const { checkoutData, cartData } = useCheckout();

    console.log("Current baggageOptions state:", baggageOptions);

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
        fetchServices().then((data: ServiceType[]) => {

            // Add safety check for data
            if (!data || !Array.isArray(data)) {
                console.warn("Invalid data received:", data);
                return;
            }

            const baggageData = data
                .map((item: any) => item.service) // Extract the nested service object
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
        Array.from({ length: passengers.length }, (_, i) =>
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
        <div className="flex w-[44.625rem] px-[1.5rem] py-[0.75rem] flex-col justify-center items-start rounded-[0.5rem] bg-primary-50">
            <div className="flex items-start gap-4 self-stretch">
                <div className="flex w-[9.625rem] h-[9.625rem] p-[0.625rem] flex-col justify-center items-center gap-[0.625rem]"></div>

                <div className="flex w-[9.625rem] h-[9.625rem] p-[0.625rem] flex-col justify-center items-center gap-[0.625rem]">
                    <div className="flex w-[3.563rem] h-[3.563rem] px-[0.371rem] py-[0.297rem] justify-center items-center shrink-0 aspect-square">
                        <Image
                            src="/additional-services/backpack.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="text-black font-sarabun text-[1rem] not-italic font-normal leading-[1.2]">
                        Personal Item
                    </div>
                </div>

                <div className="flex w-[9.625rem] h-[9.625rem] p-[0.625rem] flex-col justify-center items-center gap-[0.625rem]">
                    <div className="flex w-[3.563rem] h-[3.563rem] px-[0.371rem] py-[0.297rem] justify-center items-center shrink-0 aspect-square">
                        <Image
                            src="/additional-services/carryon-baggage.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="text-black font-sarabun text-[1rem] not-italic font-normal leading-[1.2]">
                        Carry-on Baggage
                    </div>
                </div>

                <div className="flex w-[9.625rem] h-[9.625rem] p-[0.625rem] flex-col justify-center items-center gap-[0.625rem]">
                    <div className="flex w-[3.563rem] h-[3.563rem] px-[0.371rem] py-[0.297rem] justify-center items-center shrink-0 aspect-square">
                        <Image
                            src="/additional-services/checked-baggage.svg"
                            alt="Logo"
                            width={57}
                            height={57}
                        />
                    </div>
                    <div className="text-black font-sarabun text-[1rem] not-italic font-normal leading-[1.2]">
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

// How to use:
// "use client";

// import BaggageAllowance from "@/src/components/additionalServices/baggageAllowance";

// export default function Page() {
//     const passengers = ["John Doe", "Jane Smith", "Alice Lee"];
//     const initialCheckedDepart = [15, 20, 0]; // kg per passenger
//     const initialCheckedReturn = [0, 10, 25];

//     const handleBaggageChange = (selections: { depart: string[]; return?: string[] }) => {
//         console.log("Depart selections:", selections.depart);
//         if (selections.return) console.log("Return selections:", selections.return);
//     };

//     return (
//         <div className="p-8">
//             <BaggageAllowance
//                 passengers={passengers}
//                 departurePlace="Bangkok"
//                 arrivalPlace="Chiang Mai"
//                 hasReturn={true}
//                 initialCheckedDepart={initialCheckedDepart}
//                 initialCheckedReturn={initialCheckedReturn}
//                 onChange={handleBaggageChange}
//             />
//         </div>
//     );
// }
