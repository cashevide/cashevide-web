import { useEffect, useRef, useState, type ReactNode } from "react";
import { Camera, Trash2, Image as ImageIcon } from "lucide-react";

import { isImageTooLarge, MAX_IMAGE_SIZE_MB } from "../../utils/imageSize";
import { Text } from "./Text";
import { Spinner } from "./Spinner";
import { Divider } from "./Divider";
import { Modal } from "./Modal";

type AvatarPickerProps = {
  imageUri: string | null | undefined;
  onPick: (file: File) => void;
  onRemove?: () => void;
  isUploading?: boolean;
  isError?: boolean;
  shape?: "circle" | "square";
  placeholderText?: string;
  // Defaults to 80 (the size this component always used before this
  // prop existed) — pass a larger value for screens that want the
  // photo more prominent, like a personal profile's own avatar. The
  // camera badge scales proportionally so it doesn't look undersized
  // next to a larger photo.
  size?: number;
};

const SHAPE_CLASS: Record<"circle" | "square", string> = {
  circle: "rounded-full",
  square: "rounded-md",
};

function ActionRow({
  icon,
  label,
  destructive = false,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex flex-row items-center gap-3 py-3 active:opacity-60 cursor-pointer text-left"
    >
      {icon}
      <Text
        variant="body"
        className={destructive ? "text-destructive" : "text-foreground"}
      >
        {label}
      </Text>
    </button>
  );
}

// Ported from Expo's version, which used expo-image-picker (native
// gallery access + permission prompt). Web has no equivalent — a
// hidden <input type="file"> triggered by a visible button covers the
// same "pick a photo" flow with no permission step needed.
export function AvatarPicker({
  imageUri,
  onPick,
  onRemove,
  isUploading = false,
  isError = false,
  shape = "circle",
  placeholderText = "Add Photo",
  size = 80,
}: AvatarPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState<string | null>(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  // Clear the optimistic preview once the mutation settles (success or
  // error) — on success the fresh `imageUri` from the server takes over;
  // on error we fall back to the previous `imageUri` automatically.
  useEffect(() => {
    if (!isUploading && previewUri) {
      setPreviewUri(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploading]);

  function handlePickImage() {
    setIsActionSheetOpen(false);
    setSizeError(null);
    fileInputRef.current?.click();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow picking the same file again later

    if (!file) return;

    if (isImageTooLarge(file)) {
      setSizeError(`Image must be under ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setPreviewUri(URL.createObjectURL(file));
    onPick(file);
  }

  function handleRemove() {
    setIsActionSheetOpen(false);
    onRemove?.();
  }

  const displayUri = previewUri ?? imageUri;
  const shapeClass = SHAPE_CLASS[shape];
  const hasImage = !!displayUri;
  // 30% of the avatar size — matches the original fixed 24px badge on
  // the original fixed 80px avatar (24/80 = 0.3), so it scales with
  // size instead of looking undersized on a larger photo.
  const badgeSize = Math.round(size * 0.3);
  const badgeIconSize = Math.round(badgeSize * 0.5);

  return (
    <div className="flex flex-col items-center gap-1">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      <button
        type="button"
        onClick={() => setIsActionSheetOpen(true)}
        className="relative active:opacity-80 cursor-pointer"
      >
        {displayUri ? (
          <img
            src={displayUri}
            style={{ height: size, width: size }}
            className={`${shapeClass} object-cover`}
            alt="Avatar"
          />
        ) : (
          <div
            style={{ height: size, width: size }}
            className={`flex items-center justify-center bg-muted ${shapeClass}`}
          >
            <Text
              variant="caption"
              className="text-muted-foreground text-center px-2"
            >
              {placeholderText}
            </Text>
          </div>
        )}

        {/* Camera badge overlay — signals this image is tappable/editable,
            distinct from the read-only Avatar component which has no such
            affordance. Sized proportionally to the avatar (see
            badgeSize above) rather than a fixed size. */}
        <span
          style={{ height: badgeSize, width: badgeSize }}
          className="absolute bottom-0 right-0 flex items-center justify-center rounded-full bg-primary border-2 border-background"
        >
          <Camera size={badgeIconSize} className="text-primary-foreground" />
        </span>
      </button>

      {isUploading ? (
        <div className="flex flex-row items-center gap-1.5">
          <Spinner size="sm" />
          <Text variant="caption" className="text-muted-foreground">
            Uploading...
          </Text>
        </div>
      ) : null}
      {isError && !isUploading ? (
        <Text variant="caption" className="text-destructive">
          Upload failed. Try again.
        </Text>
      ) : null}
      {sizeError ? (
        <Text variant="caption" className="text-destructive">
          {sizeError}
        </Text>
      ) : null}

      {/* Action sheet — tap avatar to open, choose to change or remove
          the photo. "Remove Photo" only shows when there's an
          onRemove handler AND an existing image to remove. */}
      <Modal
        visible={isActionSheetOpen}
        dismissible
        onDismiss={() => setIsActionSheetOpen(false)}
      >
        <div>
          <ActionRow
            icon={<ImageIcon size={20} className="text-foreground" />}
            label={hasImage ? "Change Photo" : "Add Photo"}
            onClick={handlePickImage}
          />

          {hasImage && onRemove ? (
            <>
              <Divider />
              <ActionRow
                icon={<Trash2 size={20} className="text-destructive-text" />}
                label="Remove Photo"
                destructive
                onClick={handleRemove}
              />
            </>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
