// src/components/petitions/PetitionDetails.tsx
import { Input, Select, Textarea } from "@/components/ui/Input";
import {
  PETITION_CATEGORIES,
  PETITION_LIMITS,
  type PetitionCategory,
  type PetitionDetailsData,
  type ValidationErrors,
} from "@/types/petition";

export interface PetitionDetailsProps {
  data: PetitionDetailsData;
  errors: ValidationErrors<PetitionDetailsData>;
  onChange: <K extends keyof PetitionDetailsData>(
    field: K,
    value: PetitionDetailsData[K]
  ) => void;
}

const CATEGORY_OPTIONS = PETITION_CATEGORIES.map((category) => ({
  label: category,
  value: category,
}));

export function PetitionDetails({
  data,
  errors,
  onChange,
}: PetitionDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#102A43]/15 pb-4">
        <p className="font-mono text-xs font-semibold tracking-[0.12em] text-[var(--blue)] uppercase">
          Step 02 of 03
        </p>
        <h2 data-petition-step-heading tabIndex={-1} className="mt-1 font-display text-2xl font-bold text-[var(--navy)]">
          Petition Details
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          State the facts accurately in your own words. The portal structures
          your submission without altering or inventing facts.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            id="petition-title"
            maxLength={PETITION_LIMITS.title}
            label="Petition Title / Subject"
            required
            placeholder="e.g., Persistent Water Supply Disruption in Hostel B"
            value={data.title}
            error={errors.title}
            hint="A concise headline summarizing the issue."
            onChange={(event) => onChange("title", event.target.value)}
          />

          <Select
            id="petition-category"
            label="Nature / Category of Complaint"
            required
            placeholder="Select complaint category"
            options={CATEGORY_OPTIONS}
            value={data.category}
            error={errors.category}
            hint="Choose the area that best matches your petition."
            onChange={(event) =>
              onChange("category", event.target.value as PetitionCategory)
            }
          />
        </div>

        <Textarea
          id="petition-account"
          maxLength={PETITION_LIMITS.account}
          label="Detailed Account of the Issue"
          required
          rows={6}
          placeholder="Describe what happened, relevant dates or locations, and how it affects you or the student community..."
          value={data.account}
          error={errors.account}
          hint="Include dates, venues, and context. Separate points with a blank line. Maximum 12,000 characters."
          onChange={(event) => onChange("account", event.target.value)}
        />

        <Textarea
          id="petition-requested-action"
          maxLength={PETITION_LIMITS.requestedAction}
          label="Requested Action"
          required
          rows={4}
          placeholder="Clearly state the specific intervention, review, or resolution you are requesting from the Dean of Student Affairs..."
          value={data.requestedAction}
          error={errors.requestedAction}
          hint="Be clear and practical about the outcome you seek. Maximum 4,000 characters."
          onChange={(event) => onChange("requestedAction", event.target.value)}
        />
      </div>
    </div>
  );
}
