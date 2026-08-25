import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";
import { AppError } from "../errors/AppError";
import * as NoteService from "../services/NoteService";

export const list = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const notes = await NoteService.listNotes(req.user!.id);
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const note = await NoteService.getNote(Number(req.params.id));
    return res.status(200).json(note);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const { title, body, user_id } = req.body;
  const userId = user_id ?? req.user!.id;

  try {
    const note = await NoteService.createNote(title, body, userId);
    return res.status(201).json(note);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const update = async (req: AuthenticatedRequest, res: Response) => {
  const { title, body } = req.body;

  try {
    const note = await NoteService.updateNote(Number(req.params.id), title, body);
    return res.status(200).json(note);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const remove = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await NoteService.deleteNote(Number(req.params.id));
    return res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
