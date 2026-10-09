const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const versionJsonPath = path.join(rootDir, 'assets', 'version.json');
const versionJsPath = path.join(rootDir, 'assets', 'js', 'build-version.js');

// 1. Determine Git Commit SHA
let commitSha = process.env.COMMIT_REF || process.env.HEAD || '';
let shortCommit = commitSha ? commitSha.substring(0, 7) : '';

if (!shortCommit) {
  try {
    shortCommit = execSync('git rev-parse --short HEAD', { cwd: rootDir }).toString().trim();
    commitSha = execSync('git rev-parse HEAD', { cwd: rootDir }).toString().trim();
  } catch (err) {
    shortCommit = 'dev-' + Math.floor(Math.random() * 1000);
    commitSha = shortCommit;
  }
}

// 2. Read existing version info to maintain build count
let existing = { buildNumber: 0, version: '1.0.0' };
if (fs.existsSync(versionJsonPath)) {
  try {
    existing = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
  } catch (e) {}
}

const buildNumber = (existing.buildNumber || 0) + 1;
const versionStr = `v1.0.${buildNumber}`;

const now = new Date();
const formattedDate = now.toLocaleString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZoneName: 'short',
  hour12: false
});

const buildData = {
  version: versionStr,
  commit: shortCommit,
  fullCommit: commitSha,
  buildTime: now.toISOString(),
  buildFormatted: formattedDate,
  buildNumber: buildNumber,
  targetHost: 'preview.fxnstudio.com'
};

// Ensure directory exists
if (!fs.existsSync(path.dirname(versionJsPath))) {
  fs.mkdirSync(path.dirname(versionJsPath), { recursive: true });
}

// Write assets/version.json
fs.writeFileSync(versionJsonPath, JSON.stringify(buildData, null, 2), 'utf8');

// Write assets/js/build-version.js
const jsContent = `/* Auto-generated site build version details */
window.FXN_BUILD_INFO = ${JSON.stringify(buildData, null, 2)};
`;
fs.writeFileSync(versionJsPath, jsContent, 'utf8');

console.log(`[FXN Build System] Successfully generated build version: ${versionStr} (${shortCommit}) at ${formattedDate}`);
