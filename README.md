# Auth Session Bridge

[中文文档](./README.zh-CN.md)

Convert ChatGPT Session or Codex credential JSON into import documents for other tools, entirely in the browser. The interface opens in Chinese and can be switched to English.

[Open the application](https://whynotsleep.cc/auth-session-bridge/)

## Before using it

Both input and exported documents may grant account access. Work on a trusted device, then clear downloaded files and clipboard history after import.

- Conversion stays in the current page: no uploads, telemetry, or credential writes to browser storage.
- The page sends no credentials to external services, and its security policy disables runtime API connections.
- Inputs larger than 4 MiB, excessive nesting, and batches larger than 250 accounts are rejected.
- An account with only an `access token` cannot renew after expiry; the page reports this plainly.
- Synthetic `ID token` generation is off by default and cannot substitute for real sign-in credentials.

Never commit real credentials, paste them into issues, include them in screenshots, or send them through chat.

## Usage

1. Open the application and paste JSON, or drop one or more `.json` files.
2. Select an output format and review the checks.
3. Copy or download the exported document and import it into the target tool.

To convert a ChatGPT Web Session, sign in to ChatGPT in a separate browser tab, visit `https://chatgpt.com/api/auth/session`, and paste the returned JSON only into this tool.

`Codex Auth` produces a document shaped like `~/.codex/auth.json`. It forwards the supplied `id_token`, `access_token`, `refresh_token`, and `account_id` fields; if sign-in fields are absent, it reports an incomplete document instead of inventing them.

The built-in safe example is for inspecting the interface and output shapes only. Its identity and tokens cannot authenticate.

## Formats

| Output          | Behavior                                                                                     |
| --------------- | -------------------------------------------------------------------------------------------- |
| `Codex Auth`    | `~/.codex/auth.json` shape, forwarding only supplied sign-in fields.                         |
| `sub2api`       | Batch payload with expiry and automatic-pause fields.                                        |
| `CPA`           | Flat Codex token document used by CPA / CLIProxyAPI.                                         |
| `Cockpit`       | Flat Codex token document used by Cockpit Tools.                                             |
| `9router`       | Direct `access token` import without claiming renewal capability.                            |
| `AxonHub`       | ChatGPT auth document; exports `refresh_token` only when it was supplied.                    |
| `Codex-Manager` | Token document with metadata fields such as `workspaceId` and `chatgptAccountId` when found. |

Recognized inputs include Codex Auth, ChatGPT Web Session, JWT `access token` JSON, and export structures from the listed tools. The application can decode identity and expiry hints from JWT payloads; it does not verify whether a token is valid.

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
src/ui/app.ts           local UI behavior and user-facing checks
```

When adding or changing an adapter, commit only non-secret fixtures and test both complete and missing-field credentials.

## License

MIT. Font license notices distributed with the build are in [`public/licenses/THIRD-PARTY-NOTICES.txt`](./public/licenses/THIRD-PARTY-NOTICES.txt).
