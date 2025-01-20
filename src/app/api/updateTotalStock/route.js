import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2021-08-31",
});

export const POST = async (req, res) => {
  try {
    const body = await req.json();
    console.log('Request body:', body);

    // Ensure the webhook is triggered by changes to "car" documents
    if (!body || body._type !== 'car') {
      console.log('Not a car document or body is undefined');
      return res.status(400).json({ message: 'Not a car document or body is undefined' });
    }

    const { type, stock } = body;
    console.log('Car type:', type, 'Stock:', stock);

    // Ensure the car has a valid category reference and stock value
    if (!type?._ref || stock === undefined) {
      console.log('Invalid car data');
      return res.status(400).json({ message: 'Invalid car data' });
    }

    const categoryId = type._ref;
    console.log('Category ID:', categoryId);

    // Fetch all cars linked to this category
    const carsInCategory = await client.fetch(
      `*[_type == "car" && references($categoryId)]`,
      { categoryId }
    );
    console.log('Cars in category:', carsInCategory);

    // Calculate total stock for the category
    const totalStock = carsInCategory.reduce(
      (sum, car) => sum + (car.stock || 0),
      0
    );
    console.log('Total stock:', totalStock);

    // Update the category with the new total stock
    await client
      .patch(categoryId)
      .set({ totalStock })
      .commit();

    console.log('Category total stock updated successfully');
    return res.status(200).json({ message: 'Category total stock updated successfully' });
  } catch (error) {
    console.error('Error updating category stock:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};