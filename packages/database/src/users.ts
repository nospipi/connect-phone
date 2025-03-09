import { db } from ".";
import { User } from ".";

//----------------------------------------------------------------

export async function getUsers(): Promise<User[]> {
  try {
    const users = await db.user.findMany({
      orderBy: { id: "desc" },
    });
    return users;
  } catch (error: unknown) {
    throw new Error(error as any);
  }
}

export async function getUser(id: number): Promise<User | null> {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error: unknown) {
    throw new Error(error as any);
  }
}

// export async function getUserByEmail(email: string): Promise<User | null> {
//   try {
//     const user = await db.user.findUnique({
//       where: { email },
//     });
//     return user;
//   } catch (error: unknown) {
//     throw new Error(error as any);
//   }
// }

export async function createUser(data: User): Promise<User> {
  try {
    const user = await db.user.create({ data });
    return user;
  } catch (error: unknown) {
    throw new Error(error as any);
  }
}
