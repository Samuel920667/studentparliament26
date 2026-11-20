import {createRoot} from "react-dom/client";
import {flushSync} from "react-dom";
import {PetitionDocument} from "@/components/petitions/PetitionDocument";
import type {GeneratedPetition} from "@/types/petition";

/** Keep printing outside app layout, overflow and Activity wrappers. */
export function printPetition(petition: GeneratedPetition) {
  if (document.getElementById("petition-print-root")) return;
  const container = document.createElement("div");
  container.id = "petition-print-root";
  document.body.appendChild(container);
  const root = createRoot(container);
  const cleanup = () => {
    window.removeEventListener("afterprint", cleanup);
    document.body.classList.remove("sdp-printing");
    root.unmount(); container.remove();
  };
  window.addEventListener("afterprint", cleanup, {once: true});
  try {
    flushSync(() => root.render(<PetitionDocument petition={petition} />));
    document.body.classList.add("sdp-printing");
    window.print();
  } catch (error) { cleanup(); throw error; }
}
