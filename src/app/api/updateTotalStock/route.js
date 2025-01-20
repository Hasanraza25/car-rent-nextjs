import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2021-08-31",
});

export default async function POST(req, res) {
  if (req.method === "POST") {
    const { categoryId } = req.body;

    if (!categoryId) {
      return res.status(400).json({ error: "Missing categoryId" });
    }

    try {
      // Fetch all cars with the given categoryId
      const cars = await client.fetch(
        `*[_type == "car" && references($categoryId)] { stock }`,
        { categoryId }
      );

      // Calculate total stock
      const totalStock = cars.reduce((sum, car) => sum + (car.stock || 0), 0);

      // Update the category's totalStock field
      const updatedCategory = await client
        .patch(categoryId)
        .set({ totalStock })
        .commit();

      res.status(200).json({
        message: "Total stock updated successfully",
        updatedCategory,
      });
    } catch (error) {
      console.error("Error updating total stock:", error);
      res.status(500).json({ error: "Failed to update total stock" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
