import { uploadFile } from "./uploadFile";
import type { UploadFolder } from "./uploadConfig";

export type { UploadFolder } from "./uploadConfig";
export { UploadError } from "./uploadFile";

/**
 * Uploads an image to Cloudflare R2 via a presigned URL obtained from
 * /api/upload (the only server-side code in this project — see CLAUDE.md).
 * Thin, image-specific-named wrapper kept for every existing caller
 * (ImageUploadField.tsx) — see uploadFile() for the generic version used by
 * non-image uploads (course materials).
 */
export async function uploadImage(file: File, folder: UploadFolder, idToken: string): Promise<string> {
  return uploadFile(file, folder, idToken);
}
