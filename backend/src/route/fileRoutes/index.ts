import { Router } from "express";
import { processImageController } from "../../contorller/file.controller";
import upload from "../../config/multer";

const router = Router();

router.get('/health', (_, res) => {
  res.status(200).json({ message: 'Server is running' });
});

router.post('/process-image', upload.single('file'), processImageController);

export default router;