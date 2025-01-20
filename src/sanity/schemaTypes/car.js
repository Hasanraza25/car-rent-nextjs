import { defineField, defineType } from "sanity";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2021-08-31",
});

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
});
