import { Router } from "express";
import * as ctrlUser from "../controllers/authController"

const router = Router()

router.post('/signup', ctrlUser.signUp)

router.post('/signin', ctrlUser.signIn)

export default router
