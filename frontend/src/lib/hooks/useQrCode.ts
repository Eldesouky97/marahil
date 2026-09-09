"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function useQrCode(text: string) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(text, { margin: 1, width: 160, color: { dark: "#2B2013", light: "#00000000" } }).then(
      (url) => {
        if (!cancelled) setDataUrl(url);
      }
    );
    return () => {
      cancelled = true;
    };
  }, [text]);

  return dataUrl;
}
