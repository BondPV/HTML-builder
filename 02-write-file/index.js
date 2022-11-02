const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const pathToFile = path.join(__dirname,'text.txt');
const outputFile = fs.createWriteStream(pathToFile);

stdout.write('Введите текст:\n');
stdin.on('data', data => {
  if(data.toString().trim() === 'exit') {
    getOut();
  }
  outputFile.write(data);
});

process.on('SIGINT', () => {
  getOut();
});

function getOut() {
  stdout.write('До свидания!\n');
  exit();
}