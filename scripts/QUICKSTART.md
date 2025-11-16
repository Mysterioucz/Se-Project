# Quick Start: Seat Generation

Generate seats for all flights in your database in just 2 minutes!

## Seat Configuration

All aircraft use a **uniform seat layout**:
- **10 rows** (numbered 1-10)
- **6 columns** (A, B, C, D, E, F)
- **60 seats per flight**
- **All ECONOMY class**

```
Row Layout:
  [A] [B] [C]  |  [D] [E] [F]
   1A  1B  1C  |  1D  1E  1F
   2A  2B  2C  |  2D  2E  2F
   ...
  10A 10B 10C  | 10D 10E 10F
```

## Prerequisites

Make sure your database is running and contains flight data.

## Installation

First, install the required dependency:

```bash
pnpm install
```

This will automatically install `tsx` (TypeScript executor) as a dev dependency.

## Usage

### Option 1: All-in-One Command (Recommended)

Generate and seed all seats in one go:

```bash
pnpm seats:all
```

This command will:
1. ✅ Fetch all flights from your database
2. ✅ Generate 60 seats per flight (10 rows × 6 columns)
3. ✅ Save a backup CSV file
4. ✅ Insert all seats into the database
5. ✅ Show statistics

**Expected Output:**
```
🚀 Starting seat generation and seeding process...

📡 Step 1: Fetching flights from database...
✓ Found 106 flights

📝 Step 2: Generating seats for all flights...
   Processing: TG100 (Airbus A330)
   ✓ Generated 60 seats
   Processing: TG101 (Boeing 777)
   ✓ Generated 60 seats
   ...

💾 Step 3: Saving backup to CSV...
✓ Backup saved to: mockdata/generated_seats.csv

🗄️  Step 4: Inserting seats into database...
   Progress: 500/6360 seats (8%)
   Progress: 1000/6360 seats (16%)
   ...
   Progress: 6360/6360 seats (100%)

📊 Statistics:
   Total Flights:  106
   Total Seats:    6,360

   Seats by Class:
     • ECONOMY            :   6360 (100.0%)

✅ SUCCESS! All seats generated and seeded successfully!
```

### Option 2: Step-by-Step

If you prefer to run steps separately:

**Step 1: Generate seats to CSV**
```bash
pnpm seats:generate
```

**Step 2: Seed from CSV to database**
```bash
pnpm seats:seed
```

## Verify Results

Check your database to confirm seats were created:

```sql
-- Count total seats
SELECT COUNT(*) FROM "Seat";

-- Count seats by type
SELECT "SeatType", COUNT(*) 
FROM "Seat" 
GROUP BY "SeatType";

-- Check seats for a specific flight
SELECT * FROM "Seat" 
WHERE "FlightNo" = 'TG100' 
LIMIT 10;

-- View seat layout for a flight
SELECT "SeatNo", "IsAvailable"
FROM "Seat"
WHERE "FlightNo" = 'TG100'
  AND "DepartTime" = '2025-09-25 02:36:26'
ORDER BY "SeatNo";
```

## Expected Numbers

For 106 flights:
- **Total Seats**: 6,360 (106 flights × 60 seats)
- **All ECONOMY class**
- **Generation Time**: 30-60 seconds

## Output Files

Generated files are saved to:
- **CSV Backup**: `mockdata/generated_seats.csv`

## Troubleshooting

**"tsx: command not found"**
```bash
pnpm install
```

**"Database connection failed"**
- Check your `.env` file contains `DATABASE_URL`
- Verify your database is running

**"Prisma client not generated"**
```bash
pnpm prisma generate
```

**Want to regenerate seats?**

To clear existing seats and regenerate:
```sql
DELETE FROM "Seat";
```

Then run:
```bash
pnpm seats:all
```

## Seat Numbering

Seats follow a standard pattern:
- **Rows**: 1 to 10
- **Columns**: A, B, C (left side) and D, E, F (right side)
- **Format**: Row number + Column letter (e.g., 1A, 5F, 10C)

Example for one flight:
```
1A, 1B, 1C, 1D, 1E, 1F
2A, 2B, 2C, 2D, 2E, 2F
3A, 3B, 3C, 3D, 3E, 3F
...
10A, 10B, 10C, 10D, 10E, 10F
```

## Need Help?

See detailed documentation in `scripts/README.md`

---

**That's it!** 🎉 Your flights now have complete seat layouts.