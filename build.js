const fs = require('fs-extra');
const { execSync } = require('child_process');

console.info('Clearing old dist folder...');
fs.ensureDirSync('./dist');
fs.emptyDirSync('./dist');

console.info('Copying config...');
fs.copySync('./config.json', './dist/config.json');

console.info('Copying readme...');
fs.copySync('./readme.md', './dist/readme.md');

console.info('Packaging executable...');
execSync('pkg . -t win-x64 -o ./dist/FitForLive.exe');

console.info('Copying `usb` bindings...');
fs.copySync('./node_modules/usb/src/binding/usb_bindings.node', './dist/usb_bindings.node');

console.log('Done!');