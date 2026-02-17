import { Router } from "express";
import { postChat } from "../controllers/chat.controller.mjs";

const router = Router();

router.post("/chat", postChat);

export default router;