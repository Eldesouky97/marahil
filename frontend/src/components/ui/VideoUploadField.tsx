"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthProvider";
import { uploadFile, UploadError } from "@/lib/upload/uploadFile";
import type { UploadFolder } from "@/lib/upload/uploadConfig";
import { Spinner } from "@/components/ui/Spinner";

export function VideoUploadField({
  folder,
  currentUrl,
  onUploaded,
}: {
  folder: UploadFolder;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}) {
  const { firebaseUser } = useAuth();
  const t = useTranslations("common.videoUpload");

  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !firebaseUser) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    setProgress(0);
    try {
      const idToken = await firebaseUser.getIdToken();
      const url = await uploadFile(file, folder, idToken, setProgress);
      onUploaded(url);
    } catch (err) {
      if (err instanceof UploadError && err.code === "too-large") setError(t("tooLarge"));
      else if (err instanceof UploadError && err.code === "invalid-type") setError(t("invalidType"));
      else setError(t("failed"));
      setPreview(currentUrl);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="space-y-2">
      {preview && <video src={preview} controls className="h-32 w-full max-w-xs rounded-lg bg-surface-2 object-cover" />}
      <div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-strong px-4 py-2 text-sm text-body hover:border-accent/60">
          {uploading ? <Spinner /> : t("choose")}
          <input type="file" accept="video/*" className="hidden" onChange={handleChange} disabled={uploading} />
        </label>
        {uploading && (
          <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        {error && <p className="mt-1 text-xs text-danger-ink">{error}</p>}
      </div>
    </div>
  );
}
