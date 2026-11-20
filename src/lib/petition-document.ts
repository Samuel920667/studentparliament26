import type { GeneratedPetition } from "@/types/petition";

export interface PetitionBlock {
  text: string;
  kind?: "letterhead" | "label" | "subject" | "signature";
  align?: "left" | "center" | "right";
  gap?: number;
  keepNext?: boolean;
}

/** Shared content for preview, clipboard, printing, PDF and DOCX. */
export function getPetitionBlocks(petition: GeneratedPetition): PetitionBlock[] {
  return [
    {text: "VERITAS UNIVERSITY ABUJA", kind: "letterhead", align: "center", keepNext: true},
    {text: "STUDENT DELEGATORY PARLIAMENT", kind: "letterhead", align: "center", keepNext: true},
    {text: "FORMAL PETITION", kind: "label", align: "center", gap: 16},
    {text: `DATE: ${petition.date}`, align: "right", gap: 14},
    {text: "TO:", kind: "label", keepNext: true},
    {text: petition.recipient, keepNext: true},
    {text: petition.institution, gap: 12},
    {text: "THROUGH:", kind: "label", keepNext: true},
    {text: petition.through, keepNext: true},
    {text: petition.institution, gap: 14},
    {text: `SUBJECT: ${petition.subject}`, kind: "subject", gap: 14, keepNext: true},
    {text: petition.salutation, gap: 12, keepNext: true},
    ...petition.body.replace(/\r\n?/g, "\n").split(/\n{2,}/).filter((text) => text.trim()).map((text) => ({text, gap: 12})),
    {text: petition.closing, gap: 24, keepNext: true},
    {text: "______________________________", keepNext: true},
    {text: petition.signatoryName, kind: "signature", keepNext: true},
    {text: `Matriculation Number: ${petition.matricNumber}`, keepNext: true},
    {text: `Department: ${petition.department}`, keepNext: true},
    {text: `Phone Number: ${petition.phoneNumber}`},
  ];
}
