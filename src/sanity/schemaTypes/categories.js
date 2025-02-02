import { defineField, defineType } from "sanity";

export default defineType({
  name: "categories",
  type: "document",
  title: "Categories",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Category Name",
      validation: (Rule) => Rule.required().min(3).max(50),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
      },
    },
    {
      name: "description",
      type: "text",
      title: "Category Description",
      validation: (Rule) => Rule.max(200),
    },
    defineField({
      name: "totalStock",
      type: "number",
      title: "Total Stock",
      description:
        "Automatically calculated total stock of all cars in this category.",
      readOnly: true,
      options: {
        isHighlighted: true,
      },
    }),
  ],
});
