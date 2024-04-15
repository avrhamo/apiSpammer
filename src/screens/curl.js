const { ipcRenderer } = require('electron');

const curlTextArea = document.getElementById('curl-text-area');
const parseCurlButton = document.getElementById('parse-curl-button');

parseCurlButton.addEventListener('click', async () => {
    await ipcRenderer.send('parse-curl', curlTextArea.value);
});
