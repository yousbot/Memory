import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

// Set up Multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();

  const files = formData.getAll("images") as File[];
  const filePaths: string[] = [];

  for (const file of files) {
    if (file instanceof Blob) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filePath = path.join(process.cwd(), "public/uploads", file.name);
      await fs.writeFile(filePath, buffer);
      filePaths.push(`/uploads/${file.name}`);
    }
  }

  return NextResponse.json({ filePaths });
};
