import { z } from "zod";
import { PaymentMethodSchema } from "../enums/Payment";

// Validation check
const TicketInputSchema = z.object({
    Price: z.number().positive(),
    ServiceFee: z.number().optional(),
    PassengerName: z.string(),
    PassengerLastName: z.string(),
    Gender: z.string(),
    DateOfBirth: z.string(), // ISOFormat like "2025-11-02T00:00:00Z"
    Nationality: z.string(),
    BaggageChecked: z.number().default(10),
    BaggageCabin: z.number().default(7),
    SeatNo: z.string(),
    AircraftRegNo: z.string(),
    FlightNo: z.string(),
    DepartTime: z.string(), // ISO
    ArrivalTime: z.string(), // ISO
});

const CreatePaymentSchema = z.object({
    Tickets: z.array(TicketInputSchema).min(1),
    totalAmount: z.number().positive(),
    method: PaymentMethodSchema,
    paymentEmail: z.email("valid email required"),

    paymentTelNo: z
        .string()
        .trim()
        .min(5, "tel too short")
        .max(20, "tel too long")
        .regex(/^[0-9+\-()\s]+$/, "tel format invalid"),

    bankName: z
        .string()
        .trim()
        .min(2, "bankName must be at least 2 characters")
        .optional()
        .transform((v) => (v === "" ? undefined : v)),

    Adults: z.number(),
    Childrens: z.number(),
    Infants: z.number(),
    FlightType: z.string(),
    ClassType: z.string(),
    DepartFlightNo: z.string(),
    DepartFlightDepartTime: z.string(), // ISO 
    DepartFlightArrivalTime: z.string(), // ISO
    ReturnFlightNo: z.string().optional(),
    ReturnFlightDepartTime: z.string().optional(), // ISO
    ReturnFlightArrivalTime: z.string().optional(),  // ISO
});

export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;

export async function createPayment(paymentData: CreatePaymentInput) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payments`, {
        method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(paymentData),
        });

        const data = await res.json();

        if (! res.ok) {
            throw new Error("Failed to complete transaction.");
        }

        return data;
    } catch (err) {
        console.log("Failed to complete transaction.");
    }
}

/*
Example of body: (Round Trip flight with 2 passengers)
{
    "Tickets": [
        {
            "Price": 35000,
            "ServiceFee": 2876,
            "PassengerName": "Faith",
            "PassengerLastName": "Archamongkol",
            "Gender": "Male",
            "DateOfBirth": "2010-12-25T04:00:00Z",
            "Nationality": "Thai",
            "BaggageChecked": 10,
            "BaggageCabin": 7,
            "SeatNo": "1A",
            "AircraftRegNo": "B-ZEB",
            "FlightNo": "AC137",
            "DepartTime": "2025-11-02T00:00:00Z",
            "ArrivalTime": "2025-11-02T05:00:00Z" 
        }, {
            "Price": 35000,
            "ServiceFee": 246,
            "PassengerName": "Parm",
            "PassengerLastName": "Archamongkol",
            "Gender": "Male",
            "DateOfBirth": "2010-12-25T04:00:00Z",
            "Nationality": "Cambodia",
            "BaggageChecked": 10,
            "BaggageCabin": 7,
            "SeatNo": "1B",
            "AircraftRegNo": "B-ZEB",
            "FlightNo": "AC137",
            "DepartTime": "2025-11-02T00:00:00Z",
            "ArrivalTime": "2025-11-02T05:00:00Z" 
        }, {
            "Price": 35000,
            "ServiceFee": 2876,
            "PassengerName": "Faith",
            "PassengerLastName": "Archamongkol",
            "Gender": "Male",
            "DateOfBirth": "2010-12-25T04:00:00Z",
            "Nationality": "Thai",
            "BaggageChecked": 10,
            "BaggageCabin": 7,
            "SeatNo": "20B",
            "AircraftRegNo": "NEOQ",
            "FlightNo": "SK141",
            "DepartTime": "2025-11-04T19:39:17Z",
            "ArrivalTime": "2025-11-04T21:00:00Z" 
        }, {
            "Price": 35000,
            "ServiceFee": 2876,
            "PassengerName": "Parm",
            "PassengerLastName": "Archamongkol",
            "Gender": "Male",
            "DateOfBirth": "2010-12-25T04:00:00Z",
            "Nationality": "Cambodia",
            "BaggageChecked": 10,
            "BaggageCabin": 7,
            "SeatNo": "20A",
            "AircraftRegNo": "NEOQ",
            "FlightNo": "SK141",
            "DepartTime": "2025-11-04T19:39:17Z",
            "ArrivalTime": "2025-11-04T21:00:00Z"
        }
    ],
    "totalAmount": 300103,
    "method": "QR_CODE",
    "paymentEmail": "faith@chula.ac.th",
    "paymentTelNo": "0812345678",
    "Adults": 3,
    "Childrens": 2,
    "Infants": 1,
    "FlightType": "Round Trip",
    "ClassType": "Economy",
    "DepartFlightNo": "AC137",
    "DepartFlightDepartTime": "2025-11-02T00:00:00Z",
    "DepartFlightArrivalTime": "2025-11-02T05:00:00Z",
    "ReturnFlightNo": "SK141",
    "ReturnFlightDepartTime": "2025-11-04T19:39:17Z",
    "ReturnFlightArrivalTime": "2025-11-04T21:00:00Z"
}
*/