export type UploadFolder = "avatars" | "course-covers" | "lesson-images" | "course-materials";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MATERIAL_TYPES = [
  ...IMAGE_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
];

/**
 * Single source of truth for what each upload folder accepts, imported by
 * both the browser (lib/upload/uploadImage.ts, uploadFile.ts) and the only
 * server-side route in this project (app/api/upload/route.ts) — the server
 * copy is the one that actually matters for security, the client copy just
 * avoids a round-trip for an upload that's going to be rejected anyway.
 */
export const UPLOAD_RULES: Record<UploadFolder, { maxBytes: number; contentTypes: string[] }> = {
  avatars: { maxBytes: 5 * 1024 * 1024, contentTypes: IMAGE_TYPES },
  "course-covers": { maxBytes: 5 * 1024 * 1024, contentTypes: IMAGE_TYPES },
  "lesson-images": { maxBytes: 5 * 1024 * 1024, contentTypes: IMAGE_TYPES },
  "course-materials": { maxBytes: 20 * 1024 * 1024, contentTypes: MATERIAL_TYPES },
};

export const UPLOAD_FOLDERS = Object.keys(UPLOAD_RULES) as UploadFolder[];
