import { buildSyntheticIdToken } from './jwt';
import type {
  Credential,
  ExportOptions,
  ExportReport,
  ExportWarning,
  JsonObject,
  JsonValue,
  OutputFormat,
} from './types';
import { compactObject } from './value';

export function exportCredentials(
  format: OutputFormat,
  credentials: readonly Credential[],
  options: ExportOptions,
): ExportReport {
  const warnings: ExportWarning[] = [];
  credentials.forEach((credential) => {
    if (!credential.refreshToken && format !== 'codex-auth') {
      addWarning(warnings, { code: 'NO_REFRESH_TOKEN', format });
    }
    if (!credential.accountId) {
      addWarning(warnings, { code: 'NO_ACCOUNT_ID', format });
    }
  });
  if (credentials.length > 1 && format !== 'sub2api') {
    addWarning(warnings, { code: 'MULTI_DOCUMENT_OUTPUT', format });
  }

  const document = buildDocument(format, credentials, options, warnings);
  return {
    document,
    filename: filenameFor(format, credentials.length, options.now),
    warnings,
  };
}

function buildDocument(
  format: OutputFormat,
  credentials: readonly Credential[],
  options: ExportOptions,
  warnings: ExportWarning[],
): JsonValue {
  switch (format) {
    case 'codex-auth':
      return singleOrArray(
        credentials.map((credential) => buildCodexAuth(credential, options, warnings)),
      );
    case 'sub2api':
      return buildSub2api(credentials, options);
    case 'cpa':
    case 'cockpit':
      return singleOrArray(
        credentials.map((credential) => buildPortable(credential, format, options, warnings)),
      );
    case '9router':
      addWarning(warnings, { code: 'ACCESS_TOKEN_IMPORT_ONLY', format });
      return singleOrArray(credentials.map(buildNineRouter));
    case 'axonhub':
      return singleOrArray(
        credentials.map((credential) => buildAxonHub(credential, options, warnings)),
      );
    case 'codex-manager':
      return singleOrArray(credentials.map((credential) => buildCodexManager(credential, options)));
  }
}

function buildCodexAuth(
  credential: Credential,
  options: ExportOptions,
  warnings: ExportWarning[],
): JsonObject {
  const idToken = effectiveIdToken(credential, 'codex-auth', options, warnings) ?? '';
  const refreshToken = credential.refreshToken ?? '';
  const accountId = credential.accountId ?? '';
  if (!idToken || !refreshToken || !accountId) {
    addWarning(warnings, { code: 'CODEX_AUTH_INCOMPLETE', format: 'codex-auth' });
  }
  return {
    auth_mode: 'chatgpt',
    OPENAI_API_KEY: null,
    tokens: {
      id_token: idToken,
      access_token: credential.accessToken,
      refresh_token: refreshToken,
      account_id: accountId,
    },
    last_refresh: credential.lastRefresh ?? options.now.toISOString(),
  };
}

function buildPortable(
  credential: Credential,
  format: OutputFormat,
  options: ExportOptions,
  warnings: ExportWarning[],
): JsonObject {
  const idToken = effectiveIdToken(credential, format, options, warnings);
  return {
    type: 'codex',
    id_token: idToken ?? '',
    access_token: credential.accessToken,
    refresh_token: credential.refreshToken ?? '',
    account_id: credential.accountId ?? '',
    last_refresh: credential.lastRefresh ?? options.now.toISOString(),
    email: credential.email ?? '',
    expired: credential.expiresAt ?? '',
  };
}

function buildSub2api(credentials: readonly Credential[], options: ExportOptions): JsonObject {
  return {
    type: 'sub2api-data',
    version: 1,
    exported_at: options.now.toISOString(),
    proxies: [],
    accounts: credentials.map((credential) =>
      compactObject({
        name: credential.email ?? credential.accountId ?? 'ChatGPT account',
        platform: 'openai',
        type: 'oauth',
        expires_at: credential.accessTokenExpiresAt,
        auto_pause_on_expired: credential.accessTokenExpiresAt === undefined ? undefined : true,
        concurrency: 10,
        priority: 1,
        credentials: compactObject({
          access_token: credential.accessToken,
          refresh_token: credential.refreshToken,
          id_token: credential.idToken,
          chatgpt_account_id: credential.chatgptAccountId,
          chatgpt_user_id: credential.userId,
          email: credential.email,
          expires_at: credential.expiresAt,
          plan_type: credential.planType,
        }),
      }),
    ),
  };
}

function buildNineRouter(credential: Credential): JsonObject {
  return compactObject({
    accessToken: credential.accessToken,
    name: credential.email ?? credential.accountId,
  });
}

function buildAxonHub(
  credential: Credential,
  options: ExportOptions,
  warnings: ExportWarning[],
): JsonObject {
  return compactObject({
    auth_mode: 'chatgpt',
    last_refresh: credential.lastRefresh ?? options.now.toISOString(),
    tokens: compactObject({
      access_token: credential.accessToken,
      refresh_token: credential.refreshToken,
      id_token: effectiveIdToken(credential, 'axonhub', options, warnings),
    }),
  });
}

function buildCodexManager(credential: Credential, options: ExportOptions): JsonObject {
  return {
    tokens: compactObject({
      access_token: credential.accessToken,
      id_token: credential.idToken ?? '',
      refresh_token: credential.refreshToken ?? '',
      account_id: credential.accountId ?? '',
    }),
    meta: compactObject({
      label: credential.email ?? credential.accountId ?? 'ChatGPT account',
      issuer: 'https://chatgpt.com',
      note: 'Converted locally by Auth Session Bridge.',
      status: 'active',
      workspaceId: credential.workspaceId,
      chatgptAccountId: credential.chatgptAccountId,
      exportedAt: Math.trunc(options.now.getTime() / 1000),
    }),
  };
}

function effectiveIdToken(
  credential: Credential,
  format: OutputFormat,
  options: ExportOptions,
  warnings: ExportWarning[],
): string | undefined {
  if (credential.idToken) {
    return credential.idToken;
  }
  if (!options.includeSyntheticIdToken || !credential.accountId) {
    return undefined;
  }
  addWarning(warnings, { code: 'SYNTHETIC_ID_TOKEN', format });
  return buildSyntheticIdToken(credential.accountId, credential, options.now);
}

function singleOrArray(documents: JsonObject[]): JsonValue {
  return documents.length === 1 ? (documents[0] ?? []) : documents;
}

function addWarning(warnings: ExportWarning[], warning: ExportWarning): void {
  if (
    !warnings.some(
      (existing) => existing.code === warning.code && existing.format === warning.format,
    )
  ) {
    warnings.push(warning);
  }
}

function filenameFor(format: OutputFormat, count: number, now: Date): string {
  const stamp = now
    .toISOString()
    .replaceAll(/[-:]/gu, '')
    .replace(/\.\d{3}Z$/u, 'Z');
  return `auth-session-bridge-${format}-${count}-${stamp}.json`;
}
