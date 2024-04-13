const { ipcRenderer } = require('electron');

const browseButton = document.getElementById('file-browse-button');
const filePathInput = document.getElementById('file-path-text');

const connectButton = document.getElementById('connect-button');
const connectionString = document.getElementById('connection-string-text');

const dbMenu = document.getElementById('DB-menu');
const collectioMenu = document.getElementById('collections-menu');

const DBButton = document.getElementById('DB-button');
const collectioButton = document.getElementById('collection-button');

const dataSampleBox = document.getElementById('data-sample-text');


let selectedDB;
let selectedCollection;

browseButton.addEventListener('click', () => {
  ipcRenderer.send('open-file-dialog');
});

ipcRenderer.on('file-selected', (event, filePath) => {
  filePathInput.value = filePath;
});

connectButton.addEventListener('click', () => {
  connectionString.value = 'mongodb+srv://m001-student:avimongo675@sandbox.aeaa1.mongodb.net/test';
  ipcRenderer.send('connect-to-DB', connectionString.value);
});

dbMenu.addEventListener('click', (event) => {
  if (event.target.classList.contains('dropdown-item')) {
    selectedDB = event.target.textContent;
    DBButton.textContent = event.target.textContent;
    ipcRenderer.send('db-selected', selectedDB);
  }
});

collectioMenu.addEventListener('click', (event) => {
  if (event.target.classList.contains('dropdown-item')) {
    selectedCollection = event.target.textContent;
    collectioButton.textContent = event.target.textContent;
    dataSampleBox.value = '';
    ipcRenderer.send('collection-selected', selectedDB, selectedCollection);
  }
});

ipcRenderer.on('dbList-retrived', (event, dbLists) => {
  dbMenu.innerHTML = '';
  dbLists.forEach(dbName => {
    const menuItem = document.createElement('a');
    menuItem.classList.add('dropdown-item');
    menuItem.href = '#';
    menuItem.textContent = dbName;
    dbMenu.appendChild(menuItem);
  });
});

ipcRenderer.on('collectionList-retrived', (event, collectionList) => {
  collectioMenu.innerHTML = '';
  collectionList.forEach(collectionName => {
    const menuItem = document.createElement('a');
    menuItem.classList.add('dropdown-item');
    menuItem.href = '#';
    menuItem.textContent = collectionName;
    collectioMenu.appendChild(menuItem);
  });
});

ipcRenderer.on('mostRichDocument-retrived', (event, mostRichDocument) => {
  console.log('Most rich document:', mostRichDocument);
  const documentString = JSON.stringify(mostRichDocument, null, 2);
  dataSampleBox.value = documentString;
  dataSampleBox.style.fontFamily = 'monospace';
});

