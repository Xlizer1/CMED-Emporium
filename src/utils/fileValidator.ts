// src/utils/fileValidator.ts

/**
 * List of allowed file extensions
 */
export const ALLOWED_FILE_EXTENSIONS = [
  // Document formats
  "txt",
  "pdf",
  "doc",
  "docx",
  "rtf",

  // Spreadsheet formats
  "xls",
  "xlsx",
  "csv",

  // Presentation formats
  "ppt",
  "pptx",

  // Image formats
  "jpg",
  "jpeg",
  "png",
  "gif",
  "svg",
  "bmp",
  "webp",

  // Archive formats
  "zip",
  "rar",
  "7z",

  // Other text formats
  "md",
  "json",
  "xml",
  "html",
  "css",
  "js",
  "ts",
];

/**
 * Maximum file size in bytes (100MB)
 */
export const MAX_FILE_SIZE = 100 * 1024 * 1024;

/**
 * Disallowed MIME types (primarily video types)
 */
export const DISALLOWED_MIME_TYPES = ["video/", "audio/"];

/**
 * Interface for validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates if a file has an allowed extension
 * @param fileName The name of the file to validate
 * @returns True if the extension is allowed, false otherwise
 */
export const hasAllowedExtension = (fileName: string): boolean => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  return ALLOWED_FILE_EXTENSIONS.includes(extension);
};

/**
 * Validates if a file has a disallowed MIME type
 * @param mimeType The MIME type to validate
 * @returns True if the MIME type is allowed, false otherwise
 */
export const hasAllowedMimeType = (mimeType: string): boolean => {
  return !DISALLOWED_MIME_TYPES.some((disallowedType) =>
    mimeType.startsWith(disallowedType)
  );
};

/**
 * Validates if file size is under the limit
 * @param fileSize The size of the file in bytes
 * @returns True if the file size is under the limit, false otherwise
 */
export const isUnderSizeLimit = (fileSize: number): boolean => {
  return fileSize <= MAX_FILE_SIZE;
};

/**
 * Comprehensive file validation
 * @param file The file to validate
 * @returns Validation result with isValid flag and error messages
 */
export const validateFile = (file: File): ValidationResult => {
  const errors: string[] = [];

  if (!hasAllowedExtension(file.name)) {
    errors.push(
      `File type not allowed: ${
        file.name.split(".").pop()?.toLowerCase() || "unknown"
      }`
    );
  }

  if (!hasAllowedMimeType(file.type)) {
    errors.push(`File content type not allowed: ${file.type}`);
  }

  if (!isUnderSizeLimit(file.size)) {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
    errors.push(
      `File too large: ${fileSizeMB}MB (max: ${
        MAX_FILE_SIZE / (1024 * 1024)
      }MB)`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Batch validation for multiple files
 * @param files Array of files to validate
 * @returns Object with valid files array and invalid files with their errors
 */
export const validateFiles = (
  files: File[]
): {
  validFiles: File[];
  invalidFiles: { file: File; errors: string[] }[];
} => {
  const validFiles: File[] = [];
  const invalidFiles: { file: File; errors: string[] }[] = [];

  files.forEach((file) => {
    const result = validateFile(file);

    if (result.isValid) {
      validFiles.push(file);
    } else {
      invalidFiles.push({ file, errors: result.errors });
    }
  });

  return { validFiles, invalidFiles };
};
