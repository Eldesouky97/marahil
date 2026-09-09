const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type UploadFolder = "avatars" | "course-covers" | "lesson-images";

export class UploadError extends Error {
  constructor(public code: "too-large" | "invalid-type" | "upload-failed", message: string) {
    super(message);
  }
}

/**
 * Uploads an image to Cloudflare R2 via a presigned URL obtained from
 * /api/upload (the only server-side code in this project — see CLAUDE.md).
 * The file bytes go straight from the browser to R2, never through the
 * Vercel function, so there's no serverless body-size ceiling to worry about.
 */
export async function uploadImage(file: File, folder: UploadFolder, idToken: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new UploadError("invalid-type", `Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadError("too-large", `File is larger than ${MAX_SIZE_BYTES / 1024 / 1024}MB`);
  }

  const presignRes = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken, folder, fileName: file.name, contentType: file.type }),
  });
  if (!presignRes.ok) {
    throw new UploadError("upload-failed", "Could not get an upload URL");
  }
  const { uploadUrl, publicUrl } = await presignRes.json();

  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putRes.ok) {
    throw new UploadError("upload-failed", "Upload to storage failed");
  }

  return publicUrl;
}
