"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthProvider";
import { uploadImage, UploadError, type UploadFolder } from "@/lib/upload/uploadImage";
import { Spinner } from "@/components/ui/Spinner";

export function ImageUploadField({
  folder,
  currentUrl,
  onUploaded,
}: {
  folder: UploadFolder;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}) {
  const { firebaseUser } = useAuth();
  const t = useTranslations("common.imageUpload");

  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !firebaseUser) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const url = await uploadImage(file, folder, idToken);
      onUploaded(url);
    } catch (err) {
      if (err instanceof UploadError && err.code === "too-large") setError(t("tooLarge"));
      else if (err instanceof UploadError && err.code === "invalid-type") setError(t("invalidType"));
      else setError(t("failed"));
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      {preview && (
        // eslint-disable-next-line @next/next/no-img-element -- transient blob: preview URLs and arbitrary R2 URLs, next/image can't optimize either
        <img src={preview} alt="" className="h-16 w-16 rounded-lg object-cover" />
      )}
      <div>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-strong px-4 py-2 text-sm text-body hover:border-accent/60">
          {uploading ? <Spinner /> : t("choose")}
          <input type="file" accept="image/*" className="hidden" onChange={handleChange} disabled={uploading} />
        </label>
        {error && <p className="mt-1 text-xs text-danger-ink">{error}</p>}
      </div>
    </div>
  );
}
