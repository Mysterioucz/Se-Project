import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

async function generateAndSeedFlights() {
  console.log('🚀 Starting flight generation and seeding process...\n');

  try {
    // Step 1: Generate flights
    console.log('📋 Step 1: Generating flight data...');
    const { stdout: generateOutput } = await execPromise('pnpm flight:generate');
    console.log(generateOutput);

    // Step 2: Seed flights
    console.log('📋 Step 2: Seeding flights to database...');
    const { stdout: seedOutput } = await execPromise('pnpm flight:seed');
    console.log(seedOutput);

    console.log('✅ All operations completed successfully!');
    console.log('\n🎉 Flights have been generated and seeded to the database!');

  } catch (error) {
    console.error('❌ Error during process:', error);
    process.exit(1);
  }
}

// Run the combined process
generateAndSeedFlights();
