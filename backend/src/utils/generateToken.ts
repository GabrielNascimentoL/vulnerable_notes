import jwt from "jsonwebtoken";

const JWT_SECRET = "secret123";   

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET);   
}