import { Router } from "express";
import {
  fetchPresignedURLController,
  fetchUsersAllOutputFiles,
} from "../controllers";

const router = Router();

router.post("/", fetchPresignedURLController);
router.get("/", fetchUsersAllOutputFiles);

export default router;
