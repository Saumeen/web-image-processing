import { Router } from "express";
import { processImageController, processPDFController } from "../../contorller/file.controller";
import upload from "../../config/multer";

const router = Router();

router.get('/health', (_, res) => {
  res.status(200).json({ message: 'Server is running' });
});

router.post('/process-image', upload.single('file'), processImageController);

router.post('/process-pdf', upload.single('file'), processPDFController);


export default router;