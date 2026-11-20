// src/types/petition.ts
export type PetitionCategory =
  | "Academic & Examination"
  | "Hostel & Accommodation"
  | "Campus Welfare & Facilities"
  | "Security & Student Safety"
  | "Fees & Administrative Services"
  | "Student Rights & Disciplinary"
  | "Other";

export const PETITION_CATEGORIES: readonly PetitionCategory[] = [
  "Academic & Examination",
  "Hostel & Accommodation",
  "Campus Welfare & Facilities",
  "Security & Student Safety",
  "Fees & Administrative Services",
  "Student Rights & Disciplinary",
  "Other",
] as const;

export interface PersonalDetailsData {
  fullName: string;
  matricNumber: string;
  department: string;
  phoneNumber: string;
}

export interface PetitionDetailsData {
  title: string;
  category: PetitionCategory | "";
  account: string;
  requestedAction: string;
}

export interface PetitionFormData
  extends PersonalDetailsData,
    PetitionDetailsData {}

export interface GeneratedPetition {
  date: string;
  recipient: string;
  through: string;
  institution: string;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
  signatoryName: string;
  matricNumber: string;
  department: string;
  phoneNumber: string;
  category: string;
}

export type PetitionStep = 1 | 2 | 3;

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export const PETITION_LIMITS = {
  fullName: 120, matricNumber: 24, department: 120, phoneNumber: 24,
  title: 140, account: 12000, requestedAction: 4000, date: 60, body: 18000,
} as const;
