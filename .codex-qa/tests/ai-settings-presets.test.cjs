const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const { _electron: electron } = require('playwright');

const root = path.resolve(__dirname, '..', '..');
const appExecutable = path.join(root, 'DeepSleepReader.exe');
const userDataDir = path.join(root, '.codex-qa', 'test-user-data', 'ai-settings');

async function launchApp() {
  fs.rmSync(userDataDir, { recursive: true, force: true });
  fs.mkdirSync(userDataDir, { recursive: true });
  const app = await electron.launch({
    executablePath: appExecutable,
    args: [`--user-data-dir=${userDataDir}`],
    timeout: 30000,
  });
  const page = await app.firstWindow();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);
  return { app, page };
}

async function queueImports(app, filePaths) {
  await app.evaluate(async ({ dialog }, paths) => {
    global.__qaDialogQueue = [...paths];
    const original = dialog.showOpenDialog.bind(dialog);
    dialog.showOpenDialog = async (...args) =>
      global.__qaDialogQueue.length
        ? { canceled: false, filePaths: [global.__qaDialogQueue.shift()] }
        : original(...args);
  }, filePaths);
}

test('AI settings defaults to DeepSeek preset and shows editable preset fields', async () => {
  const { app, page } = await launchApp();
  try {
    await page.getByRole('link', { name: 'AI 设置' }).click();
    await page.waitForTimeout(1000);

    const preset = page.getByLabel('服务预置');
    const baseUrl = page.getByLabel('Base URL');
    const model = page.getByRole('textbox', { name: '模型', exact: true });
    const embeddingModel = page.getByRole('textbox', { name: 'Embedding 模型', exact: true });

    await assert.doesNotReject(async () => preset.waitFor({ state: 'visible', timeout: 5000 }));
    assert.equal(await preset.inputValue(), 'deepseek');
    assert.match(await baseUrl.inputValue(), /deepseek/i);
    assert.notEqual(await model.inputValue(), '');
    assert.equal(await embeddingModel.inputValue(), '');
    await expectText(page, '预置服务');
    await expectText(page, '默认不提供');
  } finally {
    await app.close();
  }
});

test('AI settings can switch between domestic and international presets', async () => {
  const { app, page } = await launchApp();
  try {
    await page.getByRole('link', { name: 'AI 设置' }).click();
    await page.waitForTimeout(1000);

    const preset = page.getByLabel('服务预置');
    const baseUrl = page.getByLabel('Base URL');

    await preset.selectOption('openai');
    await page.waitForTimeout(300);
    assert.match(await baseUrl.inputValue(), /openai/i);

    await preset.selectOption('qwen');
    await page.waitForTimeout(300);
    assert.match(await baseUrl.inputValue(), /dashscope|qwen|aliyuncs/i);

    await preset.selectOption('custom');
    await page.waitForTimeout(300);
    await expectText(page, '当前预置：自定义兼容服务');
  } finally {
    await app.close();
  }
});

test('search page explains that EPUB is not part of full-text indexing yet', async () => {
  const { app, page } = await launchApp();
  try {
    await page.getByRole('link', { name: '全文检索' }).click();
    await page.waitForTimeout(1000);
    await expectText(page, '暂未纳入全文索引');
  } finally {
    await app.close();
  }
});

test('research page shows default fallback guidance before API configuration', async () => {
  const { app, page } = await launchApp();
  try {
    await page.getByRole('link', { name: '研究智能' }).click();
    await page.waitForTimeout(1000);
    await expectText(page, '当前走基础检索');
    await expectText(page, 'API Key');
  } finally {
    await app.close();
  }
});

test('PDF reader explains that OCR is unavailable in the current build', async () => {
  const { app, page } = await launchApp();
  try {
    await queueImports(app, [path.join(root, '.codex-qa', 'fixtures', 'sample.pdf')]);
    await page.getByRole('button', { name: '导入文档' }).click();
    await page.waitForTimeout(1000);
    await page.locator('a[href^="#/reader/"]').first().click();
    await page.waitForTimeout(1500);
    await expectText(page, '当前构建未接入 OCR 引擎');
    await expectText(page, 'OCR 暂不可用');
  } finally {
    await app.close();
  }
});

test('AI actions show a friendly error when Base URL is invalid', async () => {
  const { app, page } = await launchApp();
  try {
    await page.getByRole('link', { name: 'AI 设置' }).click();
    await page.waitForTimeout(800);
    await page.getByLabel('服务预置').selectOption('custom');
    await page.getByLabel('Base URL').fill('not-a-url');
    await page.getByLabel('API Key').fill('demo-key');
    await page.getByRole('textbox', { name: '模型', exact: true }).fill('demo-model');
    await page.getByRole('button', { name: '保存设置' }).click();
    await page.waitForTimeout(800);

    await page.getByRole('link', { name: '书架' }).click();
    await page.waitForTimeout(800);

    await queueImports(app, [path.join(root, '.codex-qa', 'fixtures', 'sample.txt')]);
    await page.getByRole('button', { name: '导入文档' }).click();
    await page.waitForTimeout(1000);
    await page.locator('a[href^="#/reader/"]').first().click();
    await page.waitForTimeout(1500);

    await page.evaluate(() => {
      const block = document.querySelector('[data-block-id="block-1"]');
      const span = block?.querySelector('span');
      const textNode = span?.firstChild;
      if (!block || !span || !textNode || !textNode.textContent) {
        return;
      }
      const range = document.createRange();
      range.setStart(textNode, 0);
      range.setEnd(textNode, Math.min(10, textNode.textContent.length));
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      block.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    await page.waitForTimeout(500);
    await expectText(page, '保存高亮');
    await page.getByRole('button', { name: '解释' }).click();
    await page.waitForTimeout(1500);
    const pillText = await page.evaluate(
      () => document.querySelector('.pill')?.textContent ?? '',
    );
    assert.match(
      pillText,
      /Base URL 无效|网络连接失败|AI 服务返回|请先在 AI 设置/,
    );
  } finally {
    await app.close();
  }
});

async function expectText(page, text) {
  await assert.doesNotReject(async () =>
    page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: 5000 }),
  );
}
