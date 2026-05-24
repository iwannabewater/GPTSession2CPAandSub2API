export type Locale = 'en' | 'zh-CN';

const english = {
  title: 'Auth Session Bridge',
  subtitle: 'Local credential document converter',
  localeLabel: 'Language',
  safetyLabel: 'Credential safety',
  detailsLabel: 'Conversion details',
  sessionSourceLabel: 'ChatGPT Session shortcut',
  skip: 'Skip to workspace',
  english: 'English',
  chinese: '中文',
  eyebrow: 'IN-BROWSER CONVERSION / NO CREDENTIAL STORAGE',
  processingLabel: 'Processing',
  processingValue: 'Memory in this tab',
  storageLabel: 'Browser storage',
  storageValue: 'No credentials written',
  networkLabel: 'External services',
  networkValue: 'No input sent',
  heading: 'Prepare credential documents in your browser',
  lead: 'Paste ChatGPT Session or Codex Auth JSON. Conversion and checks run in this tab before you import the result elsewhere.',
  boundaryTitle: 'Handling of credentials',
  boundaryBody:
    'Input and exported JSON may grant account access. Use a trusted device, then remove downloaded files and clipboard contents after import.',
  formatLabel: 'Output document',
  formatSub2api: 'Batch export for sub2api with expiry and automatic pause fields.',
  formatCodexAuth:
    'Creates the ~/.codex/auth.json shape with the same token values used by Cockpit output.',
  formatCpa: 'Flat Codex token document for CPA / CLIProxyAPI.',
  formatCockpit: 'Flat Codex token document for Cockpit Tools.',
  format9router: 'Direct access-token import without renewal metadata.',
  formatAxonhub: 'ChatGPT auth document for AxonHub, forwarding a refresh token only if supplied.',
  formatCodexManager: 'Token document with Codex-Manager metadata fields when detected.',
  tipCodexAuthFields:
    'Exports auth_mode, OPENAI_API_KEY, tokens.id_token, access_token, refresh_token, account_id and last_refresh; missing refresh_token or id_token stay as empty strings.',
  tipCodexAuthSynthetic:
    'ChatGPT Session usually has no real id_token. If enabled, the synthetic value matches Cockpit but is unsigned metadata and may be rejected by Codex.',
  tipSub2apiBatch:
    'Best for batch import. Each account gets expiry metadata and auto_pause_on_expired when the access token expiry is readable.',
  tipSub2apiRefresh:
    'Refresh tokens are forwarded only when the input includes them; access-only accounts need replacement after expiry.',
  tipCpaSynthetic:
    'CPA and CLIProxyAPI read a flat type=codex document. The optional synthetic id_token carries account claims for tools that expect them.',
  tipCpaNoSession:
    'The ChatGPT sessionToken is never exported. Only OAuth-style token fields and readable account metadata are used.',
  tipCockpitFields:
    'Cockpit uses id_token, access_token, refresh_token, account_id and last_refresh at the top level.',
  tipCockpitSynthetic:
    'When synthetic ID token is enabled, the generated id_token is the same value Codex Auth receives inside tokens.id_token.',
  tip9routerAccess:
    '9router import uses only accessToken plus a display name. Renewal and account metadata are intentionally omitted.',
  tip9routerExpiry:
    'Because no refresh token is exported, reimport a fresh access token after the current token expires.',
  tipAxonhubRefresh:
    'AxonHub receives auth_mode, last_refresh and tokens; refresh_token appears only when the input supplies it.',
  tipAxonhubSynthetic:
    'Synthetic id_token can help metadata-only imports, but it is not an OpenAI-signed login token.',
  tipCodexManagerMeta:
    'Codex-Manager output includes tokens plus meta.label, issuer, status and any detected workspace or ChatGPT account IDs.',
  tipCodexManagerRefresh:
    'Missing refresh_token is kept empty so the importer can show the limitation instead of receiving a placeholder secret.',
  sessionSourceTitle: 'Starting from ChatGPT Session?',
  sessionSourceBody:
    'While signed in to ChatGPT, open the session JSON page in a new tab and paste the returned JSON below.',
  sessionOpen: 'Open session JSON page',
  inputStep: '01 / INPUT DOCUMENT',
  outputStep: '02 / OUTPUT DOCUMENT',
  inputTitle: 'Input',
  inputHelp: 'Paste JSON or drop a local file.',
  inputPlaceholder: 'Paste JSON containing accessToken or tokens.access_token',
  selectFiles: 'Select file',
  example: 'Safe example',
  clear: 'Clear',
  drop: 'Drop JSON files here',
  dropHint: 'Multiple files supported, up to 4 MiB combined and 250 files',
  outputTitle: 'Output',
  outputHelp: 'Check warnings before importing this document.',
  synthetic: 'Create a synthetic ID token for compatible targets that read claims metadata',
  syntheticWarning:
    'Synthetic ID tokens are not authenticated tokens and may be rejected by downstream tools.',
  copy: 'Copy JSON',
  download: 'Download JSON',
  accounts: 'Detected accounts',
  issues: 'Checks',
  waiting: 'Waiting for JSON input.',
  ready: '{count} credential record(s) read.',
  noOutput: 'No document to export.',
  copied: 'JSON copied. Your clipboard now contains sensitive content.',
  copyFailed: 'Clipboard access failed. Select and copy the output manually.',
  downloaded: 'JSON downloaded. Remove the file after import.',
  readingFiles: 'Reading {count} file(s).',
  noJsonFiles: 'Select or drop JSON files only.',
  source: 'Source',
  sourceChatgptSession: 'ChatGPT Session',
  sourceCodexAuth: 'Codex Auth',
  sourcePortable: 'CPA / Cockpit',
  sourceSub2api: 'sub2api',
  source9router: '9router',
  sourceAxonhub: 'AxonHub',
  sourceCodexManager: 'Codex-Manager',
  sourceCredentialJson: 'Credential JSON',
  expiry: 'Expires',
  accessOnly: 'Access token only',
  refreshReady: 'Refresh token included',
  empty: 'No credential records found.',
  noIssues: 'No issues found.',
  securityNote:
    'Input is parsed and converted in this tab. The page writes no credentials to localStorage, sessionStorage or IndexedDB.',
  compatibilityNote:
    'The page does not verify whether a token still works. Confirm that the selected format is supported by the target tool before import.',
  footer:
    'Credential documents function as sign-in secrets. Do not commit them or send them through chat.',
  issue_EMPTY_INPUT: 'Enter JSON before converting.',
  issue_INVALID_JSON: 'JSON could not be parsed.',
  issue_INPUT_TOO_LARGE: 'Input exceeds the 4 MiB processing limit.',
  issue_MAX_FILES: 'Select no more than 250 JSON files at a time.',
  issue_MAX_DEPTH: 'Input nesting exceeds the safe processing depth.',
  issue_MAX_NODES: 'Input contains too many nested values to process safely.',
  issue_MAX_CREDENTIALS: 'Input exceeds the 250 account processing limit.',
  issue_NO_CREDENTIAL: 'No object containing an access token was detected.',
  issue_TOKEN_METADATA_UNAVAILABLE:
    'Token accepted, but no readable account metadata or expiry was found.',
  issue_ACCESS_ONLY:
    'No refresh token present. This account stops working when its access token expires.',
  issue_SYNTHETIC_INPUT_TOKEN:
    'Input contains a synthetic ID token. It is metadata only, not proof of authentication.',
  warning_NO_REFRESH_TOKEN: 'At least one output account has no refresh token.',
  warning_NO_ACCOUNT_ID: 'At least one account has no detected account ID.',
  warning_CODEX_AUTH_INCOMPLETE:
    'Codex Auth has empty login fields. Import only if the target accepts missing id_token or refresh_token.',
  warning_SYNTHETIC_ID_TOKEN: 'Output includes an explicitly requested synthetic ID token.',
  warning_MULTI_DOCUMENT_OUTPUT:
    'Multiple accounts are emitted as an array; import individually if the target expects one file.',
  warning_ACCESS_TOKEN_IMPORT_ONLY:
    '9router output uses its verified access-token import structure and omits refresh metadata.',
} as const;

const chinese: Record<keyof typeof english, string> = {
  title: 'Auth Session Bridge',
  subtitle: '本地凭证文档转换器',
  localeLabel: '语言',
  safetyLabel: '凭证安全',
  detailsLabel: '转换详情',
  sessionSourceLabel: 'ChatGPT Session 快捷入口',
  skip: '跳到转换工作区',
  english: 'English',
  chinese: '中文',
  eyebrow: '仅在浏览器中转换 / 不存储凭证',
  processingLabel: '处理位置',
  processingValue: '当前标签页内存',
  storageLabel: '浏览器存储',
  storageValue: '不写入凭证',
  networkLabel: '外部服务',
  networkValue: '不发送输入内容',
  heading: '在浏览器内整理凭证文档',
  lead: '粘贴 ChatGPT Session 或 Codex Auth JSON；页面会在当前标签页完成转换与检查，再由你将结果导入目标工具。',
  boundaryTitle: '凭证处理方式',
  boundaryBody:
    '输入与导出 JSON 都可能授予账号访问权限。请只在可信设备上操作，并在导入后清理下载文件和剪贴板内容。',
  formatLabel: '输出文档',
  formatSub2api: '用于 sub2api 的批量导出，包含过期时间与自动暂停字段。',
  formatCodexAuth: '按 ~/.codex/auth.json 结构生成文档，token 值与 Cockpit 输出保持一致。',
  formatCpa: '用于 CPA / CLIProxyAPI 的扁平 Codex token 文档。',
  formatCockpit: '用于 Cockpit Tools 的扁平 Codex token 文档。',
  format9router: '仅导入 access token，不附带续期字段。',
  formatAxonhub: '用于 AxonHub 的 ChatGPT 认证文档，仅在输入提供时传递 refresh token。',
  formatCodexManager: '用于 Codex-Manager 的 token 文档，可识别时包含元数据字段。',
  tipCodexAuthFields:
    '导出 auth_mode、OPENAI_API_KEY、tokens.id_token、access_token、refresh_token、account_id 与 last_refresh；缺少 refresh_token 或 id_token 时保留为空字符串。',
  tipCodexAuthSynthetic:
    'ChatGPT Session 通常没有真实 id_token。开启合成后，Codex Auth 的 tokens.id_token 与 Cockpit 的 id_token 相同，但它只是未签名元数据，Codex 可能拒绝。',
  tipSub2apiBatch:
    '适合批量导入。能读取 access token 过期时间时，每个账号会带上 expires_at 和 auto_pause_on_expired。',
  tipSub2apiRefresh:
    '只有输入里真的有 refresh token 才会转写；仅 access token 的账号过期后需要重新导入。',
  tipCpaSynthetic:
    'CPA / CLIProxyAPI 读取 type=codex 的扁平文档。可选合成 id_token 用来给需要 claims 的工具补充账号信息。',
  tipCpaNoSession:
    'ChatGPT sessionToken 不会导出。页面只使用 OAuth 风格 token 字段和可读取的账号元数据。',
  tipCockpitFields:
    'Cockpit 在顶层读取 id_token、access_token、refresh_token、account_id 和 last_refresh。',
  tipCockpitSynthetic:
    '开启合成 ID token 时，生成值会同时作为 Codex Auth 的 tokens.id_token 使用。',
  tip9routerAccess: '9router 导入只需要 accessToken 和展示名称。续期字段与账号元数据会被刻意省略。',
  tip9routerExpiry: '由于不导出 refresh token，当前 access token 过期后需要重新导入新的 token。',
  tipAxonhubRefresh:
    'AxonHub 会收到 auth_mode、last_refresh 和 tokens；只有输入提供 refresh token 时才会包含该字段。',
  tipAxonhubSynthetic:
    '合成 id_token 可用于只读取元数据的导入场景，但它不是 OpenAI 签名的登录 token。',
  tipCodexManagerMeta:
    'Codex-Manager 输出包含 tokens 与 meta.label、issuer、status，以及可识别的 workspace 或 ChatGPT account ID。',
  tipCodexManagerRefresh:
    '缺少 refresh_token 时保留空字符串，让导入器明确展示限制，而不是收到伪造密钥。',
  sessionSourceTitle: '从 ChatGPT Session 开始？',
  sessionSourceBody: '已登录 ChatGPT 时，在新标签页打开会话 JSON 页面，将返回内容粘贴到下方。',
  sessionOpen: '打开 Session JSON 页面',
  inputStep: '01 / 输入文档',
  outputStep: '02 / 输出文档',
  inputTitle: '输入',
  inputHelp: '粘贴 JSON，或拖入本地文件。',
  inputPlaceholder: '粘贴含有 accessToken 或 tokens.access_token 的 JSON',
  selectFiles: '选择文件',
  example: '安全示例',
  clear: '清空',
  drop: '将 JSON 文件拖到此处',
  dropHint: '支持多个文件，总计不超过 4 MiB 且不超过 250 个文件',
  outputTitle: '输出',
  outputHelp: '导入目标工具前，请先查看警告。',
  synthetic: '为读取声明信息的兼容目标生成合成 ID token',
  syntheticWarning: '合成 ID token 未经认证，下游工具可能拒绝导入。',
  copy: '复制 JSON',
  download: '下载 JSON',
  accounts: '识别到的账号',
  issues: '检查结果',
  waiting: '等待输入 JSON。',
  ready: '已读取 {count} 条凭证记录。',
  noOutput: '暂无可导出的文档。',
  copied: '输出 JSON 已复制，剪贴板当前含有敏感内容。',
  copyFailed: '无法访问剪贴板，请手动选中并复制输出。',
  downloaded: '输出文档已下载，请在完成导入后删除文件。',
  readingFiles: '正在读取 {count} 个文件。',
  noJsonFiles: '请选择或拖入 JSON 文件。',
  source: '来源',
  sourceChatgptSession: 'ChatGPT Session',
  sourceCodexAuth: 'Codex Auth',
  sourcePortable: 'CPA / Cockpit',
  sourceSub2api: 'sub2api',
  source9router: '9router',
  sourceAxonhub: 'AxonHub',
  sourceCodexManager: 'Codex-Manager',
  sourceCredentialJson: '通用凭证 JSON',
  expiry: '过期时间',
  accessOnly: '仅 access token',
  refreshReady: '含 refresh token',
  empty: '未找到凭证记录。',
  noIssues: '未发现需要处理的问题。',
  securityNote:
    '输入仅在当前标签页内存中解析和转换；页面不把凭证写入 localStorage、sessionStorage 或 IndexedDB。',
  compatibilityNote: '页面不会验证 token 当前是否有效；导入前请确认目标工具支持所选格式。',
  footer: '凭证文档等同于登录密钥，请勿提交到仓库或发送到聊天记录。',
  issue_EMPTY_INPUT: '请输入 JSON 后再进行转换。',
  issue_INVALID_JSON: '无法解析 JSON。',
  issue_INPUT_TOO_LARGE: '输入超过 4 MiB 的处理上限。',
  issue_MAX_FILES: '一次最多选择 250 个 JSON 文件。',
  issue_MAX_DEPTH: '输入的嵌套层级过深，已停止解析。',
  issue_MAX_NODES: '输入包含的数据项过多，已停止解析。',
  issue_MAX_CREDENTIALS: '输入超过 250 个账号的处理上限。',
  issue_NO_CREDENTIAL: '未发现含有 access token 的对象。',
  issue_TOKEN_METADATA_UNAVAILABLE: 'access token 中没有可读取的账号信息或过期时间。',
  issue_ACCESS_ONLY: '未包含 refresh token；access token 过期后无法续期。',
  issue_SYNTHETIC_INPUT_TOKEN: '输入含有合成 ID token，它仅承载元数据，不能证明认证状态。',
  warning_NO_REFRESH_TOKEN: '至少一个输出账号不含 refresh token。',
  warning_NO_ACCOUNT_ID: '至少一个账号未识别到账户 ID。',
  warning_CODEX_AUTH_INCOMPLETE:
    'Codex Auth 仍有空登录字段；只有目标工具接受缺少 id_token 或 refresh_token 时才导入。',
  warning_SYNTHETIC_ID_TOKEN: '输出包含你显式要求生成的合成 ID token。',
  warning_MULTI_DOCUMENT_OUTPUT: '多个账号将输出为数组；若目标仅接受单文件，请逐个导入。',
  warning_ACCESS_TOKEN_IMPORT_ONLY:
    '9router 输出采用已核验的 access-token 导入结构，不携带刷新元数据。',
};

const catalog: Record<Locale, Record<keyof typeof english, string>> = {
  en: english,
  'zh-CN': chinese,
};

export type MessageKey = keyof typeof english;

export function translate(
  locale: Locale,
  key: MessageKey,
  variables?: Record<string, string | number>,
): string {
  let message = catalog[locale][key];
  Object.entries(variables ?? {}).forEach(([name, value]) => {
    message = message.replaceAll(`{${name}}`, String(value));
  });
  return message;
}
