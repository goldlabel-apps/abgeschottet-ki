// /Users/goldlabel/GitHub/abgeschottet-ki/start.mjs

// start.mjs (in your project root)
import { exec } from 'child_process';
import open from 'open'; // yarn add open

// Absolute path to your project root
const projectPath = '/Users/goldlabel/GitHub/abgeschottet-ki';

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
runInNewTerminal('yarn next');

// Open browser after a delay
setTimeout(() => {
  const targetUrl = 'http://localhost:1975';
  console.log(`Opening ${targetUrl} in your default browser...`);
  open(targetUrl);
}, 4000);
