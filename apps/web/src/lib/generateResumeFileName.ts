/**
 * Sanitizes a string for use in a filename by removing special characters,
 * replacing spaces with underscores, and trimming extra underscores.
 */
export const sanitizeForFilename = (str: string, maxLength = 30): string => {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
    .trim()
    .substring(0, maxLength) // Truncate long strings
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove duplicate hyphens
    .replace(/^-+|-+$/g, ""); // Trim leading/trailing hyphens
};

export interface NamingMetadata {
  name?: string;
  role?: string;
  company?: string;
}

/**
 * Generates an ATS-friendly, clean, and personalized filename for the downloaded resume.
 * Priority:
 * 1. FullName_TargetRole_Company_YYYYMMDD.pdf
 * 2. FullName_TargetRole_YYYYMMDD.pdf
 * 3. FullName_Resume_YYYYMMDD.pdf
 * 4. resume_generated_YYYYMMDD.pdf
 */
export const generateResumeFileName = ({ name, role, company }: NamingMetadata): string => {
  const d = new Date();
  const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

  const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  const isPartialUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{0,12}$/i.test(str);

  const parts: string[] = [];

  // 1. Name part
  let cleanName = name ? sanitizeForFilename(name, 25) : "";
  if (cleanName && (isUUID(name || "") || isPartialUUID(cleanName))) cleanName = "";
  if (cleanName && cleanName.toLowerCase() !== "resume") {
    parts.push(cleanName);
  }

  // 2. Role part
  if (role) {
    const cleanRole = sanitizeForFilename(role, 20);
    if (cleanRole) parts.push(cleanRole);
  }

  // 3. Company part
  if (company) {
    const cleanCompany = sanitizeForFilename(company, 15);
    if (cleanCompany) parts.push(`at-${cleanCompany}`);
  }

  // Fallback
  if (parts.length === 0) {
    return `Optimized-Resume-${dateStr}.pdf`;
  }

  // 4. Clarity suffix
  const combined = parts.join("-").toLowerCase();
  if (!combined.includes("resume") && !combined.includes("cv")) {
    parts.push("Resume");
  }

  // 5. Date
  parts.push(dateStr);

  return `${parts.join("-")}.pdf`;
};
