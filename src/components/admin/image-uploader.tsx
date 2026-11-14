"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import { getUploadSignature } from "@/app/admin/actions/misc";
import { cn } from "@/lib/utils";

export type UploadedImage = { src: string; publicId?: string; alt?: string; position?: string };

type ImageUploaderProps = {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder: "products" | "banners";
  max?: number;
  label?: string;
};

const MAX_BYTES = 8 * 1024 * 1024;

/** Uploads straight to Cloudinary (signed), then keeps the image URL. First image = main photo. */
export const ImageUploader = ({ images, onChange, folder, max = 8, label = "Photos" }: ImageUploaderProps) => {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  const upload = async (files: FileList) => {
    const room = max - images.length;
    const chosen = Array.from(files).slice(0, Math.max(0, room));
    if (chosen.length === 0) {
      toast.error(`You can add up to ${max} photos.`);
      return;
    }

    const signed = await getUploadSignature(folder);
    if (!signed.ok || !signed.data) {
      toast.error(signed.ok ? "Upload isn't available." : signed.message);
      return;
    }
    const { cloudName, apiKey, timestamp, signature, folder: target } = signed.data;

    setUploading((count) => count + chosen.length);
    const added: UploadedImage[] = [];
    for (const file of chosen) {
      try {
        if (!file.type.startsWith("image/")) throw new Error(`${file.name} isn't an image.`);
        if (file.size > MAX_BYTES) throw new Error(`${file.name} is over 8 MB.`);
        const body = new FormData();
        body.append("file", file);
        body.append("api_key", apiKey);
        body.append("timestamp", String(timestamp));
        body.append("signature", signature);
        body.append("folder", target);
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
        const json = (await response.json()) as { secure_url?: string; public_id?: string; error?: { message: string } };
        if (!response.ok || !json.secure_url) throw new Error(json.error?.message ?? "Upload failed.");
        added.push({ src: json.secure_url, publicId: json.public_id });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed.");
      } finally {
        setUploading((count) => count - 1);
      }
    }
    if (added.length > 0) onChange([...images, ...added]);
  };

  const move = (index: number, by: number) => {
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(index + by, 0, item);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-2">
      <span id={`${id}-label`} className="text-label font-semibold text-ink">
        {label} <span className="font-normal text-ink-muted">(first one is the main photo)</span>
      </span>
      <ul aria-labelledby={`${id}-label`} className="flex flex-wrap gap-2">
        {images.map((image, index) => (
          <li key={`${image.src}-${index}`} className="relative size-24 overflow-hidden rounded-md border border-border bg-media-frame">
            <Image src={image.src} alt="" fill sizes="96px" className="object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-chrome/70 p-0.5">
              <button
                type="button"
                aria-label="Move left"
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className="flex size-7 items-center justify-center text-on-chrome disabled:opacity-30"
              >
                <ArrowLeft aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => onChange(images.filter((_, position) => position !== index))}
                className="flex size-7 items-center justify-center text-on-chrome"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Move right"
                disabled={index === images.length - 1}
                onClick={() => move(index, 1)}
                className="flex size-7 items-center justify-center text-on-chrome disabled:opacity-30"
              >
                <ArrowRight aria-hidden="true" className="size-4" />
              </button>
            </div>
          </li>
        ))}
        {Array.from({ length: uploading }, (_, index) => (
          <li key={`uploading-${index}`} className="flex size-24 items-center justify-center rounded-md border border-border bg-media-frame">
            <Loader2 aria-label="Uploading" className="size-6 animate-spin text-ink-muted" />
          </li>
        ))}
        {images.length + uploading < max && (
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className={cn(
                "flex size-24 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-control text-small font-semibold text-ink-muted hover:border-brand-bright hover:text-brand-bright",
              )}
            >
              <ImagePlus aria-hidden="true" strokeWidth={1.5} className="size-6" />
              Add photo
            </button>
          </li>
        )}
      </ul>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          if (event.target.files?.length) void upload(event.target.files);
          event.target.value = "";
        }}
      />
    </div>
  );
};
