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
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2021-08-31",
});

async function uploadImageToSanity(imageUrl) {
  try {
    console.log(`Uploading image: ${imageUrl}`);
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);
    const asset = await client.assets.upload("image", buffer, {
      filename: imageUrl.split("/").pop(),
    });
    console.log(`Image uploaded successfully: ${asset._id}`);
    return asset._id;
  } catch (error) {
    console.error("Failed to upload image:", imageUrl, error);
    return null;
  }
}

async function importData() {
  try {
    console.log("Fetching products from API...");
    const response = await axios.get(
      "https://6787d134c4a42c9161085f07.mockapi.io/api/car-rental-marketplace/products"
    );
    const products = response.data;

    console.log(`Fetched ${products.length} products`);
    for (const product of products) {
      console.log(`Processing product: ${product.name}`);
      let imageRef = null;
      if (product.image) {
        imageRef = await uploadImageToSanity(product.image);
      }
      const sanityProduct = {
        _type: "car",
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock || 0,
        image: imageRef
          ? {
              _type: "image",
              asset: {
                _type: "reference",
                _ref: imageRef,
              },
            }
          : undefined,
        discount: product.discount || "0%",
        steering: product.steering || "Unknown",
        fuelCapacity: product.fuelCapacity || 0,
        seatingCapacity: product.seatingCapacity || 0,
        id: product.id,
        type: product.type || "Unknown",
        section: product.section || [],
      };

      console.log("Uploading product to Sanity:", sanityProduct.name);
      const result = await client.create(sanityProduct);
      console.log(`Product uploaded successfully: ${result._id}`);
    }
    console.log("Data import completed successfully!");
  } catch (error) {
    console.error("Error importing data:", error);
  }
}

importData();
