// Validate file content by checking magic bytes (file signatures)
// Prevents MIME type spoofing where client sends a fake Content-Type header

const SIGNATURES: { mime: string; bytes: number[] }[] = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // RIFF header (WebP)
  { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', bytes: [0x50, 0x4b, 0x03, 0x04] }, // PK (ZIP/DOCX)
  { mime: 'video/mp4', bytes: [] }, // MP4 uses ftyp box — checked separately
  { mime: 'video/webm', bytes: [0x1a, 0x45, 0xdf, 0xa3] }, // EBML header
];

/**
 * Detect the actual MIME type by reading the file's magic bytes.
 * Returns the detected MIME or null if unrecognized.
 */
export function detectMimeFromBuffer(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  for (const sig of SIGNATURES) {
    if (sig.bytes.length === 0) continue; // skip special cases
    if (sig.bytes.every((b, i) => buffer[i] === b)) {
      // Extra check for WebP: bytes 8-11 must be "WEBP"
      if (sig.mime === 'image/webp') {
        if (buffer.toString('ascii', 8, 12) !== 'WEBP') continue;
      }
      return sig.mime;
    }
  }

  // MP4: look for "ftyp" at offset 4
  if (buffer.toString('ascii', 4, 8) === 'ftyp') {
    return 'video/mp4';
  }

  return null;
}

/**
 * Validate that a file's actual content matches its claimed MIME type.
 */
export function validateFileMagic(
  buffer: Buffer,
  allowedMimes: Set<string>,
): { valid: boolean; detectedMime: string | null } {
  const detectedMime = detectMimeFromBuffer(buffer);
  return {
    valid: detectedMime !== null && allowedMimes.has(detectedMime),
    detectedMime,
  };
}
