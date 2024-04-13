import {curlconverter} from 'curlconverter';
import { ipcRenderer } from 'electron';

const curlTextArea = document.getElementById('curl-text-area');
const parseCurlButton = document.getElementById('parse-curl-button');

parseCurlButton.addEventListener('click', async () => {
    const jsonString = curlconverter.toJsonString(curlTextArea.value);
    await ipcRenderer.send('parse-curl', jsonString);
});
