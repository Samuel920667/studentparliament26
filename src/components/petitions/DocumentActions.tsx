// src/components/petitions/DocumentActions.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { serializePetitionPlainText } from "@/lib/petition-generator";
import { cn } from "@/lib/utils";
import type { GeneratedPetition } from "@/types/petition";
import {hasErrors, validateGeneratedPetition} from "@/lib/validation";
import {printPetition} from "@/lib/print-petition";

export interface DocumentActionsProps {
  petition: GeneratedPetition;
  onDownloadPdf: (petition: GeneratedPetition) => Promise<string | void> | void;
  onDownloadDocx: (petition: GeneratedPetition) => Promise<string | void> | void;
  onStartNew: () => void;
}

interface ActionFeedback {
  type: "success" | "error";
  message: string;
}

export function DocumentActions({
  petition,
  onDownloadPdf,
  onDownloadDocx,
  onStartNew,
}: DocumentActionsProps) {
  const [feedback, setFeedback] = useState<ActionFeedback | null>(null);
  const [busyAction, setBusyAction] = useState<"pdf" | "docx" | null>(null);
  const [copyFallback, setCopyFallback] = useState(false);
  const checkDocument = () => {
    const errors = validateGeneratedPetition(petition);
    if (!hasErrors(errors)) return true;
    setFeedback({type: "error", message: Object.values(errors)[0] || "Complete your petition before exporting."});
    return false;
  };

  const handlePdf = async () => {
    if (!checkDocument()) return;

    try {
      setBusyAction("pdf");
      setFeedback(null);
      const filename = await onDownloadPdf(petition);
      setFeedback({
        type: "success",
        message: filename
          ? `Downloaded ${filename}. Check your device downloads folder.`
          : "PDF petition downloaded successfully.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error ? error.message : "Could not generate the PDF file. Try Print or Copy Text instead.",
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleDocx = async () => {
    if (!checkDocument()) return;

    try {
      setBusyAction("docx");
      setFeedback(null);
      const filename = await onDownloadDocx(petition);
      setFeedback({
        type: "success",
        message: filename
          ? `Downloaded ${filename}. Open it in Microsoft Word or Google Docs to print.`
          : "Word (.docx) petition downloaded successfully.",
      });
    } catch {
      setFeedback({
        type: "error",
        message:
          "Could not generate the Word document. Try downloading the PDF or copying the text instead.",
      });
    } finally {
      setBusyAction(null);
    }
  };

  const handleCopyText = async () => {
    if (!checkDocument()) return;
    try {
      await navigator.clipboard.writeText(serializePetitionPlainText(petition));
      setFeedback({
        type: "success",
        message: "Formal petition copied to clipboard.",
      });
    } catch {
      setCopyFallback(true);
      setFeedback({
        type: "error",
        message:
          "Select and copy the complete petition from the text box below.",
      });
    }
  };

  const handlePrint = () => {
    if (!checkDocument()) return;
    setFeedback(null);
    try {printPetition(petition);} catch {setFeedback({type: "error", message: "Could not open printing. Download PDF or Word instead."});}
  };

  return (
    <div className="sdp-no-print space-y-4 border-t border-[#102A43]/15 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            type="button"
            variant="primary"
            size="md"
            disabled={busyAction !== null}
            onClick={handlePdf}
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {busyAction === "pdf" ? "Generating PDF..." : "Download PDF"}
          </Button>

          <Button
            type="button"
            variant="navy"
            size="md"
            disabled={busyAction !== null}
            onClick={handleDocx}
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            {busyAction === "docx"
              ? "Generating Word File..."
              : "Download Word Document"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={busyAction !== null}
            onClick={handlePrint}
          >
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
            >
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={busyAction !== null}
            onClick={handleCopyText}
          >
            Copy Text
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="md"
          disabled={busyAction !== null}
          onClick={onStartNew}
        >
          Start a New Petition
        </Button>
      </div>

      {feedback ? (
        <p
          role={feedback.type === "error" ? "alert" : "status"}
          className={cn(
            "rounded-[2px] border px-4 py-3 text-xs font-medium",
            feedback.type === "error"
              ? "border-red-300 bg-red-50 text-red-800"
              : "border-[#2563EB]/30 bg-[#2563EB]/5 text-[#102A43]"
          )}
        >
          {feedback.message}
        </p>
      ) : null}
      {copyFallback ? <label className="block space-y-2 text-sm">Petition text<textarea readOnly rows={10} value={serializePetitionPlainText(petition)} onFocus={(event) => event.target.select()} className="w-full rounded border p-3" /></label> : null}
    </div>
  );
}
