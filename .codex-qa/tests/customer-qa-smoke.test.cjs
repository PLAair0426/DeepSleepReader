const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');
const { _electron: electron } = require('playwright');

const root = path.resolve(__dirname, '..', '..');
const appExecutable = path.join(root, 'DeepSleepReader.exe');
const userDataDir = path.join(root, '.codex-qa', 'test-user-data', 'customer-smoke');
const fixturesDir = path.join(root, '.codex-qa', 'fixtures');
const rendererUrl = `${pathToFileURL(path.join(root, 'resources', 'app', 'dist', 'index.html')).href}#`;

const fixturePaths = {
  pdf: path.join(fixturesDir, 'sample.pdf'),
  epub: path.join(fixturesDir, 'sample.epub'),
  txt: path.join(fixturesDir, 'sample.txt'),
  md: path.join(fixturesDir, 'sample.md'),
};

async function launchApp({ reset = true } = {}) {
  if (reset) {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  }
  fs.mkdirSync(userDataDir, { recursive: true });
  const app = await electron.launch({
    executablePath: appExecutable,
    args: [`--user-data-dir=${userDataDir}`],
    timeout: 30000,
  });
  const page = await app.firstWindow();
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1200);
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

async function expectVisibleText(page, text) {
  await assert.doesNotReject(async () =>
    page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: 5000 }),
  );
}

async function expectBodyIncludes(page, text) {
  const bodyText = await page.evaluate(() => document.body.innerText);
  assert.match(bodyText, new RegExp(text));
}

test('customer empty state and multi-format imports work from a clean library', async () => {
  const { app, page } = await launchApp({ reset: true });
  try {
    await expectVisibleText(page, '书架还是空的');
    await expectVisibleText(page, '0 份资料');

    await queueImports(app, [
      fixturePaths.pdf,
      fixturePaths.epub,
      fixturePaths.txt,
      fixturePaths.md,
      fixturePaths.txt,
    ]);

    for (let index = 0; index < 5; index += 1) {
      await page.getByRole('button', { name: '导入文档' }).click();
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(1200);

    const docs = await page.evaluate(() => window.readerApi.documents.list());
    assert.equal(docs.length, 4);
    assert.deepEqual(
      docs.map((doc) => doc.format).sort(),
      ['epub', 'md', 'pdf', 'txt'],
    );

    await expectVisibleText(page, '4 份资料');
    await expectVisibleText(page, 'sample.pdf');
    await expectVisibleText(page, 'sample.epub');
    await expectVisibleText(page, 'sample.txt');
    await expectVisibleText(page, 'sample.md');
  } finally {
    await app.close();
  }
});

test('customer can open each supported format and see the expected reader states', async () => {
  const { app, page } = await launchApp({ reset: false });
  try {
    const docs = await page.evaluate(() => window.readerApi.documents.list());
    const byFormat = Object.fromEntries(docs.map((doc) => [doc.format, doc]));

    await page.goto(`${rendererUrl}/reader/${byFormat.txt.id}`);
    await page.waitForTimeout(1500);
    await expectVisibleText(page, 'DeepSleepReader QA Sample TXT');
    await expectVisibleText(page, '还没有书签。可以在任意位置留下研究锚点。');
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
    await expectVisibleText(page, '当前选段');
    await expectVisibleText(page, '保存高亮');
    await expectVisibleText(page, '解释');

    await page.goto(`${rendererUrl}/reader/${byFormat.md.id}`);
    await page.waitForTimeout(1500);
    await expectVisibleText(page, 'DeepSleepReader QA Markdown');
    await expectVisibleText(page, 'Markdown should remain readable and searchable.');

    await page.goto(`${rendererUrl}/reader/${byFormat.epub.id}`);
    await page.waitForTimeout(2500);
    await expectVisibleText(page, 'sample.epub');
    await expectBodyIncludes(page, 'EPUB');

    await page.goto(`${rendererUrl}/reader/${byFormat.pdf.id}`);
    await page.waitForTimeout(2500);
    await expectVisibleText(page, 'DeepSleepReader QA PDF');
    await expectVisibleText(page, '当前构建未接入 OCR 引擎');
    await expectVisibleText(page, 'OCR 暂不可用');
  } finally {
    await app.close();
  }
});

test('customer-facing search, review, research, timeline, and settings flows have visible evidence', async () => {
  const { app, page } = await launchApp({ reset: false });
  try {
    const docs = await page.evaluate(() => window.readerApi.documents.list());
    const txtDoc = docs.find((doc) => doc.format === 'txt');
    assert.ok(txtDoc, 'TXT doc should exist after import');

    await page.evaluate(async (doc) => {
      await window.readerApi.reader.savePosition({
        documentId: doc.id,
        format: doc.format,
        positionPayloadJson: JSON.stringify({ blockId: 'block-2' }),
      });
      await window.readerApi.bookmarks.upsert({
        documentId: doc.id,
        format: doc.format,
        positionPayloadJson: JSON.stringify({ blockId: 'block-1' }),
        title: 'Seed bookmark',
        note: 'Seed bookmark note',
      });
      await window.readerApi.annotations.upsert({
        documentId: doc.id,
        format: doc.format,
        anchorType: 'text-range',
        anchorPayload: {
          blockId: 'block-1',
          startOffset: 0,
          endOffset: 10,
          quoteSnippet: 'DeepSleepR',
        },
        selectedText: 'DeepSleepR',
        color: 'amber',
        note: 'Seed annotation for QA',
      });
    }, txtDoc);

    await page.getByRole('link', { name: '全文检索' }).click();
    await page.waitForTimeout(800);
    await page.getByLabel('检索关键词').fill('aurora-txt-31415');
    await page.getByRole('button', { name: '检索书架' }).click();
    await page.waitForTimeout(1500);
    await expectVisibleText(page, 'Block 3');
    await expectVisibleText(page, '暂未纳入全文索引');

    await page.getByRole('link', { name: '研究回顾' }).click();
    await page.waitForTimeout(800);
    await expectVisibleText(page, '导出 Markdown');
    await expectVisibleText(page, 'Seed annotation for QA');

    const markdown = await page.evaluate((documentId) => window.readerApi.review.exportMarkdown({ documentId }), txtDoc.id);
    assert.match(markdown, /Seed annotation for QA/);
    assert.match(markdown, /No AI cards matched|没有 AI 卡片/);

    await page.getByRole('link', { name: '研究智能' }).click();
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: '同步文档片段知识库' }).click();
    await page.waitForTimeout(1200);
    await page.getByLabel('研究问题').fill('aurora');
    await page.getByRole('button', { name: '开始研究' }).click();
    await page.waitForTimeout(1500);
    await expectVisibleText(page, '当前走基础检索');
    await expectVisibleText(page, 'Block 3');
    await expectVisibleText(page, '这次研究没有生成综合答案');

    await page.getByRole('link', { name: '阅读时间线' }).click();
    await page.waitForTimeout(800);
    await expectVisibleText(page, '阅读时间线');
    await expectBodyIncludes(page, 'document-imported');
    await expectBodyIncludes(page, 'annotation-created');

    const timelineEvents = await page.evaluate(() => window.readerApi.timeline.list());
    assert.ok(
      timelineEvents.some((event) => event.eventType === 'document-imported'),
      'timeline should include document-imported',
    );
    assert.ok(
      timelineEvents.some((event) => event.eventType === 'annotation-created'),
      'timeline should include annotation-created',
    );

    await page.getByRole('link', { name: 'AI 设置' }).click();
    await page.waitForTimeout(800);
    await page.getByLabel('服务预置').selectOption('qwen');
    await page.getByLabel('API Key').fill('demo-key');
    await page.getByRole('button', { name: '保存设置' }).click();
    await page.waitForTimeout(800);
    await expectVisibleText(page, '设置已保存');
  } finally {
    await app.close();
  }
});
