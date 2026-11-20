import {
  PETITION_CATEGORIES, PETITION_LIMITS,
  type GeneratedPetition, type PersonalDetailsData,
  type PetitionDetailsData, type ValidationErrors,
} from "@/types/petition";

export function validatePersonalDetails(data: PersonalDetailsData): ValidationErrors<PersonalDetailsData> {
  const errors: ValidationErrors<PersonalDetailsData> = {};
  const name = data.fullName.trim();
  const matric = data.matricNumber.trim().replace(/\s/g, "");
  const department = data.department.trim();
  const phone = data.phoneNumber.trim();
  const digits = phone.replace(/[\s()-]/g, "");
  if (name.split(/\s+/).filter((part) => /\p{L}/u.test(part)).length < 2) {
    errors.fullName = "Provide your surname and first name as registered with the university.";
  } else if (name.length > PETITION_LIMITS.fullName) {
    errors.fullName = "Keep your name within 120 characters.";
  }
  if (matric.length < 5 || matric.length > PETITION_LIMITS.matricNumber ||
    !/^[A-Za-z0-9]+(?:[/.-][A-Za-z0-9]+)*$/.test(matric) ||
    !/[A-Za-z]/.test(matric) || !/\d/.test(matric)) {
    errors.matricNumber = "Enter your university matriculation number (e.g., VUG/CSC/22/1234).";
  }
  if (department.length < 3 || !/\p{L}/u.test(department) || department.length > PETITION_LIMITS.department) {
    errors.department = "Enter your academic department (3 to 120 characters).";
  }
  const validPhone = /^\+?234/.test(digits)
    ? /^\+?234[789]\d{9}$/.test(digits)
    : /^(?:0[789]\d{9}|\+[1-9]\d{7,14})$/.test(digits);
  if (phone.length > PETITION_LIMITS.phoneNumber || !/^\+?[\d\s()-]+$/.test(phone) || !validPhone) {
    errors.phoneNumber = "Enter a valid phone number, e.g. 0801 234 5678 or +234 801 234 5678.";
  }
  return errors;
}

export function validatePetitionDetails(data: PetitionDetailsData): ValidationErrors<PetitionDetailsData> {
  const errors: ValidationErrors<PetitionDetailsData> = {};
  if (data.title.trim().length < 8 || data.title.trim().length > PETITION_LIMITS.title) {
    errors.title = "Enter a clear subject of 8 to 140 characters.";
  }
  if (!PETITION_CATEGORIES.some((category) => category === data.category)) errors.category = "Select a complaint category.";
  if (data.account.trim().length < 40 || data.account.length > PETITION_LIMITS.account) errors.account = "Provide a factual account of 40 to 12,000 characters.";
  if (data.requestedAction.trim().length < 15 || data.requestedAction.length > PETITION_LIMITS.requestedAction) errors.requestedAction = "Describe the action requested in 15 to 4,000 characters.";
  return errors;
}

export function validateGeneratedPetition(petition: GeneratedPetition): ValidationErrors<GeneratedPetition> {
  const errors: ValidationErrors<GeneratedPetition> = {};
  const personal = validatePersonalDetails({fullName: petition.signatoryName, matricNumber: petition.matricNumber, department: petition.department, phoneNumber: petition.phoneNumber});
  if (personal.fullName) errors.signatoryName = personal.fullName;
  if (personal.matricNumber) errors.matricNumber = personal.matricNumber;
  if (personal.department) errors.department = personal.department;
  if (personal.phoneNumber) errors.phoneNumber = personal.phoneNumber;
  if (!petition.date.trim() || petition.date.length > PETITION_LIMITS.date || /[\r\n]/.test(petition.date)) errors.date = "Enter a document date of up to 60 characters.";
  if (petition.subject.trim().length < 8 || petition.subject.length > PETITION_LIMITS.title) errors.subject = "Keep the subject between 8 and 140 characters.";
  if (petition.body.trim().length < 40 || petition.body.length > PETITION_LIMITS.body) errors.body = "Keep the petition body between 40 and 18,000 characters.";
  for (const field of ["recipient", "through", "institution", "salutation", "closing"] as const) {
    if (!petition[field].trim() || petition[field].length > 200) errors[field] = "The document routing and closing must be complete.";
  }
  return errors;
}

export function hasErrors<T extends object>(errors: ValidationErrors<T>): boolean {
  return Object.keys(errors).length > 0;
}
