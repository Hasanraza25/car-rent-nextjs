import { defineType } from "sanity";

const user = {
  name: "user",
  title: "User",
  type: "document",
  fields: defineType([
    {
      name: "name",
      title: "Name",
      type: "string",
    },
    {
      name: "email",
      title: "Email",
      type: "string",
    },
    {
      name: "password",
      title: "Password",
      type: "string",
    },
    {
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm:ss",
      },
    },
    {
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      options: {
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm:ss",
      },
    },
  ]),
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
};

export default user;
