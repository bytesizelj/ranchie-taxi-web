import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const phone = request.nextUrl.searchParams.get('phone');
  
  if (!phone) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 });
  }

  const digits = phone.replace(/[^0-9]/g, '');
  
  if (digits.length < 10 || digits.length > 15) {
    return NextResponse.json({ valid: false, reason: 'Invalid phone number length' });
  }

  try {
    const res = await fetch(
      `http://apilayer.net/api/validate?access_key=d96822c5c68c65aa765bff49529a5ec9&number=${digits}&format=1`
    );
    const data = await res.json();

    if (!data.valid) {
      return NextResponse.json({ valid: false, reason: 'Phone number is not valid' });
    }

    if (data.line_type === 'voip' || data.line_type === 'virtual') {
      return NextResponse.json({ valid: false, reason: 'Virtual/VoIP numbers are not accepted. Please use a mobile number.' });
    }

    return NextResponse.json({ 
      valid: true, 
      carrier: data.carrier || 'Unknown',
      lineType: data.line_type || 'Unknown',
      country: data.country_name || 'Unknown'
    });
  } catch (error) {
    console.error('Phone validation error:', error);
    // If API fails, allow the booking through (don't block real customers)
    return NextResponse.json({ valid: true, reason: 'Validation unavailable' });
  }
}