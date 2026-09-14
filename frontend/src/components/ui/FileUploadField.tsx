"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { uploadFile, UploadError } from "@/lib/upload/uploadFile";
import type { UploadFolder } from "@/lib/upload/uploadConfig";
import { Spinner } from "@/components/ui/Spinner";

export function FileUploadField({
  folder,
  onUploaded,
}: {
  folder: UploadFolder;
  onUploaded: (file: { name: string; url: string; sizeBytes: number }) => void;
}) {
  const { firebaseUser } = useAuth();
  const t = useTranslations("common.imageUpload");

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !firebaseUser) return;

    setError(null);
    setUploading(true);
    try {
      const idToken = await firebaseUser.getIdToken();
      const url = await uploadFile(file, folder, idToken);
      onUploaded({ name: file.name, url, sizeBytes: file.size });
    } catch (err) {
      if (err instanceof UploadError && err.code === "too-large") setError(t("tooLarge"));
      else if (err instanceof UploadError && err.code === "invalid-type") setError(t("invalidType"));
      else setError(t("failed"));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border-strong px-4 py-2 text-sm text-body hover:border-accent/60">
        {uploading ? <Spinner /> : <FileText size={16} />}
        {t("choose")}
        <input type="file" className="hidden" onChange={handleChange} disabled={uploading} />
      </label>
      {error && <p className="mt-1 text-xs text-danger-ink">{error}</p>}
    </div>
  );
}
