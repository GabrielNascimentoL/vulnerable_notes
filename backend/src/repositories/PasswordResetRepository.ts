import { db } from "../database";
import { sql } from "drizzle-orm";
import { PasswordResetCode } from "../types/PasswordResetCode";

export async function createCode(userId: number, code: string): Promise<PasswordResetCode> {
  const result = await db.execute(
    sql`INSERT INTO password_reset_codes (user_id, code) VALUES (${userId}, ${code}) RETURNING *`,
  );
  return result.rows[0] as PasswordResetCode;
}

export async function findLatestByUserId(userId: number): Promise<PasswordResetCode> {
  const result = await db.execute(
    sql`SELECT * FROM password_reset_codes WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1`,
  );
  return result.rows[0] as PasswordResetCode;
}

export async function updatePassword(userId: number, hashedPassword: string): Promise<void> {
  await db.execute(sql`UPDATE users SET password = ${hashedPassword} WHERE id = ${userId}`);
}
