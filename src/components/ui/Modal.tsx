"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

let locks = 0;
let originalOverflow = "";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  label?: string;
  labelledBy?: string;
  className?: string;
  id?: string;
};

/** Native top-layer dialogs provide focus trapping and an inert background. */
export function Modal({ children, onClose, label, labelledBy, className, id }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previousFocus = document.activeElement;
    if (!locks++) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    dialog.showModal();
    return () => {
      dialog.close();
      if (!--locks) document.body.style.overflow = originalOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, []);
  return (
    <dialog
      ref={ref}
      id={id}
      aria-label={label}
      aria-labelledby={labelledBy}
      className={cn("sdp-dialog", className)}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]"
        )].filter((element) => element.tabIndex >= 0 && !element.matches(":disabled") && element.getClientRects().length);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first) return;
        if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      {children}
    </dialog>
  );
}

export function ModalPanel({
  children,
  className,
  backdropClassName = "bg-[#0B1F33]/50",
  ...props
}: ModalProps & { backdropClassName?: string }) {
  return (
    <Modal {...props}>
      <div
        className={cn("fixed inset-0 flex items-center justify-center p-4 backdrop-blur-[3px] sm:p-6", backdropClassName)}
        onClick={(event) => { if (event.target === event.currentTarget) props.onClose(); }}
      >
        <div className={cn("relative max-h-[85vh] w-full overflow-y-auto rounded-[2px] border border-[#102A43]/20 bg-white p-6 shadow-xl sm:p-8", className)}>
          {children}
        </div>
      </div>
    </Modal>
  );
}

export function ModalCloseButton({ onClose, label }: { onClose: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClose}
      aria-label={label}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] text-[#4B5563] transition-colors hover:bg-[#F5F5F0] hover:text-[#111827] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1F33]"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    </button>
  );
}
