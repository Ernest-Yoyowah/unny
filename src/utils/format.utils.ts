export const formatBytes = (bytes: number, decimals: number = 1): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

export const formatEnrollmentCount = (count: number): string => {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return String(count);
};

export const formatSemester = (semester: string): string => {
  const map: Record<string, string> = {
    first: "1st Semester",
    second: "2nd Semester",
    summer: "Summer Semester",
  };
  return map[semester] ?? semester;
};

export const formatCreditUnits = (units: number): string =>
  `${units} Credit Unit${units !== 1 ? "s" : ""}`;

export const getInitials = (fullName: string): string => {
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    lecture_note: "Lecture Note",
    assignment: "Assignment",
    past_question: "Past Question",
    textbook: "Textbook",
    supplementary: "Supplementary",
    announcement: "Announcement",
  };
  return labels[category] ?? category;
};

export const getFileTypeIcon = (fileType: string): string => {
  if (fileType.includes("pdf")) return "document-text";
  if (fileType.includes("image")) return "image";
  if (fileType.includes("video")) return "videocam";
  if (fileType.includes("audio")) return "musical-note";
  if (fileType.includes("word") || fileType.includes("doc")) return "document";
  if (fileType.includes("sheet") || fileType.includes("excel")) return "grid";
  if (fileType.includes("presentation") || fileType.includes("powerpoint"))
    return "easel";
  return "document-attach";
};
