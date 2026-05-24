# Agent Notes

## Project map

- `src/core/parse.ts` reads untrusted JSON with size, depth, node and credential limits.
- `src/core/normalize.ts` extracts one normalized credential record from each supported input shape.
- `src/core/export.ts` is the source of truth for target document schemas.
- `src/core/jwt.ts` decodes readable JWT payloads and builds explicitly synthetic ID-token-shaped metadata.
- `src/ui/app.ts` owns browser interaction, status rendering and localized checks.
- `src/i18n.ts` owns all user-visible UI strings.
- `src/styles.css` owns the full visual system. Keep the warm paper, dark jade and restrained utility-app direction.
- `tests/core/` covers parser, normalizer and exporter behavior.
- `e2e/app.spec.ts` covers browser privacy guarantees, layout and key conversion flows.

## Verification

Use Node.js 24. The full gate is:

```bash
npm run verify
```

For narrower loops:

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Playwright uses Vite preview on `127.0.0.1:4173` and captures layout screenshots in `test-results/`.

## Boundaries

- Never commit real session, auth, token, credential or export JSON. `.gitignore` intentionally blocks common credential filenames.
- Do not add runtime network calls. The deployed CSP uses `connect-src 'none'`, and the product promise depends on local-only conversion.
- Do not persist pasted input or generated output in `localStorage`, `sessionStorage`, IndexedDB, cookies or remote services.
- Keep synthetic ID tokens visibly described as unsigned metadata. They are not OpenAI-signed login credentials.
- When changing a target adapter, add non-secret tests for complete input, missing-field input and warning behavior.
- Do not hand-edit `dist/`, `coverage/` or `test-results/`. Regenerate them through the documented commands.
