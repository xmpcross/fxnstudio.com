const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
let timeoutId = null;

console.log('[FXN Preview Watcher] Watching for file changes in /opt/projects/fxnstudio.com...');

function triggerBuild(filename) {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    console.log(`[FXN Preview Watcher] Change detected in ${filename}. Rebuilding preview version...`);
    exec('node scripts/generate-version.js', { cwd: rootDir }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[FXN Preview Watcher Error] ${error.message}`);
        return;
      }
      if (stdout) console.log(stdout.trim());
    });
  }, 400);
}

const watchDirs = [
  rootDir,
  path.join(rootDir, 'assets'),
  path.join(rootDir, 'assets', 'js'),
  path.join(rootDir, 'assets', 'css'),
  path.join(rootDir, 'about-us'),
  path.join(rootDir, 'services'),
  path.join(rootDir, 'contact'),
  path.join(rootDir, 'portfolio'),
  path.join(rootDir, 'blog')
];

watchDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    try {
      fs.watch(dir, { recursive: false }, (eventType, filename) => {
        if (!filename) return;
        if (filename.includes('version.json') || filename.includes('build-version.js') || filename.startsWith('.')) {
          return;
        }
        triggerBuild(filename);
      });
    } catch (e) {}
  }
});
