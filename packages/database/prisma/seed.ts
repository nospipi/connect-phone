import { faker } from "@faker-js/faker";
import { db } from "../src/index.ts";
import { Role } from "../src/index.ts";
import _ from "lodash";

//----------------------------------------------------------------

// model Organization {
//   id        Int      @id @default(autoincrement())
//   createdAt DateTime @default(now())
//   name      String
//   users     User[]
// }

// enum Role {
//   ADMIN
//   MODERATOR
//   VIEWER
//   CLIENT
// }

// model User {
//   id             Int           @id @default(autoincrement())
//   createdAt      DateTime      @default(now())
//   email          String        @unique
//   name           String?
//   role            Role
//   organizationId Int
//   organization   Organization  @relation(fields: [organizationId], references: [id])

//   @@index([organizationId])
// }

const main = async () => {
  try {
    const organizations = await db.organization.findMany();

    if (!organizations.length) {
      await db.organization.create({
        data: {
          name: faker.company.name(),
          users: {
            create: {
              name: faker.person.fullName(),
              email: faker.internet.email(),
              role: "ADMIN",
            },
          },
        },
      });
    }

    for (const i of Array.from({ length: 10 })) {
      const roles = ["VIEWER", "MODERATOR", "CLIENT"] as Role[];
      const randomRole = _.sample(roles);

      await db.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          organization: {
            connect: {
              id: 1,
            },
          },
          role: randomRole,
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
