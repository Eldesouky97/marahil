import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_FOLDERS = ["avatars", "course-covers", "lesson-images"] as const;
type Folder = (typeof ALLOWED_FOLDERS)[number];

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

/**
 * Verifies a Firebase ID token via Firebase's own public Identity Toolkit
 * REST endpoint instead of the Admin SDK — this project deliberately has no
 * service account (see CLAUDE.md), so this is the only way to check "is this
 * a real signed-in user" from server-side code.
 */
async function verifyIdToken(idToken: string): Promise<string | null> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.users?.[0]?.localId ?? null;
}

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, "_").slice(-100);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { idToken, folder, fileName, contentType } = body ?? {};

  if (typeof idToken !== "string" || !idToken) {
    return NextResponse.json({ error: "Missing idToken" }, { status: 401 });
  }
  const uid = await verifyIdToken(idToken);
  if (!uid) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (typeof fileName !== "string" || !fileName) {
    return NextResponse.json({ error: "Missing fileName" }, { status: 400 });
  }

  const key = `${folder as Folder}/${uid}/${Date.now()}-${sanitizeFileName(fileName)}`;

  const uploadUrl = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 300 }
  );

  const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl });
}
