import { NextResponse } from "next/server";

export async function POST() {
  const username = process.env.GEONAMES_USERNAME;

  try {
    const response = await fetch(
      `http://api.geonames.org/searchJSON?country=US&maxRows=1000&username=${username}&featureClass=P`
    );
    const data = await response.json();
    const cities = data.geonames.map((city) => city.name);
    return NextResponse.json(cities, { status: 200 });
  } catch (err) {
    console.error("Error fetching cities:", error);
    return NextResponse.json(
      { error: "Failed to fetch cities." },
      { status: 500 }
    );
  }
}


