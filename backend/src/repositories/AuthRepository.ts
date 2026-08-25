import { db } from "../database";
import { sql } from "drizzle-orm";
import { User } from "../types/User";
import { hashPassword } from "../utils/hashPassword";

export async function findUserByEmail(email: string): Promise<User> {
  const result = await db.execute(
    sql`SELECT id, email, created_at FROM users WHERE email = ${email}`,
  );
  return result.rows[0] as Omit<User, "password">;
}

export async function createUser(
  email: string,
  password: string,
): Promise<User> {
  const result = await db.execute(
    sql`INSERT INTO users (email, password) VALUES (${email}, ${password}) RETURNING * `,
  );

  const user: User = {
    id: result.rows[0].id as number,
    email: result.rows[0].email as string,
    created_at: result.rows[0].created_at as string,
  };

  return user;
}

export async function getPasswordHashByEmail(email: string): Promise<string | undefined> {
  const result = await db.execute(
    sql`SELECT password FROM users WHERE email = ${email}`,
  );

  return result.rows[0]?.password as string | undefined;
}
