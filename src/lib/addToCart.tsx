import { getServerSession } from "next-auth";
import { MappedFlightData } from "../app/flights/search/helper";
import authOptions from "@/auth.config";
import { redirect } from "next/navigation";
import { getSession, useSession } from "next-auth/react";

export default async function addToCart(selectedFlights: MappedFlightData[], UserAccountID:string) {
    let response;
    console.log("Selected Flights:", selectedFlights);
    if (selectedFlights.length === 1) {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart/${UserAccountID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                UserAccountID: UserAccountID,
                FlightType: selectedFlights[0].flightType,
                ClassType: selectedFlights[0].classType,
                Adults: selectedFlights[0].passengers.adult,
                Childrens: selectedFlights[0].passengers.children,
                Infants: selectedFlights[0].passengers.infants,
                DepartFlightNo: selectedFlights[0].flightNo,
                DepartFlightDepartTime: selectedFlights[0].airlineTimeStamp.depart.date,
                DepartFlightArrivalTime: selectedFlights[0].airlineTimeStamp.arrive.date,
                ReturnFlightNo: null,
                ReturnFlightDepartTime: null,
                ReturnFlightArrivalTime: null,
                Price: (selectedFlights[0].passengers.adult + selectedFlights[0].passengers.children + selectedFlights[0].passengers.infants) * selectedFlights[0].priceCabinClass.price,
            }),
        });
    } else {
        response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/cart/${UserAccountID}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                UserAccountID: UserAccountID,
                FlightType: selectedFlights[0].flightType,
                ClassType: selectedFlights[0].classType,
                Adults: selectedFlights[0].passengers.adult,
                Childrens: selectedFlights[0].passengers.children,
                Infants: selectedFlights[0].passengers.infants,
                DepartFlightNo: selectedFlights[0].flightNo,
                DepartFlightDepartTime: selectedFlights[0].airlineTimeStamp.depart.date,
                DepartFlightArrivalTime: selectedFlights[0].airlineTimeStamp.arrive.date,
                ReturnFlightNo: selectedFlights[1].flightNo,
                ReturnFlightDepartTime: selectedFlights[1].airlineTimeStamp.depart.date,
                ReturnFlightArrivalTime: selectedFlights[1].airlineTimeStamp.arrive.date,
                Price: (selectedFlights[0].passengers.adult + selectedFlights[0].passengers.children + selectedFlights[0].passengers.infants) * selectedFlights[0].priceCabinClass.price
                + (selectedFlights[1].passengers.adult + selectedFlights[1].passengers.children + selectedFlights[1].passengers.infants) * selectedFlights[1].priceCabinClass.price,
            }),
        });
    }
    
    
    if (! response.ok) {
        throw new Error(`Failed to fetch user's cart`);
    }

    return await response.json();
}