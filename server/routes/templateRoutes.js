import express from "express";
import multer from "multer";
import path from "path";

import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  downloadTemplate,
  deleteTemplate,
} from "../controllers/templateController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
});
// Template routes
router.post("/upload-image", upload.single("image"), (req, res) => {
  console.log("I ran");
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    // imageUrl: `http://localhost:8800/uploads/${req.file.filename}`,
    imageUrl: `https://email-builder-h1mi.onrender.com/uploads/${req.file.filename}`,
    message: "File uploaded successfully",
  });
});

router.get("/templates", getTemplates);
router.get("/templates/:id", getTemplateById);
router.post("/templates", createTemplate);
router.put("/templates/:id", updateTemplate);
router.delete("/templates/:id", deleteTemplate);
router.get("/templates/:id/download", downloadTemplate);

export default router;
