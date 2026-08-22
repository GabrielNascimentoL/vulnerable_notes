import { db } from "../database";
import {sql} from "drizzle-orm"
import { User } from "../types/User";

export async function findUserByEmail(email: string){
    const result = await db.execute(sql`SELECT * FROM users WHERE email = ${email}`);
    return result.rows[0];
}

export async function createUser(email: string, password: string) : Promise<User>{
   const result = await db.execute(sql`INSERT INTO users (email, password) VALUES (${email}, ${password}) RETURNING * `);

  return result.rows[0] as User
}