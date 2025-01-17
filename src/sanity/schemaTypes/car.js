import { defineField, defineType } from "sanity";

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
      title: "Type",
      type: "string",
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
      type: "image", // Correctly defines the field as an image type
      options: {
        hotspot: true, // Optional, enables image cropping in the Sanity Studio
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
});
