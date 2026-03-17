import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side image upload API route using Uploadcare CDN.
 *
 * This route acts as a proxy for uploading images to Uploadcare.
 * It validates files server-side before forwarding to the CDN.
 *
 * WHY SERVER-SIDE VALIDATION:
 * Client-side validation can be bypassed. Server-side validation ensures:
 * - Only allowed image types are uploaded (JPEG, PNG, WebP)
 * - File size limits are enforced (max 5MB)
 * - Malicious files cannot reach the CDN
 *
 * SECURITY: The public key is read from environment variables,
 * never hardcoded. For signed uploads in production, use the
 * secret key server-side only.
 */

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const UPLOAD_URL = "https://upload.uploadcare.com/base/";

export async function POST(req: NextRequest) {
  const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;

  if (!publicKey || publicKey === "your_uploadcare_public_key") {
    return NextResponse.json(
      {
        error:
          "Uploadcare public key not configured. Set NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY in .env.local",
      },
      { status: 500 }
    );
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const urls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(
        `${file.name}: Invalid type (${file.type}). Allowed: JPEG, PNG, WebP`
      );
      continue;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      errors.push(`${file.name}: Too large (${sizeMB}MB). Max 5MB`);
      continue;
    }

    // Upload to Uploadcare
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("UPLOADCARE_PUB_KEY", publicKey);
      uploadFormData.append("UPLOADCARE_STORE", "auto");
      uploadFormData.append("file", file);

      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        errors.push(`${file.name}: Upload failed (${response.status})`);
        console.error(
          `[Upload API] Uploadcare error for ${file.name}:`,
          errorText
        );
        continue;
      }

      const data = await response.json();
      const uuid = data.file;

      if (uuid) {
        // Construct the CDN URL
        // Base URL: https://ucarecdn.com/FILE_UUID/
        //
        // For optimized delivery, append transformations:
        // https://ucarecdn.com/UUID/-/resize/800x600/     → resize
        // https://ucarecdn.com/UUID/-/format/webp/         → webp format
        // https://ucarecdn.com/UUID/-/quality/smart/        → smart quality
        const cdnUrl = `https://ucarecdn.com/${uuid}/`;
        urls.push(cdnUrl);
      } else {
        errors.push(`${file.name}: No UUID returned from Uploadcare`);
      }
    } catch (err) {
      errors.push(`${file.name}: Network error during upload`);
      console.error(`[Upload API] Error uploading ${file.name}:`, err);
    }
  }

  if (urls.length === 0 && errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  return NextResponse.json({
    urls,
    url: urls[0] || null,
    ...(errors.length > 0 && { warnings: errors }),
  });
}
