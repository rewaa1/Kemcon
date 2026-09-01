"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload, X } from "lucide-react";

/**
 * The reference-photo picker shared by every enquiry form.
 *
 * Owns its own drag counter and file input so a form only has to hold the
 * `File[]`. The files themselves are uploaded later, by `ContactSubmit`, which
 * is what puts Cloudinary URLs in the message body.
 */

export const MAX_PHOTOS = 8;

export function PhotoUploader({
  images,
  onChange,
  isAr,
}: {
  images: File[];
  onChange: (next: File[]) => void;
  isAr: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Object URLs are a pure function of the chosen files; the effect only revokes.
  const previewUrls = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
  useEffect(
    () => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)),
    [previewUrls]
  );

  const add = useCallback(
    (incoming: File[]) => {
      const merged = [...images, ...incoming.filter((f) => f.type.startsWith("image/"))];
      const deduplicated = merged.filter(
        (f, i) => merged.findIndex((m) => m.name === f.name && m.size === f.size) === i
      );
      onChange(deduplicated.slice(0, MAX_PHOTOS));
    },
    [images, onChange]
  );

  const dragProps = {
    onDragEnter: (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current++;
      setIsDragging(true);
    },
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDragLeave: () => {
      dragCounter.current--;
      if (dragCounter.current === 0) setIsDragging(false);
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      add(Array.from(e.dataTransfer.files));
    },
  };

  return (
    <>
      <p className={`text-xs text-[var(--color-text-muted)] ${isAr ? "text-right" : ""}`}>
        {isAr
          ? `حتى ${MAX_PHOTOS} صور. تُرفق تلقائيًا عند الإرسال بالبريد أو واتساب.`
          : `Up to ${MAX_PHOTOS} images. Attached automatically when you submit via email or WhatsApp.`}
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          add(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
        className="hidden"
      />

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          {...dragProps}
          className={`w-full flex flex-col items-center gap-2 py-8 border-2 border-dashed rounded-sm transition-all duration-200 ${
            isDragging
              ? "border-[var(--color-accent)]/60 bg-[var(--color-accent)]/5 text-[var(--color-text)]"
              : "border-[var(--color-deep-accent)]/30 text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 hover:text-[var(--color-text)]"
          }`}
        >
          <Upload size={22} strokeWidth={1.5} />
          <span className="text-sm">
            {isDragging
              ? isAr
                ? "أفلت الصور هنا"
                : "Drop images here"
              : isAr
                ? "اضغط أو اسحب للرفع"
                : "Click or drag images here"}
          </span>
        </button>
      ) : (
        <div
          {...dragProps}
          className={`grid grid-cols-3 sm:grid-cols-4 gap-2 rounded-sm p-1 transition-all duration-200 ${
            isDragging ? "ring-2 ring-[var(--color-accent)]/40 bg-[var(--color-accent)]/[0.03]" : ""
          }`}
        >
          {images.map((file, i) => (
            <div
              key={`${file.name}-${file.size}`}
              className="relative group aspect-square rounded-sm overflow-hidden border border-[var(--color-deep-accent)]/20"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrls[i]} alt={file.name} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, index) => index !== i))}
                aria-label={isAr ? "احذف الصورة" : "Remove image"}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
          {images.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label={isAr ? "أضف صورة" : "Add image"}
              className="aspect-square rounded-sm border-2 border-dashed border-[var(--color-deep-accent)]/30 flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-accent)]/40 transition-all duration-200"
            >
              <Upload size={16} strokeWidth={1.5} />
            </button>
          )}
        </div>
      )}
    </>
  );
}
