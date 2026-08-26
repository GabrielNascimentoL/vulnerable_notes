import {Router} from "express";
import { login, register } from "../controllers/AuthController";
import { request, confirm } from "../controllers/PasswordResetController";

const authRoutes = Router()

authRoutes.post("/register", register)
authRoutes.post("/login", login)
authRoutes.post("/recover-password", request)
authRoutes.post("/recover-password/confirm", confirm)


export default authRoutes;