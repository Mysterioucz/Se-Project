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

interface SeatData {
    SeatNo: string;
    SeatType: string;
    IsAvailable: boolean;
    DepartTime: Date;
    FlightNo: string;
    ArrivalTime: Date;
}

function generateSeatsForFlight(
    flightNo: string,
    departTime: Date,
    arrivalTime: Date,
    modelName: string,
): SeatData[] {
    const seats: SeatData[] = [];
    const config = SEAT_CONFIGS[modelName as keyof typeof SEAT_CONFIGS];

    if (!config) {
        console.warn(`⚠️  No seat configuration found for model: ${modelName}`);
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

async function generateAndSeedSeats() {
    console.log("🚀 Starting seat generation and seeding process...\n");
    console.log("═".repeat(60));

    try {
        // Step 1: Fetch all flights
        console.log("\n📡 Step 1: Fetching flights from database...");
        const flights = await prisma.flight.findMany({
            include: {
                aircraft: true,
            },
        });

        console.log(`✓ Found ${flights.length} flights\n`);

        // Step 2: Generate seats
        console.log("📝 Step 2: Generating seats for all flights...\n");
        const allSeats: SeatData[] = [];
        let flightCount = 0;

        for (const flight of flights) {
            console.log(
                `   Processing: ${flight.FlightNo} (${flight.aircraft.ModelName})`,
            );

            const seats = generateSeatsForFlight(
                flight.FlightNo,
                flight.DepartTime,
                flight.ArrivalTime,
                flight.aircraft.ModelName,
            );

            allSeats.push(...seats);
            flightCount++;

            if (seats.length > 0) {
                console.log(`   ✓ Generated ${seats.length} seats`);
            }
        }

        // Step 3: Save to CSV (optional backup)
        console.log(`\n💾 Step 3: Saving backup to CSV...`);
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
                        `${seat.SeatNo},${seat.SeatType},${seat.IsAvailable},${seat.DepartTime.toISOString().replace("T", " ").substring(0, 19)},${seat.FlightNo},${seat.ArrivalTime.toISOString().replace("T", " ").substring(0, 19)}`,
                )
                .join("\n");

        fs.writeFileSync(csvPath, csvContent);
        console.log(`✓ Backup saved to: ${csvPath}`);

        // Step 4: Insert into database
        console.log(`\n🗄️  Step 4: Inserting seats into database...\n`);
        let insertedCount = 0;
        const batchSize = 500;

        for (let i = 0; i < allSeats.length; i += batchSize) {
            const batch = allSeats.slice(i, i + batchSize);

            await prisma.seat.createMany({
                data: batch,
                skipDuplicates: true,
            });

            insertedCount += batch.length;
            const progress = Math.round(
                (insertedCount / allSeats.length) * 100,
            );
            console.log(
                `   Progress: ${insertedCount}/${allSeats.length} seats (${progress}%)`,
            );
        }

        // Step 5: Generate statistics
        console.log("\n═".repeat(60));
        console.log("📊 Statistics:\n");

        const statsByType = allSeats.reduce(
            (acc, seat) => {
                acc[seat.SeatType] = (acc[seat.SeatType] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        console.log(`   Total Flights:  ${flightCount}`);
        console.log(`   Total Seats:    ${allSeats.length}`);
        console.log("");
        console.log("   Seats by Class:");
        for (const [type, count] of Object.entries(statsByType)) {
            const percentage = ((count / allSeats.length) * 100).toFixed(1);
            console.log(
                `     • ${type.padEnd(20)}: ${count.toString().padStart(6)} (${percentage}%)`,
            );
        }

        console.log("\n═".repeat(60));
        console.log("✅ SUCCESS! All seats generated and seeded successfully!");
        console.log("═".repeat(60));
    } catch (error) {
        console.error("\n❌ Error during seat generation/seeding:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
generateAndSeedSeats()
    .then(() => {
        console.log("\n✨ Process completed!\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Process failed:", error);
        process.exit(1);
    });
