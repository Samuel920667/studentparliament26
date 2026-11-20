"use client";

import {useSyncExternalStore} from "react";
import {readSavedDraft} from "@/lib/petition-draft";
import {PetitionForm} from "./PetitionForm";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function PetitionWorkspace() {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  return <PetitionForm key={ready ? "restored" : "initial"} initialDraft={ready ? readSavedDraft() : null} persistenceEnabled={ready} />;
}
