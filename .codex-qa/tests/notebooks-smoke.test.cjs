const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');
const { _electron: electron } = require('playwright');

const root = path.resolve(__dirname, '..', '..');
const appExecutable = path.join(root, 'DeepSleepReader.exe');
const userDataDir = path.join(root, '.codex-qa', 'test-user-data', 'notebooks-smoke');
const fixturesDir = path.join(root, '.codex-qa', 'fixtures');
const rendererUrl = `${pathToFileURL(path.join(root, 'resources', 'app', 'dist', 'index.html')).href}#`;

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

async function expectText(page, text) {
  await assert.doesNotReject(async () =>
    page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: 6000 }),
  );
}

test('notebooks support multi-document research, artifacts, citations, and notebook reuse', async () => {
  const { app, page } = await launchApp({ reset: true });
  try {
    await queueImports(app, [
      path.join(fixturesDir, 'sample.txt'),
      path.join(fixturesDir, 'sample.md'),
      path.join(fixturesDir, 'sample.epub'),
    ]);

    for (let index = 0; index < 3; index += 1) {
      await page.getByRole('button', { name: '导入文档' }).click();
      await page.waitForTimeout(500);
    }

    await page.getByRole('link', { name: '笔记本', exact: true }).click();
    await page.waitForTimeout(800);
    await expectText(page, '笔记本');
    await page.getByLabel('笔记本标题').fill('Aurora Notebook');
    await page.getByRole('button', { name: '创建笔记本' }).click();
    await page.waitForTimeout(1200);
    await expectText(page, 'Aurora Notebook');
    await expectText(page, '来源文档');
    const notebookDocs = await page.evaluate(async () => {
      const docs = await window.readerApi.documents.list();
      return {
        txt: docs.find((doc) => doc.originalName === 'sample.txt')?.id ?? '',
        md: docs.find((doc) => doc.originalName === 'sample.md')?.id ?? '',
      };
    });
    await page.getByLabel('添加资料').selectOption(notebookDocs.txt);
    await page.getByRole('button', { name: '加入笔记本' }).click();
    await page.waitForTimeout(800);
    await page.getByLabel('添加资料').selectOption(notebookDocs.md);
    await page.getByRole('button', { name: '加入笔记本' }).click();
    await page.waitForTimeout(1000);

    await expectText(page, 'sample.txt');
    await expectText(page, 'sample.md');
    await expectText(page, '待配置');
    await expectText(page, '当前还不能生成自动摘要或关键概念');

    await page.getByLabel('研究问题').fill('aurora 的主题是什么？');
    await page.getByRole('button', { name: '提问' }).click();
    await page.waitForTimeout(1800);

    await expectText(page, '当前按基础证据检索返回结果');
    await expectText(page, '引用证据');
    await expectText(page, '事实核验');
    await expectText(page, '[1]');
    await expectText(page, 'supported');

    const notebookData = await page.evaluate(async () => {
      const notebooks = await window.readerApi.notebooks.list();
      const notebook = notebooks.find((item) => item.title === 'Aurora Notebook');
      if (!notebook) {
        return null;
      }
      const detail = await window.readerApi.notebooks.get(notebook.id);
      const turns = await window.readerApi.notebooks.listTurns(notebook.id);
      return {
        notebook,
        detail,
        turns,
      };
    });

    assert.ok(notebookData, 'notebook should exist');
    assert.equal(notebookData.detail.documents.length, 2);
    assert.ok(
      notebookData.detail.artifacts.some((artifact) => artifact.artifactType === 'doc_summary'),
      'doc summary artifact should be created',
    );
    assert.ok(
      notebookData.detail.artifacts.some((artifact) => artifact.artifactType === 'key_concepts'),
      'key concepts artifact should be created',
    );
    assert.equal(notebookData.turns.length, 1);
    assert.ok(notebookData.turns[0].citations.length > 0, 'turn should include citations');
    assert.ok(notebookData.turns[0].factChecks.length > 0, 'turn should include fact checks');

    await page.getByRole('link', { name: '笔记本', exact: true }).click();
    await page.waitForTimeout(800);
    await page.getByLabel('笔记本标题').fill('Reuse Notebook');
    await page.getByRole('button', { name: '创建笔记本' }).click();
    await page.waitForTimeout(800);
    await expectText(page, 'Reuse Notebook');
    await page.getByLabel('添加资料').selectOption(notebookDocs.txt);
    await page.getByRole('button', { name: '加入笔记本' }).click();
    await page.waitForTimeout(800);

    const reuseNotebookData = await page.evaluate(async () => {
      const notebooks = await window.readerApi.notebooks.list();
      const notebook = notebooks.find((item) => item.title === 'Reuse Notebook');
      return notebook ? window.readerApi.notebooks.get(notebook.id) : null;
    });
    assert.ok(reuseNotebookData, 'reuse notebook should exist');
    assert.equal(reuseNotebookData.documents.length, 1);
    assert.equal(reuseNotebookData.documents[0].originalName, 'sample.txt');
  } finally {
    await app.close();
  }
});
