// /Users/goldlabel/GitHub/abgeschottet-ki/start.mjs
import { exec } from 'child_process';
import open from 'open'; // install with: yarn add open

// 1. Open browser
const targetUrl = 'http://localhost:1975';
console.log(`Opening ${targetUrl} in your default browser...`);
open(targetUrl);

// 2. Spawn a new terminal window and run a command
// On macOS we can use AppleScript via `osascript`
const commandToRun = 'echo OK'; // replace with your actual command later

// AppleScript to tell Terminal to open a new window and run a command
const appleScript = `
tell application "Terminal"
  activate
  do script "${commandToRun}"
end tell
`;

// Execute the AppleScript
exec(`osascript -e '${appleScript.replace(/\n/g, '')}'`, (err, stdout, stderr) => {
  if (err) {
    console.error('Error opening new Terminal window:', err);
    return;
  }
  if (stderr) console.error(stderr);
  console.log(stdout);
});
