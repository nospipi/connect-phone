import { db } from ".";
import { User } from ".";

export async function getUsers(): Promise<User[]> {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error: unknown) {
    throw new Error(error as any);
  }
}
