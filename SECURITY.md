# Security

Auth Session Bridge converts bearer credentials in the browser. Treat pasted input and every exported document as a password.

## Data handling

- Parsing and export run in the browser.
- The application does not persist credentials or send them to an external service.
- The deployed HTML applies a Content Security Policy with `connect-src 'none'` to disable runtime API connections.
- The built-in example and repository tests use non-working placeholder credentials.

The application is deployed as static files on GitHub Pages. There is no server-side credential processing component in this repository.

## Using real credentials

Use a trusted device and browser profile. After importing an exported document, clear downloaded copies and clipboard history where available. If a credential is exposed, revoke it through the relevant account security controls.

## Reporting a vulnerability

Do not include real tokens, session exports, or screenshots containing credentials in a report. Use GitHub's private vulnerability reporting channel for this repository when available, with a minimal reproduction built from placeholder values.
