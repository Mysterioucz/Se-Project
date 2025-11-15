import { PrismaClient } from '../src/generated/prisma';

const prisma = new PrismaClient();

async function validateSetup() {
  console.log('🔍 Validating setup for seat generation...\n');
  console.log('═'.repeat(60));

  try {
    // Test 1: Database connection
    console.log('\n✓ Test 1: Database Connection');
    await prisma.$connect();
    console.log('  ✅ Database connection successful');

    // Test 2: Check if flights exist
    console.log('\n✓ Test 2: Flight Data');
    const flightCount = await prisma.flight.count();
    if (flightCount === 0) {
      console.log('  ⚠️  WARNING: No flights found in database');
      console.log('  Please seed flight data before generating seats');
    } else {
      console.log(`  ✅ Found ${flightCount} flights`);
    }

    // Test 3: Check if aircraft data exists
    console.log('\n✓ Test 3: Aircraft Data');
    const aircraftCount = await prisma.aircraft.count();
    if (aircraftCount === 0) {
      console.log('  ⚠️  WARNING: No aircraft found in database');
      console.log('  Please seed aircraft data before generating seats');
    } else {
      console.log(`  ✅ Found ${aircraftCount} aircraft`);
    }

    // Test 4: Sample flight with aircraft
    if (flightCount > 0 && aircraftCount > 0) {
      console.log('\n✓ Test 4: Flight-Aircraft Relationship');
      const sampleFlight = await prisma.flight.findFirst({
        include: {
          aircraft: true
        }
      });

      if (sampleFlight) {
        console.log(`  ✅ Sample flight: ${sampleFlight.FlightNo}`);
        console.log(`     Aircraft: ${sampleFlight.aircraft.ModelName}`);
        console.log(`     Registration: ${sampleFlight.aircraft.AircraftRegNo}`);
        console.log(`     Capacity: ${sampleFlight.aircraft.SeatCapacity} seats`);
      }
    }

    // Test 5: Check existing seats
    console.log('\n✓ Test 5: Existing Seat Data');
    const seatCount = await prisma.seat.count();
    if (seatCount > 0) {
      console.log(`  ⚠️  Found ${seatCount} existing seats in database`);
      console.log('  Running seat generation will skip duplicates');

      const sampleSeats = await prisma.seat.findMany({
        take: 3,
        select: {
          FlightNo: true,
          SeatNo: true,
          SeatType: true,
          IsAvailable: true
        }
      });

      console.log('\n  Sample existing seats:');
      sampleSeats.forEach(seat => {
        console.log(`    ${seat.FlightNo} - ${seat.SeatNo} (${seat.SeatType}) ${seat.IsAvailable ? '🟢' : '🔴'}`);
      });
    } else {
      console.log('  ✅ No existing seats - ready for generation');
    }

    // Test 6: Aircraft model distribution
    if (flightCount > 0) {
      console.log('\n✓ Test 6: Aircraft Model Distribution');
      const flights = await prisma.flight.findMany({
        include: {
          aircraft: true
        }
      });

      const modelCounts = flights.reduce((acc, flight) => {
        const model = flight.aircraft.ModelName;
        acc[model] = (acc[model] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('  Aircraft models in use:');
      Object.entries(modelCounts)
        .sort((a, b) => b[1] - a[1])
        .forEach(([model, count]) => {
          console.log(`    • ${model}: ${count} flights`);
        });
    }

    console.log('\n═'.repeat(60));
    console.log('✅ Validation completed successfully!');
    console.log('\nYou can now run: pnpm seats:all');
    console.log('═'.repeat(60));

  } catch (error) {
    console.error('\n❌ Validation failed:', error);
    console.log('\nPlease check:');
    console.log('  1. DATABASE_URL is set in .env file');
    console.log('  2. Database is running and accessible');
    console.log('  3. Prisma client is generated (run: pnpm prisma generate)');
    console.log('  4. Database migrations are up to date');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run validation
validateSetup()
  .then(() => {
    console.log('\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Validation error:', error);
    process.exit(1);
  });
