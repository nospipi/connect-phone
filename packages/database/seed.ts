import { seed, reset } from "drizzle-seed";
import {
  db,
  users,
  organizations,
  usersInOrganizations,
  salesChannels,
  offers,
  offerImages,
  offerPrices,
  salesChannelImages,
} from "./src/index";
import { faker } from "@faker-js/faker";

const main = async () => {
  try {
    console.log("Resetting database...");
    await reset(db, {
      organizations,
      users,
      usersInOrganizations,
      salesChannels,
      offers,
    });

    console.log("Seeding database...");
    await seed(db, {
      organizations,
      users,
      usersInOrganizations,
      salesChannels,
      offers,
      offerImages,
      offerPrices,
      salesChannelImages,
    }).refine((f) => ({
      offers: {
        columns: {
          dataAmountInGb: f.number({ minValue: 1, maxValue: 100 }),
          talkTimeInMinutes: f.int({ minValue: 1, maxValue: 1000 }),
        },
      },
      offerPrices: {
        columns: {
          price: f.number({ minValue: 0.01, maxValue: 200 }),
          currency: f.valuesFromArray({
            values: ["EUR", "USD", "GBP"],
          }),
        },
      },
      offerImages: {
        columns: {
          url: f.default({
            defaultValue: faker.image.urlPicsumPhotos({
              width: 128,
              height: 128,
              blur: 0,
            }),
          }),
          description: f.default({
            defaultValue: faker.commerce.productDescription(),
          }),
        },
      },
      salesChannelImages: {
        columns: {
          url: f.default({
            defaultValue: faker.image.urlPicsumPhotos({
              width: 128,
              height: 128,
              blur: 0,
            }),
          }),
          description: f.default({
            defaultValue: faker.commerce.productDescription(),
          }),
        },
      },
    }));

    console.log("Database reset and seed completed successfully!");
  } catch (error) {
    console.error("Error during database operation:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

main();
