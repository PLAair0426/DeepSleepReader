const path = require('path');
const { app } = require('electron');

const userDataRoot = path.resolve(process.cwd(), '.codex-qa', 'sandbox-profile');

for (const [key, target] of [
  ['userData', userDataRoot],
  ['logs', path.join(userDataRoot, 'logs')],
  ['sessionData', path.join(userDataRoot, 'session-data')],
]) {
  try {
    app.setPath(key, target);
  } catch (error) {
    process.stderr.write(`[qa-hook] failed to set ${key}: ${error?.message ?? String(error)}\n`);
  }
}
