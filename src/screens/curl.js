const { ipcRenderer } = require('electron');
const curlconverter = require('curlconverter');


exports.parseCurlToJson = (curlCommand) => {

    const options = { output: 'json' };
    curlconverter.toNode(curlCommand, options)
        .then((jsonFormat) => {
            console.log(jsonFormat);
        })
        .catch((error) => {
            console.error(error);
        });
}
