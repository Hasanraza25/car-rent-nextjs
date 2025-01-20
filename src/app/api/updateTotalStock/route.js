const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2021-08-31',
});

const handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { body } = req;

  // Ensure the webhook is triggered by changes to "car" documents
  if (body._type !== 'car') {
    return res.status(400).json({ message: 'Not a car document' });
  }

  try {
    const { type, stock } = body;

    // Ensure the car has a valid category reference and stock value
    if (!type?._ref || stock === undefined) {
      return res.status(400).json({ message: 'Invalid car data' });
    }

    const categoryId = type._ref;

    // Fetch all cars linked to this category
    const carsInCategory = await client.fetch(
      `*[_type == "car" && references($categoryId)]`,
      { categoryId }
    );

    // Calculate total stock for the category
    const totalStock = carsInCategory.reduce(
      (sum, car) => sum + (car.stock || 0),
      0
    );

    // Update the category with the new total stock
    await client
      .patch(categoryId)
      .set({ totalStock })
      .commit();

    res.status(200).json({ message: 'Category total stock updated successfully' });
  } catch (error) {
    console.error('Error updating category stock:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = handler;