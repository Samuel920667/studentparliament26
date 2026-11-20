"use client";

import { useState } from "react";
import { cn, getInitials } from "@/lib/utils";

export function ProfileAvatar({
  name,
  photo,
  fallback = "SP",
  className,
  textClassName,
}: {
  name: string;
  photo?: string;
  fallback?: string;
  className?: string;
  textClassName?: string;
}) {
  const [failedPhoto, setFailedPhoto] = useState<string>();

  return (
    <div className={className}>
      {photo && photo !== failedPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={(image) => {
            if (image?.complete && !image.naturalWidth) setFailedPhoto(photo);
          }}
          src={photo}
          alt={name}
          decoding="async"
          onError={() => setFailedPhoto(photo)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <span className={cn("font-display font-bold tracking-tight", textClassName)}>
          {getInitials(name, fallback)}
        </span>
      )}
    </div>
  );
}
