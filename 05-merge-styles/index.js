const fs = require('fs');
const path = require('path');
const { readdir, stat, appendFile, readFile, truncate } = require('fs/promises');

const folderStyles = path.join(__dirname, 'styles');
const pathToBundleCss = path.join(__dirname,'project-dist', 'bundle.css');

const writeFilesToBundle = async (folder, pathToOutputFile) => {

  try {
    const folderContent = await readdir(folder);

    folderContent.forEach(async (file) => {
      const pathToFile = path.join(folder, file);
      const fileStats = await stat(pathToFile);

      if (fileStats.isFile()) {
        const ext = path.extname(pathToFile);
        const extension = ext.slice(1, ext.length);
        if (extension === 'css') {
          const contents = await readFile(pathToFile, 'utf-8');
          appendFile(pathToOutputFile, contents);
        }
      }
    });

  } catch (err) {
    if (err) {
      console.error(err.message);
    }
  }
};

const createBundleScc = async () => {
  try {
    await truncate(pathToBundleCss);
    await writeFilesToBundle(folderStyles, pathToBundleCss);
    console.log('Bundle CSS обновлен!');
  } catch (err) {
    await writeFilesToBundle(folderStyles, pathToBundleCss);
    console.log('Bundle CSS создан!');
  }
};

createBundleScc();



