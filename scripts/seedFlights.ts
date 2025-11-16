import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Check for dry-run flag from command line arguments
const isDryRun =
    process.argv.includes("--dry-run") || process.argv.includes("-d");

interface FlightData {
    FlightNo: string;
    DepartTime: Date;
    ArrivalTime: Date;
    ArrivalAirportID: string;
    DepartureAirportID: string;
    AirlineName: string;
    AircraftRegNo: string;
    AvailableSeat: number;
    TransitAmount: number;
    ExtraBaggage: boolean;
    SeatSelect: boolean;
    FreeCheckedBaggageWeight: number;
    FreeCheckedBaggageBags: number;
}

async function seedFlightsFromCSV() {
    if (isDryRun) {
        console.log("🔍 DRY RUN MODE - No data will be inserted\n");
    }
    console.log("Starting to seed flights from CSV...\n");

    try {
        const csvPath = path.join(__dirname, "..", "mockdata", "flight.csv");

        if (!fs.existsSync(csvPath)) {
            console.error("❌ CSV file not found at:", csvPath);
            process.exit(1);
        }

        // Load all reference data into memory ONCE at startup
        console.log("📦 Loading reference data into memory...");
        const [airports, airlines, aircrafts, existingFlights] =
            await Promise.all([
                prisma.airport.findMany({ select: { AirportID: true } }),
                prisma.airline.findMany({ select: { AirlineName: true } }),
                prisma.aircraft.findMany({ select: { AircraftRegNo: true } }),
                prisma.flight.findMany({
                    select: {
                        FlightNo: true,
                        DepartTime: true,
                        ArrivalTime: true,
                    },
                }),
            ]);

        // Create Sets for O(1) lookups
        const airportSet = new Set(airports.map((a) => a.AirportID));
        const airlineSet = new Set(airlines.map((a) => a.AirlineName));
        const aircraftSet = new Set(aircrafts.map((a) => a.AircraftRegNo));
        const existingFlightKeys = new Set(
            existingFlights.map(
                (f) =>
                    `${f.FlightNo}_${f.DepartTime.toISOString()}_${f.ArrivalTime.toISOString()}`,
            ),
        );

        console.log(`✓ Loaded ${airportSet.size} airports`);
        console.log(`✓ Loaded ${airlineSet.size} airlines`);
        console.log(`✓ Loaded ${aircraftSet.size} aircraft`);
        console.log(`✓ Found ${existingFlightKeys.size} existing flights\n`);

        const csvContent = fs.readFileSync(csvPath, "utf-8");
        const lines = csvContent
            .split("\n")
            .filter((line) => line.trim() !== "");

        // Skip header
        const dataLines = lines.slice(1);

        console.log(`Found ${dataLines.length} flights to process\n`);

        let insertedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;
        const flightsToInsert: any[] = [];

        for (let i = 0; i < dataLines.length; i++) {
            const line = dataLines[i];
            const [
                FlightNo,
                ArrivalAirportID,
                DepartureAirportID,
                AirlineName,
                AircraftRegNo,
                ArrivalTime,
                AvailableSeat,
                DepartTime,
                TransitAmount,
            ] = line.split(",").map((field) => field.trim());

            try {
                const departTime = new Date(DepartTime);
                const arrivalTime = new Date(ArrivalTime);
                const flightKey = `${FlightNo}_${departTime.toISOString()}_${arrivalTime.toISOString()}`;

                // Check if flight already exists (in-memory lookup)
                if (existingFlightKeys.has(flightKey)) {
                    if (isDryRun && skippedCount < 5) {
                        console.log(
                            `⏭️  Would skip ${FlightNo} (already exists)`,
                        );
                    }
                    skippedCount++;
                    continue;
                }

                // Verify related entities exist (in-memory lookups)
                if (!airportSet.has(ArrivalAirportID)) {
                    if (errorCount + skippedCount < 5) {
                        console.warn(
                            `⚠️  ${isDryRun ? "Would skip" : "Skipping"} ${FlightNo}: Arrival airport ${ArrivalAirportID} not found`,
                        );
                    }
                    skippedCount++;
                    continue;
                }

                if (!airportSet.has(DepartureAirportID)) {
                    if (errorCount + skippedCount < 5) {
                        console.warn(
                            `⚠️  ${isDryRun ? "Would skip" : "Skipping"} ${FlightNo}: Departure airport ${DepartureAirportID} not found`,
                        );
                    }
                    skippedCount++;
                    continue;
                }

                if (!airlineSet.has(AirlineName)) {
                    if (errorCount + skippedCount < 5) {
                        console.warn(
                            `⚠️  ${isDryRun ? "Would skip" : "Skipping"} ${FlightNo}: Airline ${AirlineName} not found`,
                        );
                    }
                    skippedCount++;
                    continue;
                }

                if (!aircraftSet.has(AircraftRegNo)) {
                    if (errorCount + skippedCount < 5) {
                        console.warn(
                            `⚠️  ${isDryRun ? "Would skip" : "Skipping"} ${FlightNo}: Aircraft ${AircraftRegNo} not found`,
                        );
                    }
                    skippedCount++;
                    continue;
                }

                // Prepare flight data for insertion
                if (!isDryRun) {
                    flightsToInsert.push({
                        FlightNo,
                        DepartTime: departTime,
                        ArrivalTime: arrivalTime,
                        ArrivalAirportID,
                        DepartureAirportID,
                        AirlineName,
                        AircraftRegNo,
                        AvailableSeat: parseInt(AvailableSeat),
                        TransitAmount: parseInt(TransitAmount),
                        ExtraBaggage: false,
                        SeatSelect: false,
                        FreeCheckedBaggageWeight: 0,
                        FreeCheckedBaggageBags: 0,
                    });
                } else if (insertedCount < 5) {
                    console.log(
                        `✓ Would insert flight ${FlightNo} (${DepartureAirportID} → ${ArrivalAirportID})`,
                    );
                }

                insertedCount++;

                // Progress indicator
                if ((i + 1) % 1000 === 0) {
                    console.log(
                        `Progress: ${i + 1}/${dataLines.length} processed (${insertedCount} valid, ${skippedCount} skipped)`,
                    );
                }
            } catch (error) {
                errorCount++;
                if (errorCount <= 5) {
                    console.error(
                        `❌ Error processing flight ${FlightNo}:`,
                        error instanceof Error ? error.message : error,
                    );
                }
            }
        }

        // Batch insert all flights at once (if not dry-run)
        if (!isDryRun && flightsToInsert.length > 0) {
            console.log(
                `\n💾 Inserting ${flightsToInsert.length} flights into database...`,
            );

            // Insert in batches of 500 to avoid potential issues with very large inserts
            const batchSize = 500;
            for (let i = 0; i < flightsToInsert.length; i += batchSize) {
                const batch = flightsToInsert.slice(i, i + batchSize);
                await prisma.flight.createMany({
                    data: batch,
                    skipDuplicates: true,
                });

                console.log(
                    `✓ Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(flightsToInsert.length / batchSize)}`,
                );
            }
        }

        console.log("\n=== Summary ===");
        if (isDryRun) {
            console.log(`✅ Would insert: ${insertedCount} flights`);
        } else {
            console.log(`✅ Successfully inserted: ${insertedCount} flights`);
        }
        console.log(
            `⏭️  Skipped (duplicates/missing refs): ${skippedCount} flights`,
        );
        console.log(`❌ Errors: ${errorCount} flights`);
        console.log(`📊 Total processed: ${dataLines.length} flights`);

        if (isDryRun) {
            console.log(
                "\n💡 This was a dry run. Run without --dry-run flag to actually insert data.",
            );
        }
    } catch (error) {
        console.error("❌ Fatal error during seeding:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
seedFlightsFromCSV()
    .then(() => {
        console.log(
            isDryRun
                ? "\n✨ Dry run completed!"
                : "\n✨ Flight seeding completed!",
        );
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n❌ Flight seeding failed:", error);
        process.exit(1);
    });
