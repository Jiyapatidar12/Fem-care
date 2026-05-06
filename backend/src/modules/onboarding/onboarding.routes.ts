import { Router } from "express";
import authMiddleware from "../../middlewares/auth";
import { createOnboarding, getOnboarding, updateOnboarding } from "./onboarding.controller";

const router = Router();

router.post("/", authMiddleware, createOnboarding);
router.get("/", authMiddleware, getOnboarding);
router.put("/", authMiddleware, updateOnboarding);

export default router;
