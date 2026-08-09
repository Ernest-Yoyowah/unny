export type OrganizationStatus = "pending" | "verified" | "suspended";
export type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";
export type VerificationDocumentType =
  | "government_registration"
  | "accreditation_certificate"
  | "letterhead"
  | "utility_bill";

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  logoUrl?: string;
  description: string;
  website?: string;
  country: string;
  state?: string;
  city: string;
  email: string;
  phone?: string;
  establishedYear: number;
  status: OrganizationStatus;
  verificationStatus: VerificationStatus;
  memberCount: number;
  courseCount: number;
  joinCode: string;
  createdAt: string;
}

export interface CreateOrganizationPayload {
  name: string;
  shortName: string;
  description: string;
  website?: string;
  country: string;
  state?: string;
  city: string;
  email: string;
  phone?: string;
  establishedYear: number;
}

export interface VerificationDocument {
  type: VerificationDocumentType;
  fileUri: string;
  fileName: string;
}

export interface VerificationSubmission {
  organizationId: string;
  documents: VerificationDocument[];
  contactName: string;
  contactTitle: string;
  additionalNotes?: string;
}
