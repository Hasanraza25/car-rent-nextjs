import { createClient } from "@sanity/client";
import axios from "axios";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  apiVersion: "2021-08-31",
});

async function fetchCities() {
  const username = process.env.GEONAMES_USERNAME;
  const response = await axios.get(
    `http://api.geonames.org/searchJSON?country=US&maxRows=1000&username=${username}&featureClass=P`
  );
  return response.data.geonames.map((city) => city.name);
}

async function fetchLocation(city) {
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?city=${city}&country=USA&format=json&limit=1`
  );
  if (response.data.length > 0) {
    const location = response.data[0];
    const detailedLocationResponse = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lon}&zoom=18&addressdetails=1`
    );
    const detailedLocation = detailedLocationResponse.data;
    return {
      city,
      locationName: detailedLocation.display_name,
      address: detailedLocation.display_name,
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lon),
    };
  } else {
    throw new Error(`No location found for city: ${city}`);
  }
}

async function storeLocation(locationData) {
  await client.create({
    _type: "location",
    ...locationData,
  });
}

async function importData() {
  try {
    console.log("Fetching cities from Geonames...");
    const cities = await fetchCities();
    console.log(`Fetched ${cities.length} cities`);

    for (const city of cities) {
      try {
        console.log(`Fetching location for city: ${city}`);
        const locationData = await fetchLocation(city);
        await storeLocation(locationData);
        console.log(`Stored location for city: ${city}`);
      } catch (error) {
        console.error(`Error fetching/storing location for city: ${city}`, error);
      }
    }

    console.log("Data import completed successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
  }
}

importData();