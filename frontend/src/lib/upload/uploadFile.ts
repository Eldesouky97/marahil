import { UPLOAD_RULES, type UploadFolder } from "./uploadConfig";

export class UploadError extends Error {
  constructor(public code: "too-large" | "invalid-type" | "upload-failed", message: string) {
    super(message);
  }
}

/**
 * Uploads any file to Cloudflare R2 via a presigned URL obtained from
 * /api/upload (the only server-side code in this project — see CLAUDE.md).
 * The file bytes go straight from the browser to R2, never through the
 * Vercel function, so there's no serverless body-size ceiling to worry
 * about. Per-folder size/type limits come from uploadConfig.ts — the real
 * enforcement is server-side in app/api/upload/route.ts, this is just an
 * early check to avoid a round-trip for an upload that would be rejected.
 */
function putWithProgress(uploadUrl: string, file: File, onProgress?: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new UploadError("upload-failed", "Upload to storage failed"));
    };
    xhr.onerror = () => reject(new UploadError("upload-failed", "Upload to storage failed"));
    xhr.send(file);
  });
}

export async function uploadFile(
  file: File,
  folder: UploadFolder,
  idToken: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const rules = UPLOAD_RULES[folder];
  if (!rules.contentTypes.includes(file.type)) {
    throw new UploadError("invalid-type", `Unsupported file type: ${file.type}`);
  }
  if (file.size > rules.maxBytes) {
    throw new UploadError("too-large", `File is larger than ${rules.maxBytes / 1024 / 1024}MB`);
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

  await putWithProgress(uploadUrl, file, onProgress);

  return publicUrl;
}
