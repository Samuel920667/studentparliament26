# SDP Portal

Next.js 16 / React 19 site for the Student Delegatory Parliament at Veritas University Abuja. It provides a senator directory, committee information, contacts, a petition drafting tool, and Tic-Tac-Toe. Petitions are prepared locally; the site has no server submission endpoint, accounts, or database.

## Run locally

Use Node.js 24, matching the Vercel runtime pinned in `package.json`. Install with `npm ci`, then run `npm run dev`. In PowerShell, use `npm.cmd` if the machine blocks the npm PowerShell script. The site runs at http://localhost:3000.

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the real public origin before a production build. On Vercel, the production-domain environment variable is used automatically. Without a public origin, canonical URLs and sitemap entries are deliberately omitted instead of publishing localhost links.

Production: `npm run build`, then `npm run start`. The app supplies frame and object restrictions, nosniff, and a referrer policy. Its CSP permits the scripts and styles used by Next.js. Vercel supplies HTTPS.

## Deploy to Vercel

1. Push this project's current files, including `src`, `public`, `package-lock.json`, and `vercel.json`, to a GitHub repository. Many project files are currently untracked, so include them before pushing. Local environment files, dependencies, and `.next` output stay ignored.
2. Import that repository into Vercel and choose the **Next.js** framework. If the repository contains this project's contents directly, keep Root Directory at `./`. If it contains the parent `TRIPLE VISION` folder, set Root Directory to `sdp-portal`.
3. Use Node.js **24.x**. `vercel.json` sets Install Command to `npm ci` and Build Command to `npm run build`; leave Output Directory at the framework default.
4. Deploy. No API keys or database are required. The Vercel production domain supplies canonical URLs, social previews, and the sitemap automatically. Preview deployments request no indexing.
5. For a custom domain, add it under Vercel's project Domains settings, then set `NEXT_PUBLIC_SITE_URL` to its full HTTPS origin in the Production environment and redeploy. Leave this variable unset to use the default Vercel domain.

After deployment, open `/`, `/leadership`, `/senators`, `/petitions`, `/robots.txt`, and `/sitemap.xml`. Check a contact reveal and a petition PDF/DOCX download. Font files are served from `public/fonts`; downloads and draft storage run in the browser.

## Checks

Run `npm run lint`, `npm run build`, `npm run typecheck`, and `npm test`. The browser tests start a production server at port 3187, so build first. Windows tests use the installed Microsoft Edge browser. Override with `PLAYWRIGHT_CHANNEL=chrome` when needed. Linux/CI: install Chromium with `npx playwright install --with-deps chromium`. Deployment checks cover public routes, font assets, headers, canonical origins, sitemap behavior, and preview indexing.

## Petition flow

`PetitionWorkspace` restores a versioned draft from session storage after hydration. `PetitionForm` validates personal details and complaint inputs, preserves unchanged edited drafts, and asks before regenerating or clearing edits. A draft is retained in this tab only; Start a New Petition clears it. Browser storage failure is reported. There is no server persistence.

`petition-document.ts` defines the content shared by the preview, copy, print, PDF, and DOCX outputs. Exports validate the final edited document. PDF uses pdf-lib, actual font measurements, and embedded Source Serif 4 fonts; DOCX uses docx. Unsupported PDF characters produce a useful error rather than silently disappearing. Word and copy remain available for those characters.

Printing creates a static document at body level and removes it after printing, so the editor, application layout, and page overflow cannot truncate the letter. Export libraries load on demand. Font files and the SIL Open Font License are in `public/fonts`.

## Accessibility and assets

Shared native dialogs live in the browser's top layer, trap focus, make background controls inert, and restore focus and scrolling when closed. The gallery supports arrow-key navigation and pauses during pointer interaction. Inputs have labels, associated errors, limits, and focus handling.

Profile and gallery photos are served from `public/senators` and `public/gallery`. Profile avatars display initials if a photo is missing. Use descriptive gallery alt text and preserve the reserved slide dimensions when adding photos.

## Maintain official information

Update `src/data/site.ts` for the legislative session, clerk contacts, and social links; `src/data/senators.ts` for elected representatives; `src/data/leadership.ts` for principal officers; `src/data/committees.ts` for committee mandates and chairpersons; and `src/data/gallery.ts` for photos and descriptions. Verify names, phone numbers, roles, and session dates with the SDP before publishing updates. Phone-reveal controls are presentation, not privacy protection: these official contacts are public client data.

Shared UI lives in `src/components/ui`: `Modal` handles dialog focus, Escape, and scroll locking; `ModalPanel` supplies the existing committee/officer panel layout; `ModalCloseButton` supplies its single header close control. `ProfileAvatar` handles photo failures and initials while callers keep their existing styles. `ContactIcons` holds the shared phone and WhatsApp SVGs. Keep page-specific layouts in their feature folders.

The site fonts are Space Grotesk, Inter, and IBM Plex Mono, downloaded and self-hosted by Next.js at build time. Source Serif 4 is used for document preview/PDF/print; Word uses Times New Roman. The social preview image is `public/social-preview.png`.
