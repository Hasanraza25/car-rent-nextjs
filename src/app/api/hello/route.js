import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2021-08-31",
});

export const POST = async (req) => {
  const reqData = await req.json();
  const { categoryId } = reqData;

  if (!categoryId) {
    return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
  }

  try {
    console.log("Fetching cars with categoryId:", categoryId); // Debugging line

    // Fetch all cars with the given categoryId
    const cars = await client.fetch(
      `*[_type == "car" && references($categoryId)] { stock, _id }`, // Ensure to include _id
      { categoryId }
    );

    console.log("Fetched cars:", cars); // Debugging line

    // Calculate total stock
    const totalStock = cars.reduce((sum, car) => sum + (car.stock || 0), 0);

    console.log("Total stock calculated:", totalStock); // Debugging line

    // Fetch the actual category document by categoryId
    const category = await client.getDocument(categoryId);

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Update the category's totalStock field
    const updatedCategory = await client
      .patch(categoryId)
      .set({ totalStock })
      .commit();

    console.log("Updated category:", updatedCategory); // Debugging line

    return NextResponse.json({
      message: "Total stock updated successfully",
      updatedCategory,
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating total stock:", error); // More detailed logging
    return NextResponse.json(
      { error: "Failed to update total stock" },
      { status: 500 }
    );
  }
};
