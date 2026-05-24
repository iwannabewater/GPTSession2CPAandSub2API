# Auth Session Bridge

[English README](./README.md)

在浏览器本地把 ChatGPT Session 或 Codex 凭证 JSON 转成目标工具所需的导入文档。页面默认显示中文，可切换到英文。

[打开在线版](https://whynotsleep.cc/auth-session-bridge/)

## 使用前须知

输入和导出结果都可能授予账户访问权限。请在可信设备上操作，导入完成后清除下载文件和剪贴板历史。

- 转换只发生在当前页面：不上传、不遥测、不把凭证写入浏览器存储。
- 页面不向外部服务发送凭证，安全策略禁用运行时 API 连接。
- 超过 4 MiB 的输入、过深嵌套或超过 250 个账号的批量内容会被拒绝。
- 仅含 `access token` 的账号在过期后无法续期，页面会明确警告。
- 合成 `ID token` 默认关闭；即使手动启用，也不能替代真实登录凭证。

不要将真实凭证提交到仓库、粘贴到 issue、放入截图或发送到聊天记录。

## 使用方式

1. 打开在线页面，粘贴 JSON，或拖入一个或多个 `.json` 文件。
2. 选择输出格式，查看检查结果。
3. 复制或下载导出文档，并将其导入目标工具。

如需转换 ChatGPT Web Session，请在单独的浏览器标签页登录 ChatGPT 后访问 `https://chatgpt.com/api/auth/session`，并只将返回的 JSON 粘贴到本工具中。

`Codex Auth` 会生成与 `~/.codex/auth.json` 同形的文档。它只传递输入中已有的 `id_token`、`access_token`、`refresh_token` 与 `account_id`；缺少登录字段时会提示文档不完整，不会伪造补全。

页面自带的安全示例只用于查看界面和导出结构，其中的身份与 token 均不可用于认证。

## 支持格式

| 输出            | 行为说明                                                                    |
| --------------- | --------------------------------------------------------------------------- |
| `Codex Auth`    | `~/.codex/auth.json` 结构，只传递输入已有的登录字段。                       |
| `sub2api`       | 批量载荷，包含过期时间和自动暂停字段。                                      |
| `CPA`           | CPA / CLIProxyAPI 使用的扁平 Codex token 文档。                             |
| `Cockpit`       | Cockpit Tools 使用的扁平 Codex token 文档。                                 |
| `9router`       | 直接导入 `access token`，不声明具备续期能力。                               |
| `AxonHub`       | ChatGPT 认证文档，仅在输入包含时导出 `refresh_token`。                      |
| `Codex-Manager` | Token 文档；可识别时包含 `workspaceId` 与 `chatgptAccountId` 等元数据字段。 |

可识别输入包括 Codex Auth、ChatGPT Web Session、仅含 JWT `access token` 的 JSON，以及上述目标工具的导出结构。应用可以解码 JWT 中的身份和过期提示，但不会验证 token 是否有效。

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
src/core/export.ts      生成各目标格式
src/ui/app.ts           本地页面交互与检查提示
```

新增或调整格式适配器时，请同时提交不含真实凭证的测试样例，并覆盖字段完整和字段缺失两类情况。

## 许可证

MIT。随构建分发的字体许可声明见 [`public/licenses/THIRD-PARTY-NOTICES.txt`](./public/licenses/THIRD-PARTY-NOTICES.txt)。
