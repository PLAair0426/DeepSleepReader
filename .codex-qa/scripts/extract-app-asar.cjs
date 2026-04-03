const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

function normalizeHeaderText(text) {
  return text.charCodeAt(0) === 0xfeff || text.startsWith('>') ? text.slice(1) : text;
}

async function extractAsar({ archivePath, unpackedRoot, outputRoot }) {
  const archive = await fsp.readFile(archivePath);
  const headerSize = archive.readUInt32LE(12);
  const headerText = normalizeHeaderText(
    archive.slice(16, 16 + headerSize).toString('utf8'),
  );
  const header = JSON.parse(headerText);
  const payloadStart = 18 + headerSize;

  async function walk(node, relativePath = '') {
    if (!node.files) {
      return;
    }

    for (const [name, child] of Object.entries(node.files)) {
      const childRelativePath = relativePath
        ? path.join(relativePath, name)
        : name;
      const outputPath = path.join(outputRoot, childRelativePath);

      if (child.files) {
        await fsp.mkdir(outputPath, { recursive: true });
        await walk(child, childRelativePath);
        continue;
      }

      await fsp.mkdir(path.dirname(outputPath), { recursive: true });

      if (child.unpacked) {
        await fsp.copyFile(path.join(unpackedRoot, childRelativePath), outputPath);
        continue;
      }

      const offset = payloadStart + Number(child.offset || 0);
      const buffer = archive.slice(offset, offset + child.size);
      await fsp.writeFile(outputPath, buffer);
    }
  }

  await walk(header);
}

async function main() {
  const root = path.resolve(__dirname, '..', '..');
  const resourcesDir = path.join(root, 'resources');
  const archivePath = path.join(resourcesDir, 'app.asar.original');
  const unpackedRoot = path.join(resourcesDir, 'app.asar.unpacked');
  const outputRoot = path.join(resourcesDir, 'app');

  await fsp.rm(outputRoot, { recursive: true, force: true });
  await fsp.mkdir(outputRoot, { recursive: true });
  await extractAsar({ archivePath, unpackedRoot, outputRoot });

  process.stdout.write(`${outputRoot}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error?.stack ?? String(error)}\n`);
  process.exitCode = 1;
});
