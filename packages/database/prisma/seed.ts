import { faker } from "@faker-js/faker";
import { db } from "../src/index.ts";

//----------------------------------------------------------------

const main = async () => {
  try {
    for (const i of Array.from({ length: 10 })) {
      await db.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
        },
      });
    }

    await db.$disconnect();
  } catch (e) {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
};

main();

//npx prisma db seed
//npx prisma studio
//npx prisma migrate dev
