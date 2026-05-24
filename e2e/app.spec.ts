import { expect, test, type Page } from '@playwright/test';

const session = {
  user: { email: 'browser@local.invalid' },
  account: { id: 'acct_browser', planType: 'plus' },
  accessToken:
    'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJyb3dzZXJAbG9jYWwuaW52YWxpZCIsImV4cCI6MTg5MzQ1NjAwMCwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7ImNoYXRncHRfYWNjb3VudF9pZCI6ImFjY3RfYnJvd3NlciIsImNoYXRncHRfcGxhbl90eXBlIjoicGx1cyJ9fQ.signature',
};

const codexAuthFixture = {
  auth_mode: 'chatgpt',
  OPENAI_API_KEY: null,
  tokens: {
    id_token: 'fixture.id.signed',
    access_token: session.accessToken,
    refresh_token: 'fixture.refresh.invalid',
    account_id: 'acct_browser',
  },
  last_refresh: '2026-05-23T17:32:21.088674585Z',
};

test('converts local input, switches locale and does not persist secrets', async ({
  page,
  context,
}) => {
  const foreignRequests: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') {
      foreignRequests.push(request.url());
    }
  });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('本地转换凭证');
  await expect(page.locator('#issues')).toContainText('尚未识别到凭证');
  expect(
    await page.evaluate(() => getComputedStyle(document.body).fontFamily.includes('LXGW WenKai')),
  ).toBe(true);
  await page.locator('#session-input').fill(JSON.stringify(session));

  const output = page.locator('#output');
  await expect(output).toHaveValue(/"type": "sub2api-data"/u);
  await expect(output).toHaveValue(/"chatgpt_account_id": "acct_browser"/u);
  await expect(page.locator('#issues')).toContainText('未包含 refresh token');
  const exportedAt = (JSON.parse(await output.inputValue()) as { exported_at: string }).exported_at;
  await page.getByRole('button', { name: 'CPA' }).click();
  await page.getByRole('button', { name: 'sub2api' }).click();
  expect((JSON.parse(await output.inputValue()) as { exported_at: string }).exported_at).toBe(
    exportedAt,
  );

  await page.getByRole('button', { name: 'English' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Move authentication');
  expect(
    await page.evaluate(() => getComputedStyle(document.body).fontFamily.includes('Charter')),
  ).toBe(true);

  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy JSON' }).click();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('"sub2api-data"');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download JSON' }).click();
  expect((await downloadEvent).suggestedFilename()).toContain('auth-session-bridge-sub2api');

  expect(foreignRequests).toEqual([]);
  expect(
    await page.evaluate(async () => ({
      local: localStorage.length,
      session: sessionStorage.length,
      databases: (await indexedDB.databases()).length,
    })),
  ).toEqual({ local: 0, session: 0, databases: 0 });

  await page.reload();
  await expect(page.locator('#session-input')).toHaveValue('');
});

test('accepts an actual dropped JSON file and keeps outputs honest about renewal capability', async ({
  page,
}) => {
  await page.goto('/');
  await dropJson(page, session);

  await expect(page.locator('#session-input')).toHaveValue(/browser@local\.invalid/u);
  await page.getByRole('button', { name: 'AxonHub' }).click();
  await expect(page.locator('#output')).toHaveValue(/"access_token"/u);
  expect(await page.locator('#output').inputValue()).not.toContain('__missing_refresh_token__');
  expect(await page.locator('#output').inputValue()).not.toContain('"refresh_token"');

  await page.getByRole('button', { name: '9router' }).click();
  await expect(page.locator('#output')).toHaveValue(/"accessToken"/u);
  expect(await page.locator('#output').inputValue()).not.toContain('"authType"');

  await page.getByRole('button', { name: 'CPA' }).click();
  await page.locator('#synthetic').check();
  await expect(page.locator('#output')).toHaveValue(/\.synthetic/u);
  await expect(page.locator('#issues')).toContainText('合成 ID token');
});

test('emits Codex Auth only from supplied login material and warns on incomplete sessions', async ({
  page,
}) => {
  await page.goto('/');
  await dropJson(page, codexAuthFixture);
  await page.getByRole('button', { name: 'Codex Auth' }).click();

  expect(JSON.parse(await page.locator('#output').inputValue())).toEqual(codexAuthFixture);
  await expect(page.locator('#issues')).not.toContainText('Codex Auth 不完整');
  await expect(page.locator('#issues')).toContainText('未发现需要处理的问题');
  await expect(page.locator('#synthetic-area')).toBeHidden();

  await page.locator('#session-input').fill(JSON.stringify(session));
  await expect(page.locator('#issues')).toContainText('Codex Auth 不完整');
  expect(await page.locator('#output').inputValue()).not.toContain('"id_token"');
  expect(await page.locator('#output').inputValue()).not.toContain('"refresh_token"');
});

test('rejects oversized dropped files before producing output', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(
      new File(['x'.repeat(4 * 1024 * 1024 + 1)], 'oversized.json', {
        type: 'application/json',
      }),
    );
    document
      .querySelector('#drop-zone')
      ?.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
  });

  await expect(page.locator('#issues')).toContainText('输入超过 4 MiB');
  await expect(page.locator('#output')).toHaveValue('');
});

test('rejects a multi-file batch that exceeds combined size limits', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const dataTransfer = new DataTransfer();
    for (const name of ['part-one.json', 'part-two.json']) {
      dataTransfer.items.add(
        new File(['x'.repeat(2 * 1024 * 1024 + 1)], name, { type: 'application/json' }),
      );
    }
    document
      .querySelector('#drop-zone')
      ?.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
  });

  await expect(page.locator('#issues')).toContainText('输入超过 4 MiB');
  await expect(page.locator('#output')).toHaveValue('');
});

test('rejects an excessive number of selected files', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const dataTransfer = new DataTransfer();
    for (let index = 0; index < 251; index += 1) {
      dataTransfer.items.add(new File(['{}'], `input-${index}.json`, { type: 'application/json' }));
    }
    document
      .querySelector('#drop-zone')
      ?.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
  });

  await expect(page.locator('#issues')).toContainText('一次最多选择 250 个 JSON 文件');
  await expect(page.locator('#output')).toHaveValue('');
});

test('maintains the two-panel workspace at desktop and a single-column flow on mobile', async ({
  page,
}, testInfo) => {
  await page.goto('/');
  const skipLink = page.locator('.skip-link');
  await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  expect(
    await skipLink.evaluate((element) => element.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(0);
  await page.getByRole('button', { name: '载入安全示例' }).click();
  expect(
    await skipLink.evaluate((element) => element.getBoundingClientRect().bottom),
  ).toBeLessThanOrEqual(0);
  await page.waitForTimeout(150);
  await page.screenshot({
    path: testInfo.outputPath('workspace-zh.png'),
    fullPage: true,
  });

  const columns = await page
    .locator('.conversion-grid')
    .evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  expect(columns).toBe(testInfo.project.name.includes('mobile') ? 1 : 2);

  await page.getByRole('button', { name: 'English' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.waitForTimeout(150);
  await page.screenshot({
    path: testInfo.outputPath('workspace-en.png'),
    fullPage: true,
  });

  await page.getByRole('button', { name: '中文' }).click();
  await dropJson(page, codexAuthFixture);
  await page.getByRole('button', { name: 'Codex Auth' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.waitForTimeout(150);
  await page.screenshot({
    path: testInfo.outputPath('codex-auth-zh.png'),
    fullPage: true,
  });

  await page.getByRole('button', { name: 'English' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  await page.waitForTimeout(150);
  await page.screenshot({
    path: testInfo.outputPath('codex-auth-en.png'),
    fullPage: true,
  });
});

async function dropJson(page: Page, value: unknown): Promise<void> {
  await page.evaluate((input) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(
      new File([JSON.stringify(input)], 'dropped-session.json', { type: 'application/json' }),
    );
    const dropZone = document.querySelector('#drop-zone');
    if (!dropZone) {
      throw new Error('Drop zone unavailable');
    }
    dropZone.dispatchEvent(
      new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }),
    );
  }, value);
}
