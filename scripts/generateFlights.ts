import * as fs from 'fs';
import * as path from 'path';

// Thai domestic airports
const domesticAirports = ['BKK', 'CNX', 'HKT', 'CEI', 'UTH'];

// International airports
const internationalAirports = ['SIN', 'HND', 'LHR', 'JFK', 'DXB', 'CDG', 'FRA', 'LAX', 'HKG', 'DOH', 'ICN', 'KUL', 'SYD'];

// Aircraft by airline
const aircraftByAirline: { [key: string]: string[] } = {
  'Thai Airways': [
    'HS-WOD', 'HS-XJF', 'HS-KLY', 'HS-PAO', 'HS-MOV', 'HS-LFA', 'HS-JRD',
    'HS-HAX', 'HS-LUD', 'HS-RJP', 'HS-NQK', 'HS-FMV', 'HS-NWP', 'HS-QZK',
    'HS-BIY', 'HS-VCA', 'HS-UDJ', 'HS-XKD', 'HS-OYV', 'HS-DAK', 'HS-CVT',
    'HS-UMN', 'HS-XEO', 'HS-WTP', 'HS-HTY', 'HS-FZL', 'HS-XVN', 'HS-AOZ',
    'HS-ITH', 'HS-CFA', 'HS-GTO', 'HS-TPT', 'HS-BMW', 'HS-RNT', 'HS-XJT',
    'HS-XQA', 'HS-WBK', 'HS-UHY', 'HS-MMH', 'HS-MCE', 'HS-GEY', 'HS-DNN',
    'HS-VXQ', 'HS-WRA', 'HS-UBY', 'HS-LOE', 'HS-NEW'
  ],
  'Singapore Airlines': ['9V-KZS', '9V-XNE', '9V-NVT', '9V-OSF', '9V-GSN', '9V-ZKM', '9V-MSN', '9V-QXX', '9V-NEW'],
  'British Airways': ['G-NJV', 'G-XHC', 'G-QYK', 'G-UMZ', 'G-VYL', 'G-ZNX', 'G-EKB', 'G-YXB', 'G-IBD'],
  'Air France': ['F-YSZ', 'JAHSD', 'F-RET', 'F-VCJ', 'F-AGP', 'F-AYA', 'F-YQH', 'F-CYY'],
  'Emirates': ['A6-BYB', 'A6-WUI', 'A6-FWR', 'A6-NEW'],
  'Lufthansa': ['D-AMMT', 'D-AHJV', 'D-AVIH', 'D-AYUY'],
  'Qatar Airways': ['A7-MKX', 'A7-IAT', 'A7-CRS', 'A7-STH'],
  'Cathay Pacific': ['B-XRS', 'B-ZMT', 'B-ZEB', 'B-UFI', 'B-OHZ', 'B-JYZ'],
  'Delta Air Lines': ['NTAP', 'NEMM', 'NFLH'],
  'United Airlines': ['NTXC', 'NEOQ', 'NYLA'],
  'ANA': ['JAKYF', 'JAPIP', 'JAXVB', 'JAHJY', 'JAGLR', 'JAEIP']
};

// Aircraft capacity mapping (approximate from the data)
const aircraftCapacity: { [key: string]: number } = {
  'HS-WOD': 280, 'HS-XJF': 350, 'HS-KLY': 300, 'HS-PAO': 300, 'HS-MOV': 280,
  'HS-LFA': 180, 'HS-JRD': 280, 'HS-HAX': 180, 'HS-LUD': 280, 'HS-RJP': 180,
  'HS-NQK': 280, 'HS-FMV': 300, 'HS-NWP': 280, 'HS-QZK': 300, 'HS-BIY': 280,
  'HS-VCA': 280, 'HS-UDJ': 280, 'HS-XKD': 280, 'HS-OYV': 350, 'HS-DAK': 280,
  'HS-CVT': 280, 'HS-UMN': 280, 'HS-XEO': 350, 'HS-WTP': 190, 'HS-HTY': 280,
  'HS-FZL': 300, 'HS-XVN': 190, 'HS-AOZ': 280, 'HS-ITH': 190, 'HS-CFA': 280,
  'HS-GTO': 190, 'HS-TPT': 350, 'HS-BMW': 280, 'HS-RNT': 280, 'HS-XJT': 180,
  'HS-XQA': 190, 'HS-WBK': 180, 'HS-UHY': 300, 'HS-MMH': 300, 'HS-MCE': 190,
  'HS-GEY': 180, 'HS-DNN': 190, 'HS-VXQ': 300, 'HS-WRA': 300, 'HS-UBY': 180,
  'HS-LOE': 280, 'HS-NEW': 180
};

// Set default capacity for other airlines
Object.keys(aircraftByAirline).forEach(airline => {
  if (airline !== 'Thai Airways') {
    aircraftByAirline[airline].forEach(reg => {
      if (!aircraftCapacity[reg]) {
        aircraftCapacity[reg] = 280;
      }
    });
  }
});

interface Flight {
  FlightNo: string;
  ArrivalAirportID: string;
  DepartureAirportID: string;
  AirlineName: string;
  AircraftRegNo: string;
  ArrivalTime: string;
  AvailableSeat: number;
  DepartTime: string;
  TransitAmount: number;
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDateTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

function addHours(date: Date, hours: number): Date {
  const newDate = new Date(date);
  newDate.setHours(newDate.getHours() + hours);
  return newDate;
}

function generateFlightNumber(airline: string, counter: number): string {
  const prefix: { [key: string]: string } = {
    'Thai Airways': 'TG',
    'Singapore Airlines': 'SQ',
    'British Airways': 'BA',
    'Air France': 'AF',
    'Emirates': 'EK',
    'Lufthansa': 'LH',
    'Qatar Airways': 'QR',
    'Cathay Pacific': 'CX',
    'Delta Air Lines': 'DL',
    'United Airlines': 'UA',
    'ANA': 'NH'
  };
  return `${prefix[airline] || 'XX'}${String(counter).padStart(3, '0')}`;
}

function generateFlights(): Flight[] {
  const flights: Flight[] = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 3);

  let flightCounter: { [key: string]: number } = {};
  Object.keys(aircraftByAirline).forEach(airline => {
    flightCounter[airline] = 200;
  });

  // Generate flights for each day
  for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    const dayFlights: Flight[] = [];

    // 1. Essential domestic routes (Thai Airways) - Ensure coverage between all Thai cities
    const domesticRoutes = [
      ['BKK', 'CNX'], ['CNX', 'BKK'],
      ['BKK', 'HKT'], ['HKT', 'BKK'],
      ['BKK', 'CEI'], ['CEI', 'BKK'],
      ['BKK', 'UTH'], ['UTH', 'BKK'],
      ['CNX', 'HKT'], ['HKT', 'CNX'],
      ['CNX', 'CEI'], ['CEI', 'CNX'],
      ['CNX', 'UTH'], ['UTH', 'CNX'],
      ['HKT', 'CEI'], ['CEI', 'HKT'],
      ['HKT', 'UTH'], ['UTH', 'HKT'],
      ['CEI', 'UTH'], ['UTH', 'CEI']
    ];

    // Add multiple flights per route per day
    domesticRoutes.forEach(([origin, destination]) => {
      const numFlights = ['BKK', 'CNX', 'HKT'].includes(origin) ?
        getRandomInt(3, 5) : getRandomInt(2, 3);

      for (let i = 0; i < numFlights; i++) {
        const airline = 'Thai Airways';
        const aircraft = getRandomItem(aircraftByAirline[airline]);
        const capacity = aircraftCapacity[aircraft];

        // Spread flights throughout the day
        const hour = 6 + Math.floor((i * 16) / numFlights) + getRandomInt(-1, 1);
        const minute = getRandomInt(0, 59);

        const departTime = new Date(currentDate);
        departTime.setHours(hour, minute, 0, 0);

        // Domestic flight duration: 1-2 hours
        const flightDuration = getRandomInt(1, 2) + (getRandomInt(0, 59) / 60);
        const arrivalTime = addHours(departTime, flightDuration);

        dayFlights.push({
          FlightNo: generateFlightNumber(airline, flightCounter[airline]++),
          ArrivalAirportID: destination,
          DepartureAirportID: origin,
          AirlineName: airline,
          AircraftRegNo: aircraft,
          ArrivalTime: formatDateTime(arrivalTime),
          AvailableSeat: Math.floor(capacity * getRandomInt(30, 95) / 100),
          DepartTime: formatDateTime(departTime),
          TransitAmount: 0
        });
      }
    });

    // 2. International flights from Bangkok to major hubs
    const internationalRoutes = [
      ['BKK', 'SIN', 'Singapore Airlines', 2.5],
      ['SIN', 'BKK', 'Singapore Airlines', 2.5],
      ['BKK', 'HKG', 'Cathay Pacific', 3],
      ['HKG', 'BKK', 'Cathay Pacific', 3],
      ['BKK', 'HND', 'ANA', 6],
      ['HND', 'BKK', 'ANA', 6],
      ['BKK', 'LHR', 'British Airways', 13],
      ['LHR', 'BKK', 'British Airways', 13],
      ['BKK', 'CDG', 'Air France', 12],
      ['CDG', 'BKK', 'Air France', 12],
      ['BKK', 'FRA', 'Lufthansa', 11],
      ['FRA', 'BKK', 'Lufthansa', 11],
      ['BKK', 'DOH', 'Qatar Airways', 6],
      ['DOH', 'BKK', 'Qatar Airways', 6],
      ['BKK', 'DXB', 'Emirates', 6],
      ['DXB', 'BKK', 'Emirates', 6]
    ];

    internationalRoutes.forEach(([origin, destination, airline, duration]) => {
      if (Math.random() > 0.3) { // 70% chance for each route
        const aircraftList = aircraftByAirline[airline as string];
        const aircraft = getRandomItem(aircraftList);
        const capacity = aircraftCapacity[aircraft] || 280;

        const hour = getRandomInt(0, 23);
        const minute = getRandomInt(0, 59);

        const departTime = new Date(currentDate);
        departTime.setHours(hour, minute, 0, 0);

        const arrivalTime = addHours(departTime, duration as number);

        dayFlights.push({
          FlightNo: generateFlightNumber(airline as string, flightCounter[airline as string]++),
          ArrivalAirportID: destination as string,
          DepartureAirportID: origin as string,
          AirlineName: airline as string,
          AircraftRegNo: aircraft,
          ArrivalTime: formatDateTime(arrivalTime),
          AvailableSeat: Math.floor(capacity * getRandomInt(40, 90) / 100),
          DepartTime: formatDateTime(departTime),
          TransitAmount: 0
        });
      }
    });

    // 3. International to Thai cities (CNX, HKT, CEI)
    const otherThaiCities = ['CNX', 'HKT', 'CEI'];
    otherThaiCities.forEach(thaiCity => {
      if (Math.random() > 0.5) { // 50% chance
        const intlAirport = getRandomItem(['SIN', 'HKG', 'HND', 'KUL', 'ICN']);
        const airline = intlAirport === 'SIN' ? 'Singapore Airlines' :
                       intlAirport === 'HKG' ? 'Cathay Pacific' :
                       intlAirport === 'HND' ? 'ANA' : 'Thai Airways';

        const aircraftList = aircraftByAirline[airline];
        const aircraft = getRandomItem(aircraftList);
        const capacity = aircraftCapacity[aircraft] || 280;

        const departTime = new Date(currentDate);
        departTime.setHours(getRandomInt(8, 20), getRandomInt(0, 59), 0, 0);

        const arrivalTime = addHours(departTime, getRandomInt(3, 5));

        dayFlights.push({
          FlightNo: generateFlightNumber(airline, flightCounter[airline]++),
          ArrivalAirportID: thaiCity,
          DepartureAirportID: intlAirport,
          AirlineName: airline,
          AircraftRegNo: aircraft,
          ArrivalTime: formatDateTime(arrivalTime),
          AvailableSeat: Math.floor(capacity * getRandomInt(40, 90) / 100),
          DepartTime: formatDateTime(departTime),
          TransitAmount: 0
        });
      }
    });

    // 4. Long-haul flights (JFK, LAX) with transits
    if (currentDate.getDay() % 2 === 0) { // Every other day
      const longHaulRoutes = [
        ['BKK', 'LAX', 'Thai Airways', 1],
        ['LAX', 'BKK', 'United Airlines', 2],
        ['BKK', 'JFK', 'Thai Airways', 2],
        ['JFK', 'BKK', 'Delta Air Lines', 1]
      ];

      longHaulRoutes.forEach(([origin, destination, airline, transit]) => {
        if (Math.random() > 0.4) {
          const aircraftList = aircraftByAirline[airline as string];
          if (aircraftList && aircraftList.length > 0) {
            const aircraft = getRandomItem(aircraftList);
            const capacity = aircraftCapacity[aircraft] || 280;

            const departTime = new Date(currentDate);
            departTime.setHours(getRandomInt(10, 22), getRandomInt(0, 59), 0, 0);

            const arrivalTime = addHours(departTime, getRandomInt(16, 20));

            dayFlights.push({
              FlightNo: generateFlightNumber(airline as string, flightCounter[airline as string]++),
              ArrivalAirportID: destination as string,
              DepartureAirportID: origin as string,
              AirlineName: airline as string,
              AircraftRegNo: aircraft,
              ArrivalTime: formatDateTime(arrivalTime),
              AvailableSeat: Math.floor(capacity * getRandomInt(50, 85) / 100),
              DepartTime: formatDateTime(departTime),
              TransitAmount: transit as number
            });
          }
        }
      });
    }

    flights.push(...dayFlights);
  }

  return flights;
}

function writeFlightsToCSV() {
  console.log('🛫 Generating comprehensive flight schedule for next 3 months...\n');

  const flights = generateFlights();

  // CSV header
  let csvContent = 'FlightNo,ArrivalAirportID,DepartureAirportID,AirlineName,AircraftRegNo,ArrivalTime,AvailableSeat,DepartTime,TransitAmount\n';

  // Add all flights
  flights.forEach(flight => {
    csvContent += `${flight.FlightNo},${flight.ArrivalAirportID},${flight.DepartureAirportID},${flight.AirlineName},${flight.AircraftRegNo},${flight.ArrivalTime},${flight.AvailableSeat},${flight.DepartTime},${flight.TransitAmount}\n`;
  });

  // Write to file
  const outputPath = path.join(__dirname, '..', 'mockdata', 'flight.csv');
  fs.writeFileSync(outputPath, csvContent, 'utf-8');

  console.log(`✅ Successfully generated ${flights.length} flights`);
  console.log(`📁 File saved to: ${outputPath}\n`);

  // Statistics
  const groupedByDate = flights.reduce((acc, flight) => {
    const date = flight.DepartTime.split(' ')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const datesWithFlights = Object.keys(groupedByDate).length;
  const avgFlightsPerDay = Math.round(flights.length / datesWithFlights);

  console.log('📊 Statistics:');
  console.log(`   Total flights: ${flights.length}`);
  console.log(`   Days covered: ${datesWithFlights}`);
  console.log(`   Average flights per day: ${avgFlightsPerDay}`);

  // Check domestic routes coverage
  const domesticRoutes = new Set<string>();
  flights.forEach(f => {
    if (domesticAirports.includes(f.DepartureAirportID) && domesticAirports.includes(f.ArrivalAirportID)) {
      domesticRoutes.add(`${f.DepartureAirportID}-${f.ArrivalAirportID}`);
    }
  });
  console.log(`   Unique domestic routes: ${domesticRoutes.size}`);
  console.log('\n✨ Generation complete!');
}

writeFlightsToCSV();
