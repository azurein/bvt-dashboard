import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosError } from 'axios';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const path = req.nextUrl.searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`;

  try {
    const response = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('authorization') || '',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API call failed:', (error as AxiosError).response?.data || error.message);
      return NextResponse.json((error as AxiosError).response?.data || { error: 'Unknown error' }, { status: (error as AxiosError).response?.status || 500 });
    } else {
      console.error('Internal server error:', (error as Error).message);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`;

  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: req.headers.get('authorization') || '',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API call failed:', (error as AxiosError).response?.data || error.message);
      return NextResponse.json((error as AxiosError).response?.data || { error: 'Unknown error' }, { status: (error as AxiosError).response?.status || 500 });
    } else {
      console.error('Internal server error:', (error as Error).message);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
}
