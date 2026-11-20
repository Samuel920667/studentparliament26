// src/components/petitions/PetitionForm.tsx
"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { generateFormalPetition } from "@/lib/petition-generator";
import { cn } from "@/lib/utils";
import {
  hasErrors,
  validatePersonalDetails,
  validatePetitionDetails,
} from "@/lib/validation";
import type {
  GeneratedPetition,
  PersonalDetailsData,
  PetitionDetailsData,
  PetitionFormData,
  PetitionStep,
  ValidationErrors,
} from "@/types/petition";
import { DocumentActions } from "./DocumentActions";
import { PersonalDetails } from "./PersonalDetails";
import { PetitionDetails } from "./PetitionDetails";
import { PetitionPreview } from "./PetitionPreview";
import {downloadPetitionPdf, downloadPetitionDocx} from "@/lib/petition-export";
import {saveDraft, hasDraftContent, draftStorageAvailable, serverDraftStorageAvailable, subscribeDraftStorage, type SavedPetitionDraft} from "@/lib/petition-draft";

const INITIAL_FORM_DATA: PetitionFormData = {
  fullName: "",
  matricNumber: "",
  department: "",
  phoneNumber: "",
  title: "",
  category: "",
  account: "",
  requestedAction: "",
};

const STEPS: ReadonlyArray<{ id: PetitionStep; number: string; label: string }> =
  [
    { id: 1, number: "01", label: "Your Details" },
    { id: 2, number: "02", label: "Petition" },
    { id: 3, number: "03", label: "Preview" },
  ];

export function PetitionForm({initialDraft = null, persistenceEnabled = true}: {initialDraft?: SavedPetitionDraft | null; persistenceEnabled?: boolean}) {
  const [step, setStep] = useState<PetitionStep>(initialDraft?.step ?? 1);
  const [formData, setFormData] = useState<PetitionFormData>(initialDraft?.formData ?? INITIAL_FORM_DATA);
  const [personalErrors, setPersonalErrors] = useState<
    ValidationErrors<PersonalDetailsData>
  >({});
  const [petitionErrors, setPetitionErrors] = useState<
    ValidationErrors<PetitionDetailsData>
  >({});
  const [generatedPetition, setGeneratedPetition] =
    useState<GeneratedPetition | null>(initialDraft?.generatedPetition ?? null);
  const [isManuallyEdited, setIsManuallyEdited] = useState(initialDraft?.isManuallyEdited ?? false);
  const [lastGeneratedInputs, setLastGeneratedInputs] = useState<PetitionFormData | null>(initialDraft?.lastGeneratedInputs ?? null);
  const storageAvailable = useSyncExternalStore(subscribeDraftStorage, draftStorageAvailable, serverDraftStorageAvailable);
  const previousStep = useRef(step);
  useEffect(() => {
    if (persistenceEnabled) saveDraft({version: 1, formData, step, generatedPetition, lastGeneratedInputs, isManuallyEdited});
  }, [persistenceEnabled, formData, step, generatedPetition, lastGeneratedInputs, isManuallyEdited]);
  useEffect(() => {
    if (!hasDraftContent(formData)) return;
    const warnOnLeave = (event: BeforeUnloadEvent) => {event.preventDefault(); event.returnValue = "";};
    window.addEventListener("beforeunload", warnOnLeave);
    return () => window.removeEventListener("beforeunload", warnOnLeave);
  }, [formData]);
  useEffect(() => {
    if (previousStep.current !== step) document.querySelector<HTMLElement>("[data-petition-step-heading]")?.focus();
    previousStep.current = step;
  }, [step]);
  const focusError = () => window.requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());

  const handlePersonalChange = <K extends keyof PersonalDetailsData>(
    field: K,
    value: PersonalDetailsData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (personalErrors[field]) {
      setPersonalErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handlePetitionChange = <K extends keyof PetitionDetailsData>(
    field: K,
    value: PetitionDetailsData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (petitionErrors[field]) {
      setPetitionErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleContinueFromPersonal = () => {
    const errors = validatePersonalDetails(formData);
    setPersonalErrors(errors);

    if (!hasErrors(errors)) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else focusError();
  };

  const handleGeneratePreview = () => {
    const personal = validatePersonalDetails(formData);
    setPersonalErrors(personal);
    if (hasErrors(personal)) {setStep(1); focusError(); return;}
    const errors = validatePetitionDetails(formData);
    setPetitionErrors(errors);

    if (!hasErrors(errors)) {
      const inputsChanged = JSON.stringify(formData) !== JSON.stringify(lastGeneratedInputs);
      if (generatedPetition && isManuallyEdited && inputsChanged && !window.confirm("Regenerating will replace your manual edits with the updated inputs. Continue?")) return;
      if (!generatedPetition || inputsChanged) {
        setGeneratedPetition(generateFormalPetition(formData));
        setLastGeneratedInputs({...formData});
        setIsManuallyEdited(false);
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else focusError();
  };

  const handleStepNavigation = (targetStep: PetitionStep) => {
    if (targetStep === step) return;

    if (targetStep < step) {
      setStep(targetStep);
      return;
    }

    if (targetStep === 2) {
      handleContinueFromPersonal();
      return;
    }

    if (targetStep === 3) {
      const step1Errors = validatePersonalDetails(formData);
      setPersonalErrors(step1Errors);
      if (hasErrors(step1Errors)) {
        setStep(1);
        return;
      }
      handleGeneratePreview();
    }
  };

  const handleUpdatePetition = (patch: Partial<GeneratedPetition>) => {
    setGeneratedPetition((prev) => (prev ? { ...prev, ...patch } : prev));
    setIsManuallyEdited(true);
  };

  const handleResetDraft = () => {
    if (isManuallyEdited && !window.confirm("Reset the draft and discard your manual edits?")) return;
    const personal = validatePersonalDetails(formData), details = validatePetitionDetails(formData);
    if (hasErrors(personal) || hasErrors(details)) {
      setPersonalErrors(personal); setPetitionErrors(details); setStep(hasErrors(personal) ? 1 : 2); focusError(); return;
    }
    setGeneratedPetition(generateFormalPetition(formData));
    setLastGeneratedInputs({...formData});
    setIsManuallyEdited(false);
  };

  const handleStartNew = () => {
    if (hasDraftContent(formData) && !window.confirm("Start a new petition and clear this tab's saved draft?")) return;
    setFormData(INITIAL_FORM_DATA);
    setPersonalErrors({});
    setPetitionErrors({});
    setGeneratedPetition(null);
    setIsManuallyEdited(false);
    setLastGeneratedInputs(null);
    saveDraft({version: 1, formData: INITIAL_FORM_DATA, step: 1, generatedPetition: null, lastGeneratedInputs: null, isManuallyEdited: false});
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-8">
      <p role="status" className="text-sm text-[var(--muted)]">{storageAvailable ? "Your draft is saved in this tab for recovery after a refresh. Start a New Petition clears it. Closing this tab removes the saved draft." : "This browser blocked draft recovery. Download your petition before leaving."}</p>
      {/* Stepper Bar */}
      <nav aria-label="Petition drafting steps">
        <ol className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {STEPS.map((item) => {
            const isActive = step === item.id;
            const isCompleted = step > item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleStepNavigation(item.id)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex w-full flex-col items-start gap-1 rounded-[2px] border-[1.5px] px-3.5 py-3 text-left transition-colors duration-150 cursor-pointer sm:flex-row sm:items-center sm:gap-3 sm:px-5 sm:py-4",
                    isActive
                      ? "border-[var(--blue)] bg-[var(--navy-deep)] text-white"
                      : isCompleted
                        ? "border-[#102A43]/35 bg-white text-[var(--navy)] hover:border-[var(--navy)]"
                        : "border-[#102A43]/15 bg-white/75 text-[var(--muted)] hover:border-[#102A43]/35"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-[2px] font-mono text-xs font-semibold",
                      isActive
                        ? "bg-[var(--blue)] text-white"
                        : isCompleted
                          ? "bg-[var(--navy)] text-white"
                          : "bg-[#F5F5F0] text-[var(--muted)]"
                    )}
                  >
                    {item.number}
                  </span>
                  <span className="font-mono text-[11px] font-semibold tracking-[0.1em] uppercase sm:text-xs">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Main Document Preparation Surface */}
      <div className="min-w-0 rounded-[2px] border-[1.5px] border-[#102A43]/25 bg-white p-4 shadow-[0_2px_10px_rgba(16,42,67,0.05)] sm:p-10">
        {step === 1 ? (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleContinueFromPersonal();
            }}
            className="space-y-8"
          >
            <PersonalDetails
              data={formData}
              errors={personalErrors}
              onChange={handlePersonalChange}
            />

            <div className="flex items-center justify-end border-t border-[#102A43]/15 pt-6">
              <Button type="submit" variant="primary" size="md">
                Continue to Petition Details
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <path d="M3 8H13" />
                  <path d="M8.5 3.5L13 8L8.5 12.5" />
                </svg>
              </Button>
            </div>
          </form>
        ) : null}

        {step === 2 ? (
          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              handleGeneratePreview();
            }}
            className="space-y-8"
          >
            <PetitionDetails
              data={formData}
              errors={petitionErrors}
              onChange={handlePetitionChange}
            />
            {generatedPetition ? <Button type="button" variant="ghost" size="sm" onClick={() => setStep(3)}>Return to existing draft</Button> : null}

            <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#102A43]/15 pt-6 sm:flex-row sm:items-center">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(1)}
              >
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <path d="M13 8H3" />
                  <path d="M7.5 3.5L3 8L7.5 12.5" />
                </svg>
                Back to Details
              </Button>

              <Button type="submit" variant="primary" size="md">
                Generate Formal Petition
                <svg
                  aria-hidden="true"
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <path d="M3 8H13" />
                  <path d="M8.5 3.5L13 8L8.5 12.5" />
                </svg>
              </Button>
            </div>
          </form>
        ) : null}

        {step === 3 && generatedPetition ? (
          <div className="space-y-8">
            <PetitionPreview
              petition={generatedPetition}
              isEdited={isManuallyEdited}
              onUpdatePetition={handleUpdatePetition}
              onResetDraft={handleResetDraft}
            />

            <div className="flex items-center justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep(2)}
              >
                <svg
                  aria-hidden="true"
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="square"
                >
                  <path d="M13 8H3" />
                  <path d="M7.5 3.5L3 8L7.5 12.5" />
                </svg>
                Back to Petition Inputs
              </Button>
            </div>

            <DocumentActions
              petition={generatedPetition}
              onDownloadPdf={downloadPetitionPdf}
              onDownloadDocx={downloadPetitionDocx}
              onStartNew={handleStartNew}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
