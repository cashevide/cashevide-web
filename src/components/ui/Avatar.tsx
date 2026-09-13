import { useState } from "react";
import { User } from "lucide-react";

import { cn } from "../../utils/cn";
import { Text } from "./Text";

type AvatarShape = "circle" | "square";

interface AvatarProps {
  imageUri?: string | null;
  name?: string | null;
  size?: number;
  shape?: AvatarShape;
  className?: string;
}

const SHAPE_CLASS: Record<AvatarShape, string> = {
  circle: "rounded-full",
  square: "rounded-md",
};

// First letter of the name, uppercased. Falls back to nothing (renders
// the generic person icon instead) if name is missing/blank.
function getInitial(name?: string | null): string {
  const trimmed = name?.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "";
}

export function Avatar({
  imageUri,
  name,
  size = 32,
  shape = "circle",
  className = "",
}: AvatarProps) {
  // If the image URL 404s or otherwise fails to load, fall back to the
  // initial/icon rendering instead of leaving a broken image box. Track
  // *which* uri failed so that if the profile later gets a different
  // (working) imageUri, it gets a fresh attempt instead of staying
  // stuck on the fallback.
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const imageFailed = imageUri != null && imageUri === failedUri;
  const shapeClass = SHAPE_CLASS[shape];
  const dimensionStyle = { width: size, height: size };

  if (imageUri && !imageFailed) {
    return (
      <img
        src={imageUri}
        style={dimensionStyle}
        className={cn(shapeClass, "object-cover", className)}
        alt={name ?? "Profile picture"}
        onError={() => setFailedUri(imageUri)}
      />
    );
  }

  const initial = getInitial(name);

  if (initial) {
    return (
      <div
        style={dimensionStyle}
        className={cn(
          "flex items-center justify-center bg-brand",
          shapeClass,
          className,
        )}
        aria-label={name ?? undefined}
      >
        <Text
          style={{ fontSize: size * 0.42 }}
          className="font-medium text-brand-foreground"
        >
          {initial}
        </Text>
      </div>
    );
  }

  return (
    <div
      style={dimensionStyle}
      className={cn(
        "flex items-center justify-center bg-muted",
        shapeClass,
        className,
      )}
    >
      <User size={size * 0.6} className="text-muted-foreground" />
    </div>
  );
}
