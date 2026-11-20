// src/lib/petition-generator.ts
import type { GeneratedPetition, PetitionFormData } from "@/types/petition";
import { getPetitionBlocks } from "./petition-document";

function normalizeBlock(text: string): string {
  const paragraphs = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join(" ")
    )
    .filter(Boolean)
    .map((paragraph) => {
      const capitalized =
        paragraph.charAt(0).toUpperCase() + paragraph.slice(1);
      return /[.!?]$/.test(capitalized) ? capitalized : `${capitalized}.`;
    });

  return paragraphs.join("\n\n");
}

function formatFormalDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
}

function formatSubject(title: string): string {
  return title.trim().replace(/\s+/g, " ").toUpperCase();
}

function formatMatric(matric: string): string {
  return matric.trim().replace(/\s+/g, "").toUpperCase();
}

export function generateFormalPetition(
  data: PetitionFormData
): GeneratedPetition {
  const cleanTitle = data.title.trim().replace(/\s+/g, " ");
  const cleanCategory = data.category || "Student Welfare";
  const cleanAccount = normalizeBlock(data.account);
  const cleanRequestedAction = normalizeBlock(data.requestedAction);

  const openingParagraph = `I respectfully submit this formal petition to bring to your attention a matter concerning ${cleanCategory.toLowerCase()}, specifically regarding "${cleanTitle}".`;

  const actionParagraph = `In view of the foregoing, I respectfully request the following action:\n${cleanRequestedAction}`;

  const closingParagraph =
    "I trust that this matter will receive your kind and timely consideration through the intervention of the Student Delegatory Parliament. Thank you for your continued commitment to the welfare of Veritas University students.";

  const body = [
    openingParagraph,
    cleanAccount,
    actionParagraph,
    closingParagraph,
  ].join("\n\n");

  return {
    date: formatFormalDate(),
    recipient: "The Dean of Student Affairs",
    through: "The Student Delegatory Parliament",
    institution: "Veritas University Abuja.",
    subject: formatSubject(cleanTitle),
    salutation: "Dear Sir/Madam,",
    body,
    closing: "Yours faithfully,",
    signatoryName: data.fullName.trim().replace(/\s+/g, " "),
    matricNumber: formatMatric(data.matricNumber),
    department: data.department.trim().replace(/\s+/g, " "),
    phoneNumber: data.phoneNumber.trim().replace(/\s+/g, " "),
    category: cleanCategory,
  };
}

export function serializePetitionPlainText(
  petition: GeneratedPetition
): string {
  return getPetitionBlocks(petition).map((block) => block.text + (block.gap ? "\n" : "")).join("\n");
}
