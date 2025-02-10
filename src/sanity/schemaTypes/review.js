import { defineType } from "sanity";

export default defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    {
      name: "carId",
      title: "Car ID",
      type: "string",
    },
    {
      name: "userId",
      title: "User ID",
      type: "string",
    },
    {
      name: "userName",
      title: "User Name",
      type: "string",
    },
    {
      name: "userImage",
      title: "User Image",
      type: "url", 
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      options: {
        list: [1, 2, 3, 4, 5],
      },
    },
    {
      name: "reviewText",
      title: "Review Text",
      type: "text",
    },
    {
      name: "date",
      title: "Review Date",
      type: "datetime",
    },
  ],
});