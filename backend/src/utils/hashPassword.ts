import crypto from "crypto";

export async function hashPassword(password: string) {
  const hashedPassword = crypto
    .createHash("md5")
    .update(password)
    .digest("hex");

  return hashedPassword;
}
