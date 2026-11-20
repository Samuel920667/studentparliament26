// src/components/ui/Input.tsx
import type {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

interface FieldWrapperProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
}

const baseControlStyles =
  "w-full rounded-[2px] border-[1.5px] bg-white px-3.5 py-3 text-sm text-[var(--foreground)] placeholder:text-slate-400 transition-colors duration-150 focus:outline-none focus:border-[var(--blue)] focus:ring-2 focus:ring-[var(--blue)]/15 disabled:cursor-not-allowed disabled:bg-slate-100";

function FieldHeader({
  id,
  label,
}: Pick<FieldWrapperProps, "id" | "label">) {
  return (
    <label
      htmlFor={id}
      className="flex items-center justify-between gap-2 font-mono text-xs font-semibold tracking-[0.08em] text-[var(--navy)] uppercase"
    >
      <span>{label}</span>
    </label>
  );
}

function FieldFooter({
  id,
  error,
}: Pick<FieldWrapperProps, "id" | "error">) {
  if (error) {
    return (
      <p
        id={`${id}-error`}
        role="alert"
        className="text-xs font-medium text-red-700"
      >
        {error}
      </p>
    );
  }

  return null;
}

export interface InputProps
  extends FieldWrapperProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {}

export function Input({
  id,
  label,
  required,
  hint,
  error,
  className,
  ...props
}: InputProps) {
  void hint;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <FieldHeader id={id} label={label} />
      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          baseControlStyles,
          error
            ? "border-red-600"
            : "border-[#102A43]/30 hover:border-[#102A43]/60",
          className
        )}
        {...props}
      />
      <FieldFooter id={id} error={error} />
    </div>
  );
}

export interface TextareaProps
  extends FieldWrapperProps,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {}

export function Textarea({
  id,
  label,
  required,
  hint,
  error,
  className,
  rows = 5,
  ...props
}: TextareaProps) {
  void hint;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <FieldHeader id={id} label={label} />
      <textarea
        id={id}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={cn(
          baseControlStyles,
          "min-h-[120px] resize-y leading-relaxed",
          error
            ? "border-red-600"
            : "border-[#102A43]/30 hover:border-[#102A43]/60",
          className
        )}
        {...props}
      />
      <FieldFooter id={id} error={error} />
    </div>
  );
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps
  extends FieldWrapperProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> {
  options: readonly SelectOption[];
  placeholder?: string;
}

export function Select({
  id,
  label,
  required,
  hint,
  error,
  options,
  placeholder = "Select an option",
  className,
  ...props
}: SelectProps) {
  void hint;
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-1.5">
      <FieldHeader id={id} label={label} />
      <div className="relative">
        <select
          id={id}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            baseControlStyles,
            "appearance-none pr-10 cursor-pointer",
            error
              ? "border-red-600"
              : "border-[#102A43]/30 hover:border-[#102A43]/60",
            className
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
          className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--navy)]"
        >
          <path d="M4 6L8 10L12 6" />
        </svg>
      </div>
      <FieldFooter id={id} error={error} />
    </div>
  );
}