import { defineType } from "sanity";

export default defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    {
      name: "city",
      title: "City",
      type: "string",
    },
    {
      name: "locationName",
      title: "Location Name",
      type: "string",
    },
    {
      name: "address",
      title: "Address",
      type: "string",
    },
    {
      name: "latitude",
      title: "Latitude",
      type: "number",
    },
    {
      name: "longitude",
      title: "Longitude",
      type: "number",
    },
  ],
});