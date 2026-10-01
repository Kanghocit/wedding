/** Local wedding album — order by NDK number in filename. */
export const DEFAULT_GALLERY_URLS = [
  "/images/NDK03124.jpg",
  "/images/NDK03273.jpg",
  "/images/NDK03459.jpg",
  "/images/NDK03537.jpg",
  "/images/NDK03602.jpg",
  "/images/NDK03729.jpg",
  "/images/NDK03800.jpg",
  "/images/NDK03897.jpg",
  "/images/NDK03959.JPG",
] as const;

export function defaultGalleryUrlsList(): string[] {
  return [...DEFAULT_GALLERY_URLS];
}
