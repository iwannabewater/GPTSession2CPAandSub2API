# Security

Auth Session Bridge transforms bearer credentials in the user's browser. Input and exported documents may grant account access.

## Data handling

- Parsing, checks, and export occur in memory in the current browser tab.
- The application does not write credentials to `localStorage`, `sessionStorage`, or `IndexedDB`.
- The application does not transmit pasted input or generated output to an external service.
- The deployed HTML sets a Content Security Policy with `connect-src 'none'`, preventing application scripts from initiating runtime network connections.
- The ChatGPT Session shortcut is an external link opened only by the user; it does not carry input from this application.
- The built-in example and repository tests contain non-working placeholder credentials.

The application is deployed as static files on GitHub Pages. This repository has no server-side component that processes credentials.

## Working with credentials

Use a trusted device and browser profile. Delete exported files and clear clipboard history after import where your system supports it. If a credential appears in a public location or a message thread, revoke or rotate it through the relevant account controls.

## Reporting a vulnerability

Do not include real tokens, session exports, or screenshots containing credentials in a report. Use GitHub's private vulnerability reporting channel for this repository when available, with a minimal reproduction built from placeholder values.
