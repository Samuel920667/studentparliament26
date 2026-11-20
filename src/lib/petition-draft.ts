import {PETITION_CATEGORIES, type GeneratedPetition, type PetitionFormData, type PetitionStep} from "@/types/petition";

export interface SavedPetitionDraft {
  version: 1;
  formData: PetitionFormData;
  step: PetitionStep;
  generatedPetition: GeneratedPetition | null;
  lastGeneratedInputs: PetitionFormData | null;
  isManuallyEdited: boolean;
}
const KEY = "sdp-petition-draft-v1";
const listeners = new Set<() => void>();
let available = true;
export const subscribeDraftStorage = (listener: () => void) => {listeners.add(listener); return () => {listeners.delete(listener);};};
export const draftStorageAvailable = () => available;
export const serverDraftStorageAvailable = () => true;
export const hasDraftContent = (data: PetitionFormData) => Object.values(data).some((value) => value.trim());

function isForm(value: unknown): value is PetitionFormData {
  if (!value || typeof value !== "object") return false;
  const fields = ["fullName", "matricNumber", "department", "phoneNumber", "title", "category", "account", "requestedAction"];
  const record = value as Record<string, unknown>;
  return fields.every((field) => typeof record[field] === "string" && (record[field] as string).length <= 18000) &&
    (record.category === "" || PETITION_CATEGORIES.some((category) => category === record.category));
}
function isDocument(value: unknown): value is GeneratedPetition {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return ["date", "recipient", "through", "institution", "subject", "salutation", "body", "closing", "signatoryName", "matricNumber", "department", "phoneNumber", "category"].every((key) => typeof record[key] === "string" && (record[key] as string).length <= 18000);
}
export function readSavedDraft(): SavedPetitionDraft | null {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (!saved || typeof saved !== "object") return null;
    const draft = saved as SavedPetitionDraft;
    if (draft.version !== 1 || !isForm(draft.formData) || ![1, 2, 3].includes(draft.step) || typeof draft.isManuallyEdited !== "boolean") return null;
    if (draft.generatedPetition !== null && !isDocument(draft.generatedPetition)) return null;
    if (draft.lastGeneratedInputs !== null && !isForm(draft.lastGeneratedInputs)) return null;
    if (draft.step === 3 && !draft.generatedPetition) return null;
    return draft;
  } catch {return null;}
}
export function saveDraft(draft: SavedPetitionDraft) {
  let success = true;
  try {
    if (hasDraftContent(draft.formData)) sessionStorage.setItem(KEY, JSON.stringify(draft));
    else sessionStorage.removeItem(KEY);
  } catch {success = false;}
  if (available !== success) {available = success; listeners.forEach((listener) => listener());}
}
