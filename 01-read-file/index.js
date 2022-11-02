const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname,'text.txt');
const stream = fs.createReadStream(pathToFile, 'utf-8');

let data = '';
stream.on('data', (chunk) => {
  data += chunk.toString();
});

stream.on('end', () => {
  console.log(data);
});  