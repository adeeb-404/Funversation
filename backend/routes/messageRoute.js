import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage, allMessages } from "../controllers/messageController.js";

const router = Router();

router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);

export default router;
