import { defineType } from "sanity";

export default defineType({
  name: "reservation",
  title: "Reservation",
  type: "document",
  fields: [
    {
      name: "userId",
      title: "User ID",
      type: "string",
    },
    {
      name: "carId",
      title: "Car ID",
      type: "string",
    },
    {
      name: "carName",
      title: "Car Name",
      type: "string",
    },
    {
      name: "pickupLocation",
      title: "Pick-Up Location",
      type: "string",
    },
    {
      name: "dropoffLocation",
      title: "Drop-Off Location",
      type: "string",
    },
    {
      name: "pickupDate",
      title: "Pick-Up Date",
      type: "datetime",
    },
    {
      name: "dropoffDate",
      title: "Drop-Off Date",
      type: "datetime",
    },
    {
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
    },
    {
      name: "userName",
      title: "User Name",
      type: "string",
    },
    {
      name: "userPhone",
      title: "User Phone",
      type: "string",
    },
    {
      name: "userAddress",
      title: "User Address",
      type: "string",
    },
    {
      name: "userCity",
      title: "User City",
      type: "string",
    },
  ],
});