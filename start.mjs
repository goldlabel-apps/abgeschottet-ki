// /Users/goldlabel/GitHub/abgeschottet-ki/start.mjs

import { exec } from 'child_process';
import open from 'open'; // yarn add open

// Absolute path to your project root
const projectPath = '/Users/goldlabel/GitHub/aki';

// Helper: run a command in a new Terminal window/tab with proper cwd
function runInNewTerminal(command) {
  const fullCommand = `cd ${projectPath} && ${command}`;
  const script = `tell application "Terminal"
    activate
    do script "${fullCommand}"
  end tell`;
  exec(`osascript -e '${script}'`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error starting "${command}":`, err);
    }
    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);
  });
}

// Start each process in its own Terminal window/tab
runInNewTerminal('yarn ollama');
runInNewTerminal('yarn phi3');
runInNewTerminal('yarn frontend');
runInNewTerminal('yarn backend');

// Open browser after a delay
setTimeout(() => {
  const targetUrl = 'http://localhost:1975/database/table/pdfs';
  console.log(`aki-frontend open on ${targetUrl}`);
  open(targetUrl);
}, 5000);
