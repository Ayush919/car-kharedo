/**
 * Uploadcare Image Upload Utility
 *
 * WHY ENVIRONMENT VARIABLES:
 * API keys must never be hardcoded in source code. Using environment variables:
 * - Prevents accidental exposure in public repositories
 * - Allows different keys for dev/staging/production
 * - Follows security best practices (OWASP)
 *
 * WHY FILE VALIDATION:
 * - Prevents uploading of malicious files (e.g., executables disguised as images)
 * - Limits server/CDN storage abuse with file size restrictions
 * - Ensures only supported image formats are processed
 *
 * HOW CDN IMPROVES PERFORMANCE:
 * - Uploadcare CDN serves images from edge servers closest to the user
 * - Supports on-the-fly image transformations (resize, format conversion)
 * - Automatic WebP/AVIF delivery for supported browsers
 * - Reduces origin server load and bandwidth costs
 *
 * CDN URL OPTIMIZATION EXAMPLES:
 * - Resize:       https://ucarecdn.com/FILE_UUID/-/resize/800x600/
 * - WebP format:  https://ucarecdn.com/FILE_UUID/-/format/webp/
 * - Quality:      https://ucarecdn.com/FILE_UUID/-/quality/smart/
 * - Crop:         https://ucarecdn.com/FILE_UUID/-/crop/400x300/center/
 * - Combined:     https://ucarecdn.com/FILE_UUID/-/resize/800x/-/format/webp/-/quality/smart/
 */

// Allowed image MIME types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Uploadcare upload endpoint
const UPLOAD_URL = "https://upload.uploadcare.com/base/";

export interface UploadcareResponse {
  url: string;
  uuid: string;
}

/**
 * Validates a file before upload.
 * Checks file type and size restrictions.
 */
function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP`;
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return `File too large: ${sizeMB}MB. Maximum allowed: 5MB`;
  }

  return null;
}

/**
 * Uploads a single image file to Uploadcare CDN.
 *
 * @param file - The image File to upload
 * @returns Object containing the CDN URL and file UUID
 * @throws Error if validation fails or upload request fails
 *
 * Usage:
 *   const { url, uuid } = await uploadImageToUploadcare(file);
 *   // url = "https://ucarecdn.com/abc123-def456/"
 *
 * For optimized images, append transformations to the URL:
 *   `${url}-/resize/800x600/`       — resize to 800x600
 *   `${url}-/format/webp/`          — convert to WebP
 *   `${url}-/quality/smart/`        — smart quality compression
 */
export async function uploadImageToUploadcare(
  file: File
): Promise<UploadcareResponse> {
  // Step 1: Validate the file
  const validationError = validateFile(file);
  if (validationError) {
    console.error("[Uploadcare] Validation failed:", validationError);
    throw new Error(validationError);
  }

  // Step 2: Get the public key from environment variables
  const publicKey = process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY;
  if (!publicKey) {
    console.error("[Uploadcare] Missing NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY");
    throw new Error(
      "Uploadcare public key is not configured. Set NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY in .env.local"
    );
  }

  // Step 3: Build the multipart form data for Uploadcare REST API
  const formData = new FormData();
  formData.append("UPLOADCARE_PUB_KEY", publicKey);
  formData.append("UPLOADCARE_STORE", "auto");
  formData.append("file", file);

  console.log(`[Uploadcare] Uploading: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);

  // Step 4: Send the upload request
  const response = await fetch(UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[Uploadcare] Upload failed:", response.status, errorText);
    throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
  }

  // Step 5: Parse the response and construct the CDN URL
  const data = await response.json();
  const uuid = data.file;

  if (!uuid) {
    console.error("[Uploadcare] No file UUID in response:", data);
    throw new Error("Upload succeeded but no file UUID returned");
  }

  const cdnUrl = `https://ucarecdn.com/${uuid}/`;

  console.log(`[Uploadcare] Upload success: ${cdnUrl}`);

  return { url: cdnUrl, uuid };
}

/**
 * Uploads multiple image files to Uploadcare CDN.
 *
 * @param files - Array of image Files to upload
 * @returns Array of CDN URLs for all successfully uploaded images
 */
export async function uploadMultipleImages(
  files: File[]
): Promise<UploadcareResponse[]> {
  const results: UploadcareResponse[] = [];

  for (const file of files) {
    try {
      const result = await uploadImageToUploadcare(file);
      results.push(result);
    } catch (error) {
      console.error(`[Uploadcare] Failed to upload ${file.name}:`, error);
      throw error;
    }
  }

  return results;
}

/**
 * Constructs an optimized Uploadcare CDN URL with transformations.
 *
 * @param baseUrl - The base CDN URL (e.g., "https://ucarecdn.com/UUID/")
 * @param options - Transformation options
 * @returns Optimized URL string
 *
 * Example:
 *   getOptimizedUrl("https://ucarecdn.com/abc123/", { width: 800, height: 600, format: "webp" })
 *   // => "https://ucarecdn.com/abc123/-/resize/800x600/-/format/webp/-/quality/smart/"
 */
export function getOptimizedUrl(
  baseUrl: string,
  options?: {
    width?: number;
    height?: number;
    format?: "webp" | "jpeg" | "png" | "auto";
    quality?: "smart" | "normal" | "best" | "lighter" | "lightest";
  }
): string {
  if (!baseUrl || !baseUrl.includes("ucarecdn.com")) return baseUrl;

  // Ensure base URL ends with /
  const url = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  let transformations = "";

  if (options?.width || options?.height) {
    const w = options.width || "";
    const h = options.height || "";
    transformations += `-/resize/${w}x${h}/`;
  }

  if (options?.format) {
    transformations += `-/format/${options.format}/`;
  }

  if (options?.quality) {
    transformations += `-/quality/${options.quality}/`;
  }

  return `${url}${transformations}`;
}
