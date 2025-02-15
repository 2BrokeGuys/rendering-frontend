import { Router } from "express";
import { fetchPresignedURLController } from "../controllers";

const router = Router();

router.post("/", fetchPresignedURLController);

export default router;
