import { Router } from "express";
import authRoutes from "./auth.routes";
import noteRoutes from "./note.routes";


const appRoutes = Router();

appRoutes.use("/auth", authRoutes)
appRoutes.use("/notes", noteRoutes)

export default appRoutes;

