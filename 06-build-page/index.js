const path = require('path');
const { readdir, 
        mkdir, 
        copyFile, 
        rmdir, 
        unlink, 
        stat, 
        appendFile, 
        readFile, 
        writeFile, 
        truncate, 
        access, 
        constants
      } = require('fs/promises');

const sourceFolder = path.join(__dirname, 'assets');
const destinationFolder = path.join(__dirname, 'project-dist');
const destinationFolderAssets = path.join(destinationFolder, 'assets');

const folderStyles = path.join(__dirname, 'styles');
const pathToBundleCss = path.join(destinationFolder, 'style.css');
const pathToTemplateHtml = path.join(__dirname, 'template.html');


//* Удаляем Содержимое папки Project-dist

async function deleteFolder (pathToFolder) {
  try {
    if (access(pathToFolder, constants.R_OK | constants.W_OK)) {
      const destinationFolderContent = await readdir(pathToFolder);
      for (const file of destinationFolderContent) {
        const pathToFile = path.join(pathToFolder, file);
        const fileStats = await stat(pathToFile);
        if (fileStats.isDirectory()) {
          try {
            const pathToFile = path.join(pathToFolder, file);
            await rmdir(pathToFile);
          } catch (err) {
            const pathToFolderFile = path.join(pathToFolder, file);
            await deleteFolder (pathToFolderFile);
          }
        } else {
          const pathToFile = path.join(pathToFolder, file);
          await unlink(pathToFile);
        }
      }
    }
  } catch (err) {
    if (err) {
      console.error(err.message);
    }
  }
}

//* Копируем папку assets

async function copyContentToFolder (source, destination) {
  const folderContent = await readdir(source);
  try {
    mkdir(destination, { recursive: true });
    for (const file of folderContent) {
      const pathToSourceFile = path.join(source, file);
      const fileStats = await stat(pathToSourceFile);
      if (fileStats.isDirectory()) {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);
        await copyContentToFolder (sourcePath, destinationPath);
      } else {
        const sourcePath = path.join(source, file);
        const destinationPath = path.join(destination, file);
        await copyFile(sourcePath, destinationPath);
        }
      }
  } catch (err) {
    if (err) {
      console.error(err.message);
    }
  }
}

//* Собираем в единый файл стили из папки
async function writeFilesToBundle(folder, pathToOutputFile) {

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
}

async function createBundleScc() {
  try {
    await truncate(pathToBundleCss);
    await writeFilesToBundle(folderStyles, pathToBundleCss);
  } catch (err) {
    await writeFilesToBundle(folderStyles, pathToBundleCss);
  }
}

//* Собираем index.html
async function createBundleHtml() {
  try {
    const templateHtml = await readFile(pathToTemplateHtml, 'utf-8');
    let fileHtml = templateHtml;
    const tags = templateHtml.match(/{{+[a-z]+}}/g);
    for (let tag of tags) {
      const pathToComponent = path.join(__dirname, 'components', `${tag.slice(2, -2)}.html`);
      const component = await readFile(pathToComponent, 'utf-8');
      fileHtml = fileHtml.replace(`${tag}`, `${component}`);
      const pathToDestinationFileHtml = path.join(destinationFolder, 'index.html');
      await writeFile(pathToDestinationFileHtml, fileHtml);
    }
  } catch (err) {
    if (err) {
      console.error(err.message);
    }
  }
}

//* Запуск проекта

async function start() {
  mkdir(destinationFolder, { recursive: true });
  await deleteFolder(destinationFolder);
  copyContentToFolder(sourceFolder, destinationFolderAssets);
  createBundleScc();
  createBundleHtml();
  console.log('Bundle создан');
}
start();