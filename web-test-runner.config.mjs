import { existsSync } from 'node:fs';
import { puppeteerLauncher } from '@web/test-runner-puppeteer';
import { sendMousePlugin } from '@web/test-runner-commands/plugins';

const chromeCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

const executablePath = chromeCandidates.find((path) => existsSync(path));

export default {
  files: 'test/**/*.test.js',
  nodeResolve: true,
  coverage: true,
  plugins: [sendMousePlugin()],
  browsers: [
    puppeteerLauncher({
      launchOptions: executablePath
        ? { executablePath, headless: 'new' }
        : { channel: 'chrome', headless: 'new' },
    }),
  ],
};
