/**
 * Sanitizes a string for use in a filename by removing special characters,
 * replacing spaces with underscores, and trimming extra underscores.
 */
export const sanitizeForFilename = (str: string): string => {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/_+/g, "_") // Remove duplicate underscores
    .replace(/^_+|_+$/g, ""); // Trim leading/trailing underscores
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

  const parts: string[] = [];

  if (name) {
    parts.push(sanitizeForFilename(name));
  }

  if (role) {
    parts.push(sanitizeForFilename(role));
  } else if (name) {
    // If we have a name but no role, just append 'Resume' so it's not just "Name_Date"
    parts.push("Resume");
  }

  if (company) {
    parts.push(sanitizeForFilename(company));
  }

  // Fallback if we have absolutely nothing
  if (parts.length === 0) {
    return `resume_generated_${dateStr}.pdf`;
  }

  parts.push(dateStr);

  return `${parts.join('_')}.pdf`;
};
