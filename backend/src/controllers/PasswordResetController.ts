import { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { requestPasswordReset, confirmPasswordReset } from "../services/PasswordResetService";

export const request = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await requestPasswordReset(email);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const confirm = async (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  try {
    const result = await confirmPasswordReset(email, code, newPassword);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
