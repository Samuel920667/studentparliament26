# studentparliament26
A site used to help student understand their student parliament entirely and draft petition concerning issues affecting them

The game starts in Casual mode. Smart normally spots threats but occasionally makes mistakes; Unbeatable is an optional minimax challenge. Unknown site URLs return a 404 page with a link home.

Production security headers restrict scripts, images, fonts, connections, and forms to the site's own resources, block embedded frames, and disable unused camera, microphone, location, and payment access. Inline scripts and styles remain allowed for static Next.js rendering; evaluation of strings as JavaScript is not allowed in production. Official external contact and registration links remain available.

Run `npm run lint`, `npm run build`, `npm run typecheck`, and `npm test` before deploying. The tests cover playable AI difficulty, 404 responses, browser security enforcement, and petition downloads. Run `npm audit --omit=dev` to check production dependency advisories.
