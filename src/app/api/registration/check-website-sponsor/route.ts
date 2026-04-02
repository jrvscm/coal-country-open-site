import { NextResponse } from 'next/server';
import { getProductAvailabilitySnapshot } from '@/lib/registration-product-availability';

export async function GET() {
  try {
    const availability = await getProductAvailabilitySnapshot();
    const taken = availability.websiteSponsorship?.soldOut ?? false;
    return NextResponse.json({ taken });
  } catch (error) {
    console.error('Error checking website sponsorship:', error);
    return NextResponse.json({ error: 'Failed to check status', taken: false }, { status: 500 });
  }
}
