const path = require('path');
const { copyFile, constants, mkdir, readdir, access, unlink } = require('fs/promises');

const sourceFolder = path.join(__dirname, 'files');
const destinationFolder = path.join(__dirname, 'files-copy');

const copyFolder = async (source, destination) => {
  const folderContent = await readdir(source);
  try {
    mkdir(destination, { recursive: true });
    if (access(destination, constants.R_OK | constants.W_OK)) {
      const destinationFolderContent = await readdir(destination);
      for (const file of destinationFolderContent) {
          const destinationPath = path.join(destination, file);
          unlink(destinationPath);
        }
    } 
    for (const file of folderContent) {
    const sourcePath = path.join(source, file);
    const destinationPath = path.join(destination, file);
    await copyFile(sourcePath, destinationPath);
    }
    console.log(`Файлы успешно скопированы`);

  } catch (err) {
    if (err) {
      console.error(err.message);
    }
  }
};

copyFolder(sourceFolder, destinationFolder);