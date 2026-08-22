import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/AuthService";
import { AppError } from "../errors/AppError";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await registerUser(email, password);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const user = await loginUser(email, password);
      return res.status(200).json(user);
    } catch (error) {
       if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
    }


    
}