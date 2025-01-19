import { defineField, defineType } from "sanity";
import { client } from "sanity"; // Ensure this import is present

export default defineType({
  name: "car",
  title: "Car",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
      },
    }),
    defineField({
      name: "type",
      type: "reference",
      title: "Type",
      to: [{ type: "categories" }], // Reference to the categories schema
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
    }),
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "discount",
      title: "Discount",
      type: "string",
    }),
    defineField({
      name: "section",
      title: "Section",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Popular Cars", value: "popular" },
          { title: "Recent Cars", value: "recent" },
          { title: "Recommended Cars", value: "recommended" },
        ],
      },
    }),
    defineField({
      name: "steering",
      title: "Steering",
      type: "string",
    }),
    defineField({
      name: "fuelCapacity",
      title: "Fuel Capacity",
      type: "number",
    }),
    defineField({
      name: "seatingCapacity",
      title: "Seating Capacity",
      type: "number",
    }),
    defineField({
      name: "id",
      title: "ID",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],

  // Update the category's total stock when a car is added or modified
  documentActions: [
    async (prevContext) => {
      const { document } = prevContext;

      // Check if the document is a car and if stock is modified
      if (document._type === "car" && document.stock && document.type._ref) {
        const categoryId = document.type._ref;

        // Fetch all cars related to this category
        const carsInCategory = await client.fetch(
          `*[_type == "car" && references($categoryId)]`,
          { categoryId }
        );

        // Calculate the total stock
        const totalStock = carsInCategory.reduce(
          (sum, car) => sum + (car.stock || 0),
          0
        );

        // Ensure the category's totalStock is updated
        await client
          .patch(categoryId) // Specify the category document ID
          .set({ totalStock: totalStock }) // Set the new total stock value
          .commit();

        // Return the updated context after mutation
        return [
          ...prevContext,
          {
            title: "Total Stock Updated",
            message: `Total stock for category updated to ${totalStock}`,
          },
        ];
      }

      return prevContext;
    },
  ],
});
