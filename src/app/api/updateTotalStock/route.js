import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN, // Ensure the token has write permissions
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { categoryId } = req.body;

      // Fetch all cars with the given categoryId
      const cars = await client.fetch(
        `*[_type == "car" && references($categoryId)] { stock }`,
        { categoryId }
      );

      // Calculate the total stock
      const totalStock = cars.reduce((sum, car) => sum + (car.stock || 0), 0);

      // Update the totalStock field in the category
      await client.patch(categoryId).set({ totalStock }).commit();

      res.status(200).json({ message: 'Total stock updated successfully' });
    } catch (error) {
      console.error('Error updating total stock:', error);
      res.status(500).json({ error: 'Failed to update total stock' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
