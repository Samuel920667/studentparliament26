"use client";

import {useState} from "react";
import {Input, Textarea} from "@/components/ui/Input";
import {Button} from "@/components/ui/Button";
import {PETITION_LIMITS, type GeneratedPetition, type ValidationErrors} from "@/types/petition";
import {hasErrors, validateGeneratedPetition} from "@/lib/validation";
import {PetitionDocument} from "./PetitionDocument";

export interface PetitionPreviewProps {
  petition: GeneratedPetition;
  isEdited: boolean;
  onUpdatePetition: (patch: Partial<GeneratedPetition>) => void;
  onResetDraft: () => void;
}
export function PetitionPreview({petition, isEdited, onUpdatePetition, onResetDraft}: PetitionPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors<GeneratedPetition>>({});
  const update = (field: "date" | "subject" | "body", value: string) => {
    onUpdatePetition({[field]: value});
    setErrors((previous) => ({...previous, [field]: undefined}));
  };
  const toggleEditing = () => {
    if (isEditing) {
      const next = validateGeneratedPetition(petition);
      setErrors(next);
      if (hasErrors(next)) {requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return;}
    }
    setIsEditing(!isEditing);
    requestAnimationFrame(() => document.getElementById(isEditing ? "petition-preview-heading" : "edit-petition-date")?.focus());
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 border-b border-[#102A43]/15 pb-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-semibold tracking-widest text-[var(--blue)]">STEP 03 OF 03</p>
          <h2 id="petition-preview-heading" data-petition-step-heading tabIndex={-1} className="mt-1 font-display text-2xl font-bold text-[var(--navy)]">Review &amp; Edit Petition</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Review your petition carefully. Downloads and printing include your edits.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {isEdited ? <Button variant="ghost" size="sm" onClick={onResetDraft}>Reset Draft</Button> : null}
          <Button variant="navy" size="sm" onClick={toggleEditing} aria-expanded={isEditing} aria-controls="petition-document-editor">{isEditing ? "Done Editing" : "Edit Document"}</Button>
        </div>
      </div>
      {isEditing ? <div id="petition-document-editor" className="space-y-5">
        <Input id="edit-petition-date" label="Document date" required value={petition.date} maxLength={PETITION_LIMITS.date} error={errors.date} onChange={(event) => update("date", event.target.value)} />
        <Input id="edit-petition-subject" label="Subject" required value={petition.subject} maxLength={PETITION_LIMITS.title} error={errors.subject} onChange={(event) => update("subject", event.target.value)} />
        <Textarea id="edit-petition-body" label="Petition body" required rows={12} value={petition.body} maxLength={PETITION_LIMITS.body} hint="Separate paragraphs with a blank line. Maximum 18,000 characters." error={errors.body} onChange={(event) => update("body", event.target.value)} />
      </div> : <PetitionDocument petition={petition} />}
      <p className="rounded border border-[#102A43]/20 bg-[#F5F5F0] p-4 text-xs leading-relaxed">This platform prepares a document. It does not automatically send it to the Dean or SDP. Download, sign, and submit it through the university&apos;s established channels.</p>
    </div>
  );
}
