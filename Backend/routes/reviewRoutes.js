import express from "express";
import multer from "multer";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import prisma from "../config/prismaConfig.js";

const router = express.Router();

function normalizeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value
    )
  );
}

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local uploads folder setup
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ----------- POST /api/reviews ------------
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const body = req.body;
    console.log("Received body:", body);

    // Parse reason_ids safely
    const reasonIds = JSON.parse(body.reason_ids || "[]");

    const lat = parseFloat(body.latitude);
    const lon = parseFloat(body.longitude);
    const address = body.address;

    // ✅ Step 1: Find or create toilet entry
    let toilet = await prisma.toilets.findFirst({
      where: {
        latitude: lat,
        longitude: lon,
      },
    });

    if (!toilet) {
      toilet = await prisma.toilets.create({
        data: {
          latitude: lat,
          longitude: lon,
          address: address,
          location_name: address, // Optional
        },
      });
    }

    // ✅ Step 2: Create the review with toilet_id
    const review = await prisma.reviews.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        rating: parseFloat(body.rating),
        reason_ids: reasonIds,
        description: body.description || "",
        toilet_id: toilet.id,
        images: req.files?.map((file) => `/uploads/${file.filename}`) || [],
      },
    });

    console.log("Review created:", review);
    res.status(201).json({ success: true, data: normalizeBigInt(review) });
  } catch (error) {
    console.error("Review creation failed:", error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// ----------- GET /api/reviews ------------
router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.reviews.findMany({
      orderBy: { created_at: "desc" },
    });

    res.json({ success: true, data: normalizeBigInt(reviews) }); // ✅ FIX HERE
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});

export default router;
