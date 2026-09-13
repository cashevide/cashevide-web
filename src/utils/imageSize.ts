const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const MAX_IMAGE_SIZE_MB = 5;

// Accepts a plain File (web's native file-size source) rather than
// Expo's ImagePicker asset shape (fileSize/filesize) — size is always
// present and reliable on web's File API, unlike some Android devices
// under Expo that didn't report it, so no "unknown size, skip check"
// fallback is needed here.
export function isImageTooLarge(file: File): boolean {
  return file.size > MAX_IMAGE_SIZE_BYTES;
}
