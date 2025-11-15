import { PrismaClient } from '../src/generated/prisma';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface SeatData {
  SeatNo: string;
  SeatType: string;
  IsAvailable: boolean;
  DepartTime: Date;
  FlightNo: string;
  ArrivalTime: Date;
}

async function seedSeatsFromCSV() {
  console.log('Starting to seed seats from CSV...\n');

  try {
    const csvPath = path.join(__dirname, '..', 'mockdata', 'generated_seats.csv');

    if (!fs.existsSync(csvPath)) {
      console.error('❌ CSV file not found. Please run generateSeats.ts first.');
      process.exit(1);
    }

    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');

    // Skip header
    const dataLines = lines.slice(1);

    console.log(`Found ${dataLines.length} seats to insert\n`);

    let insertedCount = 0;
    let batchSize = 100;
    let batchSeats: SeatData[] = [];

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const [SeatNo, SeatType, IsAvailable, DepartTime, FlightNo, ArrivalTime] = line.split(',');

      batchSeats.push({
        SeatNo: SeatNo.trim(),
        SeatType: SeatType.trim(),
        IsAvailable: IsAvailable.trim().toLowerCase() === 'true',
        DepartTime: new Date(DepartTime.trim()),
        FlightNo: FlightNo.trim(),
        ArrivalTime: new Date(ArrivalTime.trim())
      });

      // Insert in batches
      if (batchSeats.length >= batchSize || i === dataLines.length - 1) {
        await prisma.seat.createMany({
          data: batchSeats,
          skipDuplicates: true
        });

        insertedCount += batchSeats.length;
        console.log(`✓ Inserted batch: ${insertedCount}/${dataLines.length} seats`);
        batchSeats = [];
      }
    }

    console.log(`\n✅ Successfully seeded ${insertedCount} seats into the database!`);

  } catch (error) {
    console.error('❌ Error seeding seats:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
seedSeatsFromCSV()
  .then(() => {
    console.log('\n✨ Seat seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seat seeding failed:', error);
    process.exit(1);
  });
