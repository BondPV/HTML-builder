const fs = require('fs');
const path = require('path');
const stream = fs.createReadStream(path.join(__dirname,'text.txt'), 'utf-8');

let data = '';
stream.on('data', (chunk) => {
  data += chunk.toString();
});

stream.on('end', () => {
  console.log(data);
});