import { NextResponse } from 'next/server';

const AVIATION_API_KEY = '57c8980f7f67253dea09cdd5b765d3d7';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get('flight');

  if (!flightNumber) {
    return NextResponse.json({ error: 'Flight number required' }, { status: 400 });
  }

  // Parse airline code and flight number (e.g., "AA1234" → airline "AA", flight "1234")
  const match = flightNumber.toUpperCase().match(/^([A-Z]{2})(\d+)$/);
  if (!match) {
    return NextResponse.json({ error: 'Invalid format. Use airline code + number (e.g., AA1234)' }, { status: 400 });
  }

  const [, airlineIata, flightNum] = match;

  try {
    const response = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${AVIATION_API_KEY}&airline_iata=${airlineIata}&flight_number=${flightNum}&limit=1`
    );

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message || 'API error' }, { status: 500 });
    }

    if (!data.data || data.data.length === 0) {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 });
    }

    const flight = data.data[0];

    return NextResponse.json({
      airline: flight.airline?.name || airlineIata,
      flightNumber: `${airlineIata}${flightNum}`,
      status: flight.flight_status || 'unknown',
      departure: {
        airport: flight.departure?.airport || 'Unknown',
        iata: flight.departure?.iata || '',
        scheduled: flight.departure?.scheduled || null,
        estimated: flight.departure?.estimated || null,
        actual: flight.departure?.actual || null,
        timezone: flight.departure?.timezone || '',
      },
      arrival: {
        airport: flight.arrival?.airport || 'Unknown',
        iata: flight.arrival?.iata || '',
        scheduled: flight.arrival?.scheduled || null,
        estimated: flight.arrival?.estimated || null,
        actual: flight.arrival?.actual || null,
        timezone: flight.arrival?.timezone || '',
      },
    });
  } catch (error) {
    console.error('Flight API error:', error);
    return NextResponse.json({ error: 'Failed to fetch flight data' }, { status: 500 });
  }
}