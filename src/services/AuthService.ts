import { AppError } from "../errors/AppError";
import { createUser, findUserByEmail } from "../repositories/AuthRepository";
import crypto from "crypto";
import { generateToken } from "../utils/generateToken";

export async function registerUser(email: string, password: string) {
    const userAlreadyExists = await findUserByEmail(email);

    if (userAlreadyExists){
        throw new AppError("User already exists.", 409);
    }

    const hashedPassword = crypto.createHash("md5").update(password).digest("hex");

    const user = await createUser(email, hashedPassword);

    const token = generateToken(user.id!)

    const {password: _, ...safeUser} = user;
    
    return {safeUser, token};

}
