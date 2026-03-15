import { NextResponse } from 'next/server';
import { getProductAvailabilitySnapshot } from '@/lib/registration-product-availability';

export async function GET() {
  try {
    const availability = await getProductAvailabilitySnapshot();
    return NextResponse.json({ products: availability });
  } catch (error) {
    console.error('Error checking product availability:', error);
    return NextResponse.json({ error: 'Failed to check product availability' }, { status: 500 });
  }
}
