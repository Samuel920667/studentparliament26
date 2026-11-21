"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "sdp-cookie-consent-v1";
const PREFERENCES_EVENT = "sdp-cookie-preferences";
type CookieChoice = "accepted" | "declined";

const subscribeReady = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

function readChoice(): CookieChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "accepted" || saved === "declined" ? saved : null;
  } catch {
    return null;
  }
}

export function CookieConsent() {
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverReady);
  const [choice, setChoice] = useState<CookieChoice | null>(readChoice);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const openPreferences = () => setEditing(true);
    const updateChoice = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setChoice(readChoice());
        setEditing(false);
      }
    };
    window.addEventListener(PREFERENCES_EVENT, openPreferences);
    window.addEventListener("storage", updateChoice);
    return () => {
      window.removeEventListener(PREFERENCES_EVENT, openPreferences);
      window.removeEventListener("storage", updateChoice);
    };
  }, []);

  const choose = (value: CookieChoice) => {
    try { localStorage.setItem(STORAGE_KEY, value); } catch {
      // The choice still applies to this visit when browser storage is unavailable.
    }
    setChoice(value);
    setEditing(false);
  };

  if (!ready || (choice && !editing)) return null;

  return (
    <section
      aria-labelledby="cookie-consent-title"
      className="fixed inset-x-0 bottom-0 z-30 p-4 sm:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-[2px] border-[1.5px] border-white/20 bg-[#0B1F33] p-5 text-white shadow-[0_8px_32px_rgba(11,31,51,0.24)] sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl space-y-2">
          <h2 id="cookie-consent-title" className="font-display text-lg font-bold text-white">
            Cookie preferences
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            Essential storage remembers your choice and keeps petition drafts available in this tab.
            Optional cookies are allowed only if you accept. We currently use no analytics or advertising cookies.
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3">
          <Button variant="outline-dark" size="sm" onClick={() => choose("declined")}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={() => choose("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </section>
  );
}

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(PREFERENCES_EVENT))}
      className="cursor-pointer text-slate-300 uppercase transition-colors hover:text-[#60A5FA] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]"
    >
      Cookie preferences
    </button>
  );
}
