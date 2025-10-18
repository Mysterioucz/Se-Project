"use client";
import SelectComponent from "@components/select";
import { MenuItem } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

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
    onChange?: (baggageSelections: string[]) => void;
}

function DepartureAdditionalService({
    passengers,
    departurePlace,
    arrivalPlace,
    initialCheckedBaggage,
    onChange,
}: ServiceProps) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(
        Array(passengers.length).fill("Not Included"),
    );

    const handleOptionChange = (index: number, value: string) => {
        const updated = [...selectedOptions];
        updated[index] = value;
        setSelectedOptions(updated);
        onChange?.(updated);
    };

    return (
        <div className="flex flex-col p-0 m-0">
            <div className="flex p-[0.25rem] items-center gap-[0.5rem] self-stretch rounded-[0.25rem] bg-white">
                <div className="flex p-[0.25rem] justify-center items-center rounded-[0.25rem] bg-primary-300">
                    <div className="text-white font-sarabun text-[0.75rem] not-italic font-normal leading-[1.2]">
                        Depart
                    </div>
                </div>

                <div className="text-primary-300 font-sarabun text-[0.875rem] not-italic font-normal leading-[1.2]">
                    {departurePlace} ⇒ {arrivalPlace}
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

                    <div className="flex w-[9.625rem] flex-col justify-center items-center py-0 px-[0.5rem] gap-[0.5rem] py-[1rem]">
                        <div className="text-black text-center font-sarabun text-[0.875rem] not-italic font-normal leading-[1.2]">
                            {(initialCheckedBaggage[index] ?? 0) > 0
                                ? `1 x ${initialCheckedBaggage[index]} kg`
                                : "Not Included"}
                        </div>

                        <SelectComponent
                            labelId={`baggage-select-label-${index}`}
                            id={`baggage-select-${index}`}
                            value={selectedOptions[index]}
                            placeholder="Add Baggage"
                            maxChildrenHeight="max-h-[16rem]"
                            width="w-[10rem]"
                            height="h-[2.5rem]"
                            onChange={(e) =>
                                handleOptionChange(
                                    index,
                                    e.target.value as string,
                                )
                            }
                        >
                            <MenuItem value="Not Included">
                                Not Included
                            </MenuItem>
                            <MenuItem value="+5kg, ฿240.00">
                                +5 kg - ฿240.00
                            </MenuItem>
                            <MenuItem value="+10kg, ฿325.00">
                                +10 kg - ฿325.00
                            </MenuItem>
                            <MenuItem value="+15kg, ฿450.00">
                                +15 kg - ฿450.00
                            </MenuItem>
                            <MenuItem value="+20kg, ฿490.00">
                                +20 kg - ฿490.00
                            </MenuItem>
                            <MenuItem value="+25kg, ฿595.00">
                                +25 kg - ฿595.00
                            </MenuItem>
                        </SelectComponent>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ReturnAdditionalService({
    passengers,
    departurePlace,
    arrivalPlace,
    initialCheckedBaggage,
    onChange,
}: ServiceProps) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(
        Array(passengers.length).fill("Not Included"),
    );

    const handleOptionChange = (index: number, value: string) => {
        const updated = [...selectedOptions];
        updated[index] = value;
        setSelectedOptions(updated);
        onChange?.(updated);
    };

    return (
        <div className="flex flex-col p-0 m-0 mt-4">
            <div className="flex p-[0.25rem] items-center gap-[0.5rem] self-stretch rounded-[0.25rem] bg-white">
                <div className="flex p-[0.25rem] justify-center items-center rounded-[0.25rem] bg-primary-300">
                    <div className="text-white font-sarabun text-[0.75rem] not-italic font-normal leading-[1.2]">
                        Return
                    </div>
                </div>
                <div className="text-primary-300 font-sarabun text-[0.875rem] not-italic font-normal leading-[1.2]">
                    {arrivalPlace} ⇒ {departurePlace}
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

                    <div className="flex w-[9.625rem] flex-col justify-center items-center py-0 px-[0.5rem] gap-[0.5rem] py-[1rem]">
                        <div className="text-black text-center font-sarabun text-[0.875rem] not-italic font-normal leading-[1.2]">
                            {(initialCheckedBaggage[index] ?? 0) > 0
                                ? `1 x ${initialCheckedBaggage[index]} kg`
                                : "Not Included"}
                        </div>

                        <SelectComponent
                            labelId={`return-baggage-select-label-${index}`}
                            id={`return-baggage-select-${index}`}
                            value={selectedOptions[index]}
                            placeholder="Add Baggage"
                            maxChildrenHeight="max-h-[16rem]"
                            width="w-[10rem]"
                            height="h-[2.5rem]"
                            onChange={(e) =>
                                handleOptionChange(
                                    index,
                                    e.target.value as string,
                                )
                            }
                        >
                            <MenuItem value="Not Included">
                                Not Included
                            </MenuItem>
                            <MenuItem value="+5kg, ฿240.00">
                                +5 kg - ฿240.00
                            </MenuItem>
                            <MenuItem value="+10kg, ฿325.00">
                                +10 kg - ฿325.00
                            </MenuItem>
                            <MenuItem value="+15kg, ฿450.00">
                                +15 kg - ฿450.00
                            </MenuItem>
                            <MenuItem value="+20kg, ฿490.00">
                                +20 kg - ฿490.00
                            </MenuItem>
                            <MenuItem value="+25kg, ฿595.00">
                                +25 kg - ฿595.00
                            </MenuItem>
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

    const [departSelections, setDepartSelections] = useState<string[]>(
        Array(passengers.length).fill("Not Included"),
    );
    const [returnSelections, setReturnSelections] = useState<string[]>(
        Array(passengers.length).fill("Not Included"),
    );

    const handleDepartChange = (selections: string[]) => {
        setDepartSelections(selections);
        onChange?.(
            hasReturn
                ? { depart: selections, return: returnSelections }
                : { depart: selections },
        );
    };

    const handleReturnChange = (selections: string[]) => {
        setReturnSelections(selections);
        onChange?.({ depart: departSelections, return: selections });
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

            <DepartureAdditionalService
                passengers={Passengers}
                departurePlace={DeparturePlace}
                arrivalPlace={ArrivalPlace}
                initialCheckedBaggage={initialDepart}
                onChange={handleDepartChange}
            />

            {hasReturn && (
                <ReturnAdditionalService
                    passengers={Passengers}
                    departurePlace={DeparturePlace}
                    arrivalPlace={ArrivalPlace}
                    initialCheckedBaggage={initialReturn}
                    onChange={handleReturnChange}
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
