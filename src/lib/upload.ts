// Image upload abstraction. Stub implementation produces a deterministic
// public placeholder URL so the rest of the app can be built end-to-end.
// To switch to Cloudinary later, replace the body of `uploadImageFromDataUrl`
// with an unsigned upload to Cloudinary using NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
// and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.

const STUB_POOL = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200",
  "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200",
  "https://images.unsplash.com/photo-1508979621092-c8c41bd57b96?w=1200",
  "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=1200",
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

export async function uploadImageFromDataUrl(
  dataUrl: string,
  hint: string,
): Promise<UploadedImage> {
  const idx = hashString(hint + dataUrl.length) % STUB_POOL.length;
  const publicId = `stub_${Date.now()}_${idx}`;
  return { url: STUB_POOL[idx], publicId };
}

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME &&
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
}
