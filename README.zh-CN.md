# Auth Session Bridge

[English README](./README.md)

Auth Session Bridge 在浏览器当前标签页内将 ChatGPT Session 或 Codex Auth JSON 转成目标工具可导入的文档。界面默认使用中文，可随时切换为英文。

[打开在线页面](https://whynotsleep.cc/auth-session-bridge/)

## 开始使用

1. 准备输入。使用 ChatGPT Session 时，先登录 ChatGPT，再打开 `https://chatgpt.com/api/auth/session`，将返回的 JSON 粘贴到页面中。应用内也提供了这个入口。
2. 选择输出文档格式，确认页面显示的警告和账号信息。
3. 复制或下载生成的 JSON，将其导入目标工具。完成导入后，删除下载文件并清理剪贴板内容。

`Codex Auth` 会按 `~/.codex/auth.json` 的结构生成文档。导出器只转写输入中已有的 `id_token`、`access_token`、`refresh_token` 和 `account_id`；登录字段缺失时，页面会报告文档不完整，不会补造字段。

内置示例只用于查看交互和导出结构，示例中的身份与 token 均不能用于登录。

## 凭证处理

输入和导出文档都可能授予账号访问权限，请只在可信设备上操作。

- 解析、检查与导出发生在当前标签页内存中；页面不将凭证写入 `localStorage`、`sessionStorage` 或 `IndexedDB`。
- 页面不向外部服务发送输入内容。发布版本的内容安全策略设置了 `connect-src 'none'`，禁止脚本发起运行时网络连接。
- 应用会拒绝超过 4 MiB 的输入、层级过深的数据，以及超过 250 个账号的批量内容。
- 只有 `access token` 的账号无法在令牌过期后续期，页面会提示这一限制。
- 合成 `ID token` 默认关闭；即使手动启用，它也不是登录凭证。

不要将真实凭证提交到仓库、粘贴到 issue、放入截图或发送到聊天记录。

## 支持文档

| 输出            | 生成内容                                                                    |
| --------------- | --------------------------------------------------------------------------- |
| `Codex Auth`    | `~/.codex/auth.json` 结构，只转写输入已有的登录字段。                       |
| `sub2api`       | 批量载荷，包含过期时间与自动暂停字段。                                      |
| `CPA`           | CPA / CLIProxyAPI 使用的扁平 Codex token 文档。                             |
| `Cockpit`       | Cockpit Tools 使用的扁平 Codex token 文档。                                 |
| `9router`       | 直接导入 `access token`，不附带续期字段。                                   |
| `AxonHub`       | ChatGPT 认证文档，仅在输入提供时导出 `refresh_token`。                      |
| `Codex-Manager` | Token 文档，可识别时包含 `workspaceId` 与 `chatgptAccountId` 等元数据字段。 |

应用可读取 Codex Auth、ChatGPT Session、仅含 JWT `access token` 的 JSON，以及表中格式的导出结构。它会解码 JWT 中可读取的身份和过期信息，但不会验证 token 当前是否有效。

## 本地开发

要求 Node.js 24 与 npm。

```bash
npm ci
npx playwright install chromium
npm run dev
npm run verify
```

`npm run verify` 会执行格式检查、lint、严格类型检查、带覆盖率门槛的单元测试、生产构建，以及桌面、手机和 320 px 窄屏下的浏览器测试。

核心入口：

```text
src/core/parse.ts       有边界地读取不可信 JSON
src/core/normalize.ts   提取统一凭证记录
src/core/export.ts      生成各目标文档
src/ui/app.ts           浏览器交互与检查提示
```

调整格式适配器时，请提交不含真实凭证的测试样例，并覆盖字段完整和字段缺失两类输入。

## 许可证

MIT。随构建分发的字体许可声明见 [`public/licenses/THIRD-PARTY-NOTICES.txt`](./public/licenses/THIRD-PARTY-NOTICES.txt)。
