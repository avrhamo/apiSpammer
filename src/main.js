const { app, BrowserWindow, ipcMain } = require('electron');
const mongodbHandler = require('./dataBase/mongodbHandler');
const curlParser = require('./utils/curlParser');
const Store = require('electron-store');
const store= new Store();


let connectionStringGlobal;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  })

  mainWindow.loadFile('./pages/dataSource.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


ipcMain.on('open-file-dialog', async (event) => {
  try {
    const filePath = await showOpenFileDialog();
    if (filePath > '') event.sender.send('file-selected', filePath);
  } catch (error) {
    console.error('Error handling open file dialog:', error);
  }
});

ipcMain.on('connect-to-DB', async (event, connectionString) => {
  if (!connectionString) {
    event.sender.send('bad-connection-string', 'Connection string is required');
    return;
  }

  try {
    await mongodbHandler.connectToMongoDBServer(connectionString);
    event.sender.send('connection-succeed');
    const dbLists = await mongodbHandler.getDBList();
    await mongodbHandler.closeConnectionToMongoDBServer();
    connectionStringGlobal = connectionString;
    event.sender.send('dbList-retrived', dbLists);

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    event.sender.send('connection-failed', 'Failed to connect to MongoDB');
  }
});

ipcMain.on('db-selected', async (event, selectedDB) => {
  try {
    await mongodbHandler.connectToMongoDBServer(connectionStringGlobal);
    const collections = await mongodbHandler.getCollectionsList(selectedDB);
    await mongodbHandler.closeConnectionToMongoDBServer();
    event.sender.send('collectionList-retrived', collections);
  } catch (error) {
    console.error('Error retrieving collections for database:', error);
    event.sender.send('collections-retrieval-failed', 'Failed to retrieve collections for database');
  }
});

ipcMain.on('collection-selected', async (event, selectedDB, selectedCollection) => {
  try {
    await mongodbHandler.connectToMongoDBServer(connectionStringGlobal);
    const mostRichDocument = await mongodbHandler.getMostRichDocument(selectedDB, selectedCollection);
    await mongodbHandler.closeConnectionToMongoDBServer();

    const collection = {
      collectionName: selectedCollection,
      collectionDb: selectedDB,
      dataSample: mostRichDocument
    };
    const dataSource = store.get('appStorage.dataSource', []);

    const isItemExists = dataSource.some(item =>
        item.collection.collectionName === selectedCollection &&
        item.collection.collectionDb === selectedDB
    );
    if (!isItemExists) {

      dataSource.push({ collection });
      store.set('appStorage', { dataSource });
      console.dir(store.get('appStorage'), { depth: null });

    } else {
      console.log('Item already exists in collection');
    }

    event.sender.send('mostRichDocument-retrived', mostRichDocument);

  } catch (error) {
    console.error('Error retrieving MostRichDocument from database:', error);
    event.sender.send('collection-selected', 'Failed to retrieve MostRichDocument from database');
  }
});

ipcMain.on('parse-curl', async (event, curl) => {
  console.log(curlParser.parse(curl));
});


