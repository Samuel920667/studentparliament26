import type {PDFFont} from "pdf-lib";
import type {GeneratedPetition} from "@/types/petition";
import {getPetitionBlocks} from "./petition-document";
import {hasErrors, validateGeneratedPetition} from "./validation";

export interface PetitionFonts {regular: Uint8Array; bold: Uint8Array}
function assertValid(petition: GeneratedPetition) {
  const errors = validateGeneratedPetition(petition);
  if (hasErrors(errors)) throw new Error(Object.values(errors)[0]);
}

/** Real font measurements and grapheme wrapping preserve names and long tokens. */
export function wrapPdfText(text: string, font: PDFFont, size: number, width: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.replace(/\r\n?/g, "\n").split("\n")) {
    let current = "";
    for (const word of paragraph.trim().split(/\s+/)) {
      if (!word) continue;
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= width) {current = candidate; continue;}
      if (current) {lines.push(current); current = "";}
      for (const {segment} of new Intl.Segmenter("en", {granularity: "grapheme"}).segment(word)) {
        if (current && font.widthOfTextAtSize(current + segment, size) > width) {lines.push(current); current = "";}
        current += segment;
      }
    }
    lines.push(current);
  }
  return lines;
}

export async function createPetitionPdf(petition: GeneratedPetition, fonts: PetitionFonts): Promise<Uint8Array> {
  assertValid(petition);
  const [{PDFDocument, rgb}, {default: fontkit}] = await Promise.all([import("pdf-lib"), import("@pdf-lib/fontkit")]);
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  const [regular, bold] = await Promise.all([document.embedFont(fonts.regular), document.embedFont(fonts.bold)]);
  document.setTitle(petition.subject); document.setAuthor(petition.signatoryName);
  const pageSize: [number, number] = [595.28, 841.89];
  const margin = 56.7, width = pageSize[0] - 2 * margin, lineHeight = 18;
  let page = document.addPage(pageSize), y = pageSize[1] - margin;
  const measured = getPetitionBlocks(petition).map((block) => {
    const font = block.kind ? bold : regular;
    const size = block.kind === "letterhead" ? 13 : 12;
    const supported = new Set(font.getCharacterSet());
    for (const character of block.text) {
      if (!/\s/.test(character) && !supported.has(character.codePointAt(0)!)) {
        throw new Error(`The PDF font cannot display "${character}". Download Word instead or replace that character.`);
      }
    }
    return {block, font, size, lines: wrapPdfText(block.text, font, size, width)};
  });
  for (let i = 0; i < measured.length; i++) {
    const {block, font, size, lines} = measured[i];
    let height = lines.length * lineHeight + (block.gap ?? 2);
    if (block.keepNext) {
      for (let next = i + 1; next < measured.length; next++) {
        height += measured[next].lines.length * lineHeight + (measured[next].block.gap ?? 2);
        if (!measured[next].block.keepNext) break;
      }
    }
    if (height <= pageSize[1] - 2 * margin && y - height < margin) {page = document.addPage(pageSize); y = pageSize[1] - margin;}
    for (const line of lines) {
      if (y - lineHeight < margin) {page = document.addPage(pageSize); y = pageSize[1] - margin;}
      const lineWidth = font.widthOfTextAtSize(line, size);
      const x = block.align === "center" ? (pageSize[0] - lineWidth) / 2 : block.align === "right" ? pageSize[0] - margin - lineWidth : margin;
      page.drawText(line, {x, y: y - size, size, font, color: rgb(0, 0, 0)});
      y -= lineHeight;
    }
    y -= block.gap ?? 2;
  }
  return document.save();
}

export async function createPetitionDocx(petition: GeneratedPetition): Promise<Blob> {
  assertValid(petition);
  const {Document, Packer, Paragraph, TextRun, AlignmentType} = await import("docx");
  const children = getPetitionBlocks(petition).map((block) => new Paragraph({
    alignment: block.align === "center" ? AlignmentType.CENTER : block.align === "right" ? AlignmentType.RIGHT : AlignmentType.LEFT,
    keepNext: block.keepNext, spacing: {after: (block.gap ?? 2) * 20, line: 360},
    children: block.text.split("\n").map((text, index) => new TextRun({text, break: index ? 1 : 0, bold: Boolean(block.kind), size: block.kind === "letterhead" ? 26 : 24})),
  }));
  return Packer.toBlob(new Document({
    title: petition.subject, creator: petition.signatoryName,
    styles: {default: {document: {run: {font: "Times New Roman", size: 24}}}},
    sections: [{properties: {page: {size: {width: 11906, height: 16838}, margin: {top: 1134, bottom: 1134, left: 1134, right: 1134}}}, children}],
  }));
}

export function petitionFilename(petition: GeneratedPetition, extension: "pdf" | "docx"): string {
  const name = petition.subject.normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64);
  return `${name || "sdp-petition"}.${extension}`;
}
function downloadBlob(blob: Blob, filename: string): string {
  const url = URL.createObjectURL(blob), link = document.createElement("a");
  link.href = url; link.download = filename;
  document.body.appendChild(link); link.click(); link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
  return filename;
}
let fontRequest: Promise<PetitionFonts> | undefined;
function loadFonts() {
  fontRequest ??= Promise.all(["Regular", "Bold"].map(async (weight) => {
    const response = await fetch(`/fonts/SourceSerif4-${weight}.otf`);
    if (!response.ok) throw new Error("Could not load the PDF fonts. Try again or download Word.");
    return new Uint8Array(await response.arrayBuffer());
  })).then(([regular, bold]) => ({regular, bold})).catch((error) => {fontRequest = undefined; throw error;});
  return fontRequest;
}
export async function downloadPetitionPdf(petition: GeneratedPetition): Promise<string> {
  const bytes = await createPetitionPdf(petition, await loadFonts());
  return downloadBlob(new Blob([Uint8Array.from(bytes).buffer], {type: "application/pdf"}), petitionFilename(petition, "pdf"));
}
export async function downloadPetitionDocx(petition: GeneratedPetition): Promise<string> {
  return downloadBlob(await createPetitionDocx(petition), petitionFilename(petition, "docx"));
}
