import type {GeneratedPetition} from "@/types/petition";
import {getPetitionBlocks} from "@/lib/petition-document";
import {cn} from "@/lib/utils";

export function PetitionDocument({petition}: {petition: GeneratedPetition}) {
  return (
    <article aria-label="Formal petition document" className="sdp-document rounded-[2px] border border-[#102A43]/25 bg-white px-5 py-8 text-[#111827] sm:px-12 sm:py-12">
      {getPetitionBlocks(petition).map((block, index) => (
        <p key={index} style={{marginBottom: `${block.gap ?? 2}pt`}} className={cn(
          "whitespace-pre-wrap wrap-anywhere text-[15px] leading-[1.5]",
          block.kind && "font-bold",
          block.kind === "letterhead" && "text-base tracking-wide",
          block.kind === "subject" && "border-y border-black/20 py-3",
          block.align === "center" && "text-center", block.align === "right" && "text-right",
          block.keepNext && "sdp-keep-next",
        )}>{block.text}</p>
      ))}
    </article>
  );
}
