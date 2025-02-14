import { createClient } from "@sanity/client";
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

async function deleteAllLocations() {
  try {
    const query = '*[_type == "location"]';
    const locations = await client.fetch(query);

    if (locations.length === 0) {
      console.log("No locations found to delete.");
      return;
    }

    console.log(`Found ${locations.length} locations. Deleting...`);

    const transaction = client.transaction();

    locations.forEach((location) => {
      transaction.delete(location._id);
    });

    await transaction.commit();
    console.log("All locations deleted successfully!");
  } catch (error) {
    console.error("Error deleting locations:", error);
  }
}

deleteAllLocations();
