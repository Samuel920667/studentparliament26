import {test, expect} from "@playwright/test";
import {readFile} from "node:fs/promises";
import {PDFDocument} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import JSZip from "jszip";
import {generateFormalPetition} from "../src/lib/petition-generator";
import {createPetitionPdf, createPetitionDocx, wrapPdfText} from "../src/lib/petition-export";
import {validatePersonalDetails, validatePetitionDetails} from "../src/lib/validation";

const form = {fullName: "Ad\u00e9b\u00e1y\u1ecd\u0300 \u1eccl\u00faw\u00e1s\u1eb9\u0301un", matricNumber: "VUG/CSC/22/1234", department: "Computer Science", phoneNumber: "+234 801 234 5678", title: "Water supply disruption", category: "Campus Welfare & Facilities" as const, account: "Water has not been available in Hostel B since Monday morning.", requestedAction: "Please restore the water supply."};

test("valid identifiers pass; punctuation-only identifiers and unknown categories fail", () => {
  expect(validatePersonalDetails(form)).toEqual({});
  for (const phoneNumber of ["----------", "((((((((((", "+234 80", "080123456789"]) expect(validatePersonalDetails({...form, phoneNumber}).phoneNumber).toBeTruthy();
  for (const matricNumber of [".....", "-----", "/////", "123456"]) expect(validatePersonalDetails({...form, matricNumber}).matricNumber).toBeTruthy();
  expect(validatePersonalDetails({...form, fullName: "123 456"}).fullName).toBeTruthy();
  expect(validatePetitionDetails({...form, category: "Made up" as never}).category).toBeTruthy();
});

test("PDF uses embedded Unicode fonts and real widths and paginates long content", async () => {
  const fonts = {regular: await readFile("public/fonts/SourceSerif4-Regular.otf"), bold: await readFile("public/fonts/SourceSerif4-Bold.otf")};
  const document = await PDFDocument.create(); document.registerFontkit(fontkit);
  const font = await document.embedFont(fonts.regular);
  const word = "d".repeat(350);
  const lines = wrapPdfText(word, font, 12, 481.88);
  expect(lines.join("")).toBe(word);
  for (const line of lines) expect(font.widthOfTextAtSize(line, 12)).toBeLessThanOrEqual(481.88);
  expect(wrapPdfText(form.fullName, font, 12, 481.88).join(" ")).toBe(form.fullName);
  const petition = {...generateFormalPetition(form), body: (form.account + "\n\n").repeat(100)};
  const bytes = await createPetitionPdf(petition, fonts);
  const pdf = await PDFDocument.load(bytes);
  expect(pdf.getAuthor()).toBe(form.fullName);
  expect(pdf.getPageCount()).toBeGreaterThan(1);
});

test("DOCX contains final edited text, accented names, and escaped user content", async () => {
  const petition = {...generateFormalPetition(form), subject: "MANUALLY CORRECTED SUBJECT", body: "Manually reviewed petition text including <script>alert(1)</script>."};
  const docx = await createPetitionDocx(petition);
  const zip = await JSZip.loadAsync(await docx.arrayBuffer());
  const xml = await zip.file("word/document.xml")!.async("string");
  expect(xml).toContain(form.fullName);
  expect(xml).toContain(petition.subject);
  expect(xml).toContain("&lt;script&gt;");
  expect(xml).toContain(petition.phoneNumber);
});
