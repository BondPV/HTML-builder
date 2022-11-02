const path = require('path');
const { readdir, stat } = require('fs/promises');

const readFilesOfDirectory = async () => {
  const folder = path.join(__dirname, 'secret-folder');
  try {
    const folderContent = await readdir(folder);

    folderContent.forEach(async (file) => {
      const pathToFile = path.join(folder, file);
      const fileStats = await stat(pathToFile);

      if (fileStats.isFile()) {
        const ext = path.extname(pathToFile);
        console.log(`${path.basename(pathToFile, ext)} - ${ext.slice(1, ext.length)} - ${fileStats.size / 1024} kb`);
      }
    });

  } catch (err) {
    if (err) {
      console.error(err.message);
    }
  }
};

readFilesOfDirectory();