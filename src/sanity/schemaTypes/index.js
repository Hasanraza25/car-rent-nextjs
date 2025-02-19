import car from "./car";
import categories from "./categories";
import location from "./location";
import reservation from "./reservation";
import review from "./review";
import user from "./user";
import { account, verificationToken } from "next-auth-sanity/schemas";
export const schema = {
  types: [
    car,
    categories,
    reservation,
    review,
    location,
    user,
    account,
    verificationToken,
  ],
};
