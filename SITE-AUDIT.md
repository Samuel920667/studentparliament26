# SDP Portal code audit

Reviewed on 20 November 2026. Scope: the current working tree of `sdp-portal`, including all six public page routes, shared components, petition generation/export utilities, game logic, static data/assets, package dependencies, and project configuration. Existing uncommitted changes were included. I made no application-code changes. Senator photo/data changes appeared during the review and received a follow-up source review; build/HTTP results refer to the version built earlier in the audit.

The production build works, but the petition workflow has release-blocking defects: the advertised downloads are disconnected, and printing hides required document content. Fix those before treating the document tool as ready for students.

## Verification

| Check | Result |
| --- | --- |
| Production build: `npm.cmd run build` | Passed; all six public routes prerendered successfully. |
| TypeScript: `node node_modules/typescript/bin/tsc --noEmit --incremental false` | Passed. |
| Lint: `npm.cmd run lint` | Failed: 3 errors and 10 warnings. |
| Local production HTTP checks | `/`, `/about`, `/contact`, `/petitions`, `/senators`, `/game` returned 200; an unknown route returned 404. |
| Dependency audit: `npm.cmd audit --json` | 4 moderate findings from one dependency chain; no high or critical findings reported. |
| Petition handler checks | Confirmed missing download callbacks and loss of manual subject/body edits after going back and generating again. These were in-memory handler checks, not browser clicks. |
| Validation checks | Punctuation-only phone and matriculation values were accepted. |
| Existing export utilities | Both produced parseable four-page PDFs for a long sample; both removed accented characters and used inaccurate text-width estimates. Both Word exports were HTML `.doc` files. HTML escaping passed a sample injection check. |
| Game logic samples | Win/draw detection and an immediate winning AI move passed. This was not exhaustive game verification. |

No browser automation package was installed. Visual rendering, actual print pagination, keyboard interaction, screen-reader output, real device behavior, and live deployment settings were not exercised. Layout findings below identify specific source problems and the browser checks needed to confirm their extent. The temporary production server was stopped after the checks.

## Fix first

### 1. High: PDF and Word download buttons silently do nothing

**Files:** `src/components/petitions/PetitionForm.tsx:327`, `src/components/petitions/DocumentActions.tsx:12`, `:32`, `:56`.

`PetitionForm` passes only `petition` and `onStartNew` to `DocumentActions`. The download callbacks are optional, and each handler immediately returns when its callback is absent. The buttons still look enabled. The active `/petitions` page renders this form; neither export utility is connected to it.

**Fix:** implement and connect both exporters, using the final edited `GeneratedPetition`. Make callbacks required when buttons are shown, or disable unavailable actions with a useful explanation. Verify a completed petition downloads both files and retains edits to its date, subject, and body.

### 2. High: print CSS removes the letterhead and signatory information

**Files:** `src/app/globals.css:136`, `src/components/petitions/PetitionPreview.tsx:90`, `:203`, `src/components/petitions/DocumentActions.tsx:95`.

The print rule hides every `header`, `footer`, and `nav` with `display: none !important`. The petition uses its own `header` for the official letterhead and `footer` for the closing, name, matriculation number, department, phone number, and signature line. Setting their visibility back to visible cannot override `display: none`.

There are additional print risks: the document is absolutely positioned inside positioned/overflow-hidden ancestors, hidden surrounding content retains layout space, and printing while editing leaves the body in a fixed-row textarea.

**Fix:** hide the site chrome with explicit classes, preserve the document's internal elements, and print a complete static document in normal paginated flow. Verify one-page and multi-page print previews, including printing while the editor is open. Check that the signature and all paragraphs appear.

## Petition reliability

### 3. Medium: returning to the inputs discards manual edits

**File:** `src/components/petitions/PetitionForm.tsx:95`.

Reproduction: generate a petition, edit the subject/body in preview, select “Back to Petition Inputs,” then generate again without changing the inputs. `handleGeneratePreview` always replaces the document and clears `isManuallyEdited`. The edited subject and body are lost.

**Fix:** reuse the existing preview when inputs are unchanged. When inputs change, offer an explicit choice to regenerate or retain the edited draft. Keep “Reset Draft” as an intentional destructive action.

### 4. Medium: personal-detail validation accepts unusable identifiers

**File:** `src/lib/validation.ts:8`.

The phone regex counts formatting characters toward the minimum length and does not require digits. `----------` and `((((((((((` both pass. The matriculation regex also accepts `.....`, `-----`, and `/////`. A two-token name containing only numbers also meets the name check.

**Fix:** normalize phone formatting, validate the resulting digits and supported country/local formats, and validate matriculation numbers against the university's actual accepted formats. Preserve legitimate names with accents, apostrophes, or hyphens. Test realistic valid values as well as punctuation-only values.

### 5. Medium: preview edits bypass document validation

**Files:** `src/components/petitions/PetitionPreview.tsx:104`, `:141`, `:173`, `src/components/petitions/PetitionForm.tsx:132`.

Initial inputs are validated, but the preview lets users erase the date, subject, or body. “Done Editing” only toggles the editor, and copy/print actions accept the resulting document. Most fields also have no maximum length, and preview text lacks wrapping for long unbroken values.

**Fix:** validate the final document before completing edits and before each output action. Set reasonable field limits, explain them beside the inputs, and wrap long names, subjects, URLs, and identifiers without changing their content.

### 6. Medium: existing export implementations use a different document model

**Files:** `src/types/petition.ts:39`, `src/lib/petition-export.ts:2`, `src/lib/export-petition.ts:2`, `src/components/petitions/PetitionWorkspace.tsx`.

The active workflow exports a `GeneratedPetition` with `body`, `signatoryName`, and `phoneNumber`. Both older exporters instead expect a different `PetitionFormData` with `statement`, `fullName`, `phone`, `level`, and `email`. Directly wiring them would fail; rebuilding output from original form inputs would omit preview edits. The two export files have identical behavior and differ only in formatting. `PetitionWorkspace.tsx` is empty and unused.

The Word functions generate HTML with an `.doc` extension and an `application/msword` MIME type. They do not generate the `.docx` format referred to by `DocumentActions`.

**Fix:** choose one shared final document model and one export implementation. Generate genuine DOCX with the installed `docx` library if DOCX is the intended format. Remove obsolete duplicates and the empty workspace after the replacement is connected. Verify preview, copied text, PDF, and Word contain the same edited content.

### 7. Medium, dormant code: PDF exports corrupt accented names and exceed their margins

**Files:** `src/lib/petition-export.ts:32`, `:76`; corresponding functions in `src/lib/export-petition.ts`.

`sanitizePdfText` removes everything outside ASCII. The test name `Adébáyọ̀ Ọlúwásẹ́un` became `Adby lwsun`. Text wrapping uses guessed glyph widths: a 76-character line of `d` was estimated at 446.88 points but actually measures 456 points in Times-Roman at 12pt, exceeding the 451.28-point content width.

These utilities currently have no callers, so this is a defect to resolve before connecting them, rather than evidence of current downloads corrupting data.

**Fix:** embed a font supporting the required characters and use the font's real measurements to wrap and align text. A suitable PDF library can handle measurement and pagination. Test accented names, long URLs, long subjects, paragraph breaks, and multi-page letters.

### 8. Improvement: protect drafts from accidental clearing and refresh

**File:** `src/components/petitions/PetitionForm.tsx:45`, `:137`, `:142`.

Drafts live only in React state, and reset/start-new actions clear or replace them immediately. Refresh or tab closure loses the draft. This Next.js version can preserve route state through Activity during navigation, so ordinary navigation does not necessarily lose it; that is not durable storage.

**Fix:** add clear warnings for discarding a nonempty edited draft and protect against refresh/tab closure while work is unsaved. If draft recovery is required, provide explicit device-local saving, a clear retention policy, and a clear-draft action because petitions contain personal information.

## Navigation, accessibility, and mobile behavior

### 9. Medium: dialogs do not manage keyboard focus

**Files:** `src/components/layout/Navbar.tsx:198`, `src/components/about/CommitteesShowcase.tsx:179`, `src/components/game/TicTacToeGame.tsx:476`.

All three declare modal dialogs, but none moves focus into the dialog, traps focus, makes the background inert, or explicitly returns focus to the trigger. Scroll locking and an Escape handler do not provide those behaviors. Keyboard users can remain on controls behind an overlay.

**Fix:** use an accessible dialog primitive or native dialog with the required focus behavior. Verify opening, Tab/Shift+Tab, Escape, background interaction, and focus restoration for all three overlays.

### 10. Medium: committee and game dialogs sit below the sticky navbar

**Files:** `src/components/background/BackgroundPattern.tsx:42`, `src/components/layout/Navbar.tsx:143`, `src/components/about/CommitteesShowcase.tsx:183`, `src/components/game/TicTacToeGame.tsx:480`.

Page content sits inside a `relative z-10` stacking context. The nested dialogs' `z-50` cannot escape that context to cover the site header at `z-40`. The navbar remains above those modal overlays, allowing another overlay to be opened and creating competing scroll locks.

**Fix:** render full-screen dialogs through a portal outside the page stacking contexts and centralize modal/scroll-lock behavior. Verify the overlay covers the navbar and background controls are unavailable.

### 11. Medium: full-screen navigation has no scrollable area

**File:** `src/components/layout/Navbar.tsx:202`, `:243`.

The fixed menu locks body scrolling but has no `overflow-y-auto` content region. Four large links, the top bar, spacing, and bottom actions exceed short viewport heights. The code has no way to scroll to any clipped controls.

**Fix:** make the menu content scrollable using a constrained flex child such as `min-h-0 flex-1 overflow-y-auto`; use viewport units appropriate to mobile browser chrome. Verify 320px-wide screens, landscape phone heights, and 200% zoom. The exact clipping was not measured in a browser.

### 12. Medium: long petition buttons have no mobile wrapping strategy

**Files:** `src/components/ui/Button.tsx:75`, `src/components/petitions/PetitionForm.tsx:215`, `:273`, `src/app/globals.css:54`.

Every shared button uses `whitespace-nowrap`. Long labels such as “Continue to Petition Details” sit in a card with nested horizontal padding. Narrow screens can have less space than the button's intrinsic width, while global `overflow-x: hidden` can conceal the overflow.

**Fix:** allow long labels to wrap, use full-width actions on small screens, and reduce excessive nested padding where needed. Verify every petition step at 320/360/375px widths and at increased text size. This is a source-identified layout risk, not a completed visual measurement.

### 13. Medium: the gallery cannot be persistently paused and uses incomplete tab semantics

**File:** `src/components/home/PhotoCarousel.tsx:25`, `:44`, `:215`.

The gallery advances every four seconds. It pauses during mouse hover or active touch, but there is no persistent pause button, no pause on keyboard focus, and no reduced-motion handling. Indicator buttons use tab/tablist roles without corresponding tabpanels or the expected keyboard behavior.

**Fix:** provide a pause/play control, pause while keyboard focus is inside, and respect reduced-motion preferences. Use normal labeled slide-selection buttons or implement the full tabs pattern. Verify keyboard use and a screen reader.

### 14. Accessibility improvements: announce form steps, search results, and game state

**Files:** `src/components/petitions/PetitionForm.tsx:85`, `src/components/senators/SenatorDirectory.tsx:16`, `:183`, `src/components/game/TicTacToeGame.tsx:391`, `:436`.

Form transitions scroll the page but do not focus the new step heading or first invalid field. Search results and game-turn/win messages have no live announcement. “View Contact” is removed when expanded instead of remaining a stable disclosure control. The game declares a grid without row elements or grid keyboard navigation. There is also no skip-to-main-content link in the shared layout.

**Fix:** focus step headings/errors appropriately, add concise status announcements, keep a stable contact disclosure with `aria-expanded` and `aria-controls`, and either implement a proper keyboard grid or use simpler grouped buttons. Add a skip link. Preserve the existing useful input labels and error associations.

## Engineering and deployment

### 15. Medium: lint fails and there is no automated regression gate

**Files:** `src/components/game/TicTacToeGame.tsx:128`, `:149`, `src/components/layout/Navbar.tsx:119`, `src/components/ui/Button.tsx:86`, `package.json:5`.

Three `react-hooks/set-state-in-effect` errors come from synchronous state updates in effects. Ten warnings come from unused destructured values in `Button`. A passing production build does not mean lint passed; the separate lint command failed. No test script, test suite, or repository CI configuration was found.

**Fix:** derive redundant state from existing values and update event-owned state in event handlers; retain effects for timers and external synchronization. Clean up the button prop handling. Add CI that runs lint, TypeScript, build, and a small set of useful workflow checks: real downloads, edit preservation, invalid identifiers, and complete printed content. Do not disable the rules merely to turn the check green.

### 16. Medium: unused shadcn CLI introduces the reported vulnerable dependency chain

**File:** `package.json:25`.

The audit reports `shadcn → ts-morph → @ts-morph/common → minimatch`, with four moderate entries stemming from [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249), a potential denial of service through glob amplification. Npm reports no automatic fix. The CLI is listed as a production dependency but is not imported by the site's source. This is an installed dependency finding, not evidence of a remotely exploitable petition endpoint.

Other packages have no current source usage, including the form/resolver/Zod stack, icon/animation/UI helpers, `cn`, and document libraries. Some document dependencies may be appropriate for fixing exports. Unused dependencies increase install and maintenance cost; they do not necessarily increase browser bundle size because unused code may be excluded.

**Fix:** remove unused packages, especially the unused shadcn CLI, or update the tooling when a compatible fixed dependency chain is available. If the CLI is needed only during development, classify it accordingly and still track its advisory. Keep only the document libraries selected for the final implementation. Re-run the audit; avoid a blanket forced update.

### 17. Hardening: the local production server sends no explicit security headers

**File:** `next.config.ts:3`.

HTTP checks found no Content-Security-Policy, X-Frame-Options, or X-Content-Type-Options headers. Hosting infrastructure could supply these in production, but no deployment configuration was available to verify that.

**Fix:** configure frame restrictions, `nosniff`, and an appropriate referrer policy; design and test CSP against the actual Next.js output. Do not paste a nonce-based CSP into this statically prerendered app without addressing the framework's rendering requirements. Verify HTTPS and final response headers on the deployed domain. This is defense in depth, not a demonstrated injection vulnerability.

### 18. SEO and performance improvements

**Files:** `src/app/layout.tsx:36`, `src/components/home/PhotoCarousel.tsx:127`, `src/data/gallery.ts:9`.

Titles, descriptions, language, and one H1 per public page are present. Canonical URLs, social preview metadata/images, robots, and sitemap routes are absent; `/robots.txt` and `/sitemap.xml` returned 404. The gallery uses plain images without intrinsic dimensions, serves original JPEGs, and has generic numbered alt text. Missing image sizing can shift layout during loading.

**Fix:** add metadata using the real production domain, suitable social preview assets, and sitemap/robots routes. Use reserved image dimensions or an intentional aspect ratio, responsive image delivery, and meaningful photo descriptions. Preserve the gallery's already implemented lazy loading for later photos. Measure layout shift and loading on mobile before claiming a performance improvement.

During the review, `public/senators/sadare-doyinsola-ayomide.jpg` was added at 10,279,748 bytes (about 10.3 MB). The photo fields were still commented out when last inspected, so it was not being loaded by the directory. Resize/compress this asset before connecting it to the 96px profile image; the new directory renderer uses a plain image element and would otherwise request the original file.

### 19. Maintenance and content improvements

**Files:** `README.md`, `src/data/site.ts:17`, `src/data/senators.ts:145`, `next.config.ts:7`.

The README is still the starter template and incorrectly describes Geist rather than the actual font setup. Session/year values and representatives are hardcoded. The Faculty of Law entry contains only the name “Charity,” so its identity should be completed or verified. Build/start warn about a lockfile outside the repository; this did not prevent successful builds.

**Fix:** document the actual local setup, architecture, checks, petition limitations, export flow, and deployment process. Establish who maintains session and contact data. If the outside-lockfile warning persists in the intended environment, explicitly configure the appropriate project/tracing root.

The contact reveal button is presentation only: all senator numbers are included in publicly delivered client data. Do not treat it as access control. There was no stated requirement to keep these official contacts private.

## Recommended order

1. Connect downloads to the edited document and repair print output.
2. Consolidate export code, produce the intended Word format, and preserve Unicode/layout.
3. Prevent accidental edit loss and strengthen input/final-document validation.
4. Fix dialogs, menu scrolling, mobile buttons, and carousel accessibility.
5. Resolve lint errors, prune vulnerable unused dependencies, and add regression checks/CI.
6. Complete deployment headers, SEO, image sizing, documentation, and content maintenance.

No backend petition submission, account system, or database exists in this code. That is consistent with the visible notice that this portal prepares documents without transmitting them. Adding authentication, database storage, or submission tracking would be a separate product requirement, not a necessary fix for the current drafting-only design.
