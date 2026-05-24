# Auth Session Bridge

[中文文档](./README.zh-CN.md)

Auth Session Bridge converts ChatGPT Session or Codex Auth JSON into documents that other tools can import. Parsing and export run in the current browser tab. The interface opens in Chinese and can be switched to English.

[Open the application](https://whynotsleep.cc/auth-session-bridge/)

## Getting started

1. Prepare an input document. For ChatGPT Session, sign in to ChatGPT, open `https://chatgpt.com/api/auth/session`, and paste the returned JSON into the page. The application provides the same shortcut.
2. Select an output document format, then read the displayed warnings and account information.
3. Copy or download the generated JSON and import it into the target tool. Delete downloaded files and clear clipboard contents after import.

`Codex Auth` generates the `~/.codex/auth.json` shape. The exporter only forwards `id_token`, `access_token`, `refresh_token`, and `account_id` values present in the input. When login fields are missing, it reports an incomplete document and does not invent replacements.

The built-in example is for inspecting the interaction and output structure. Its identity and tokens cannot be used to sign in.

## Credential handling

Input and exported documents may grant account access. Use the page only on a trusted device.

- Parsing, checks, and export occur in memory in the current tab. The page does not write credentials to `localStorage`, `sessionStorage`, or `IndexedDB`.
- The page does not send input to an external service. The deployed Content Security Policy sets `connect-src 'none'`, which prevents application scripts from initiating runtime network connections.
- Inputs larger than 4 MiB, excessively nested data, and batches exceeding 250 accounts are rejected.
- Accounts containing only an `access token` cannot renew after the token expires, and the page reports this limitation.
- Synthetic `ID token` generation is off by default. When enabled, the generated value is not a sign-in credential.

Do not commit real credentials, paste them into issues, include them in screenshots, or send them through chat.

## Supported documents

| Output          | Generated content                                                                            |
| --------------- | -------------------------------------------------------------------------------------------- |
| `Codex Auth`    | `~/.codex/auth.json` shape, forwarding only login fields present in the input.               |
| `sub2api`       | Batch payload with expiry and automatic-pause fields.                                        |
| `CPA`           | Flat Codex token document used by CPA / CLIProxyAPI.                                         |
| `Cockpit`       | Flat Codex token document used by Cockpit Tools.                                             |
| `9router`       | Direct `access token` import without renewal fields.                                         |
| `AxonHub`       | ChatGPT auth document, exporting `refresh_token` only when supplied in the input.            |
| `Codex-Manager` | Token document with metadata fields such as `workspaceId` and `chatgptAccountId` when found. |

The application reads Codex Auth, ChatGPT Session, JWT `access token` JSON, and exported structures from the listed formats. It decodes readable identity and expiry information from JWT payloads, but does not verify whether a token still works.

## Development

Requires Node.js 24 and npm.

```bash
npm ci
npx playwright install chromium
npm run dev
npm run verify
```

`npm run verify` runs formatting checks, linting, strict type checking, unit tests with coverage thresholds, a production build, and browser tests at desktop, mobile, and 320 px narrow viewports.

Core modules:

```text
src/core/parse.ts       bounded reading of untrusted JSON
src/core/normalize.ts   normalized credential extraction
src/core/export.ts      target document generation
src/ui/app.ts           browser interaction and user-facing checks
```

When changing an adapter, commit non-secret test fixtures and cover both complete and missing-field inputs.

## License

MIT. Font license notices distributed with the build are in [`public/licenses/THIRD-PARTY-NOTICES.txt`](./public/licenses/THIRD-PARTY-NOTICES.txt).
