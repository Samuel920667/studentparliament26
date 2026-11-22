# studentparliament26
A site used to help student understand their student parliament entirely and draft petition concerning issues affecting them

The header and menu use small inline WebP copies of the university and SDP logos, so a fresh visit does not wait for separate logo downloads or image optimization. After replacing `public/veritas-logo.png` or `public/sdp-logo.png`, run `npm run generate:logos` to update the embedded copies before building.

After `npm run build`, run `npm test -- tests/navigation.spec.ts` to check the menu on desktop and smaller viewports. For mobile WebKit checks, install the browser with `npm exec -- playwright install webkit`, then run `npm test -- --config=playwright.webkit.config.ts`. These checks emulate iPhone viewports; Safari's browser toolbar and device safe areas should also be checked on a physical iPhone.
