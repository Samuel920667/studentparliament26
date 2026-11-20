// src/components/petitions/PersonalDetails.tsx
import { Input } from "@/components/ui/Input";
import {PETITION_LIMITS, type PersonalDetailsData, type ValidationErrors} from "@/types/petition";

export interface PersonalDetailsProps {
  data: PersonalDetailsData;
  errors: ValidationErrors<PersonalDetailsData>;
  onChange: <K extends keyof PersonalDetailsData>(
    field: K,
    value: PersonalDetailsData[K]
  ) => void;
}

export function PersonalDetails({
  data,
  errors,
  onChange,
}: PersonalDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#102A43]/15 pb-4">
        <p className="font-mono text-xs font-semibold tracking-[0.12em] text-[var(--blue)] uppercase">
          Step 01 of 03
        </p>
        <h2 data-petition-step-heading tabIndex={-1} className="mt-1 font-display text-2xl font-bold text-[var(--navy)]">
          Personal Information
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          These details appear in the signatory section of your formal petition.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          id="petition-full-name"
          maxLength={PETITION_LIMITS.fullName}
          label="Full Name"
          required
          autoComplete="name"
          placeholder="e.g., Chinedu Okafor"
          value={data.fullName}
          error={errors.fullName}
          hint="Use your official name as registered with the university."
          onChange={(event) => onChange("fullName", event.target.value)}
        />

        <Input
          id="petition-matric-number"
          maxLength={PETITION_LIMITS.matricNumber}
          label="Matriculation Number"
          required
          placeholder="e.g., VUG/CSC/22/1234"
          value={data.matricNumber}
          error={errors.matricNumber}
          hint="Your student identification number."
          onChange={(event) => onChange("matricNumber", event.target.value)}
        />

        <Input
          id="petition-department"
          maxLength={PETITION_LIMITS.department}
          label="Department"
          required
          placeholder="e.g., Computer Science"
          value={data.department}
          error={errors.department}
          hint="Enter your full academic department name."
          onChange={(event) => onChange("department", event.target.value)}
        />

        <Input
          id="petition-phone"
          maxLength={PETITION_LIMITS.phoneNumber}
          label="Phone Number"
          type="tel"
          required
          autoComplete="tel"
          placeholder="e.g., 0801 234 5678"
          value={data.phoneNumber}
          error={errors.phoneNumber}
          hint="An active line where the SDP or Dean's office can reach you."
          onChange={(event) => onChange("phoneNumber", event.target.value)}
        />
      </div>
    </div>
  );
}
