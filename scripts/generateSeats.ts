import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Uniform seat configuration for all aircraft types
// 10 rows total with 6 columns (A to F) = 60 seats per flight
const SEAT_CONFIGS = {
    "Airbus A320": {
        capacity: 60,
        layout: {
            ECONOMY: {
                rows: 10,
                seatsPerRow: 6,
                letters: ["A", "B", "C", "D", "E", "F"],
            },
        },
    },
    "Boeing 737": {
        capacity: 60,
        layout: {
            ECONOMY: {
                rows: 10,
                seatsPerRow: 6,
                letters: ["A", "B", "C", "D", "E", "F"],
            },
        },
    },
    "Airbus A330": {
        capacity: 60,
        layout: {
            ECONOMY: {
                rows: 10,
                seatsPerRow: 6,
                letters: ["A", "B", "C", "D", "E", "F"],
            },
        },
    },
    "Airbus A350": {
        capacity: 60,
        layout: {
            ECONOMY: {
                rows: 10,
                seatsPerRow: 6,
                letters: ["A", "B", "C", "D", "E", "F"],
            },
        },
    },
    "Boeing 777": {
        capacity: 60,
        layout: {
            ECONOMY: {
                rows: 10,
                seatsPerRow: 6,
                letters: ["A", "B", "C", "D", "E", "F"],
            },
        },
    },
    "Boeing 787": {
        capacity: 60,
        layout: {
            ECONOMY: {
                rows: 10,
                seatsPerRow: 6,
                letters: ["A", "B", "C", "D", "E", "F"],
            },
        },
    },
};

interface Seat {
    SeatNo: string;
    SeatType: string;
    IsAvailable: boolean;
    DepartTime: string;
    FlightNo: string;
    ArrivalTime: string;
}

function generateSeatsForFlight(
    flightNo: string,
    departTime: string,
    arrivalTime: string,
    modelName: string,
): Seat[] {
    const seats: Seat[] = [];
    const config = SEAT_CONFIGS[modelName as keyof typeof SEAT_CONFIGS];

    if (!config) {
        console.warn(`No seat configuration found for model: ${modelName}`);
        return seats;
    }

    let currentRow = 1;

    // Generate seats for each class
    for (const [seatType, classConfig] of Object.entries(config.layout)) {
        for (let row = 0; row < classConfig.rows; row++) {
            for (const letter of classConfig.letters) {
                seats.push({
                    SeatNo: `${currentRow}${letter}`,
                    SeatType: seatType,
                    IsAvailable: true,
                    DepartTime: departTime,
                    FlightNo: flightNo,
                    ArrivalTime: arrivalTime,
                });
            }
            currentRow++;
        }
    }

    return seats;
}

async function generateAllSeats() {
    console.log("Starting seat generation for all flights...\n");

    try {
        // Fetch all flights with their aircraft information
        const flights = await prisma.flight.findMany({
            include: {
                aircraft: true,
            },
        });

        console.log(`Found ${flights.length} flights\n`);

        const allSeats: Seat[] = [];
        let flightCount = 0;

        for (const flight of flights) {
            const departTime = flight.DepartTime.toISOString()
                .replace("T", " ")
                .substring(0, 19);
            const arrivalTime = flight.ArrivalTime.toISOString()
                .replace("T", " ")
                .substring(0, 19);

            console.log(
                `Generating seats for Flight ${flight.FlightNo} (${flight.aircraft.ModelName})...`,
            );

            const seats = generateSeatsForFlight(
                flight.FlightNo,
                departTime,
                arrivalTime,
                flight.aircraft.ModelName,
            );

            allSeats.push(...seats);
            flightCount++;

            console.log(
                `  Generated ${seats.length} seats for ${flight.FlightNo}`,
            );
        }

        // Write to CSV file
        const csvPath = path.join(
            __dirname,
            "..",
            "mockdata",
            "generated_seats.csv",
        );
        const csvHeader =
            "SeatNo,SeatType,IsAvailable,DepartTime,FlightNo,ArrivalTime\n";
        const csvContent =
            csvHeader +
            allSeats
                .map(
                    (seat) =>
                        `${seat.SeatNo},${seat.SeatType},${seat.IsAvailable},${seat.DepartTime},${seat.FlightNo},${seat.ArrivalTime}`,
                )
                .join("\n");

        fs.writeFileSync(csvPath, csvContent);

        console.log(
            `\n✅ Successfully generated ${allSeats.length} seats for ${flightCount} flights`,
        );
        console.log(`📄 Seats saved to: ${csvPath}`);

        // Generate summary statistics
        const statsByType = allSeats.reduce(
            (acc, seat) => {
                acc[seat.SeatType] = (acc[seat.SeatType] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        console.log("\n📊 Seat Statistics:");
        for (const [type, count] of Object.entries(statsByType)) {
            console.log(`   ${type}: ${count} seats`);
        }
    } catch (error) {
        console.error("Error generating seats:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
generateAllSeats()
    .then(() => {
        console.log("\n✨ Seat generation completed successfully!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Seat generation failed:", error);
        process.exit(1);
    });
