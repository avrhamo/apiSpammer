
const curlInput = '{\n' +
    '  "method": "POST",\n' +
    '  "headers": {\n' +
    '    "authority": "www.google.com",\n' +
    '    "accept": "*/*",\n' +
    '    "accept-language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",\n' +
    '    "authorization": "SAPISIDHASH fd6f438c547cf9565ed53d9c95f5a8bc5ab5e0fe",\n' +
    '    "content-type": "text/plain;charset=UTF-8"\n' +
    '  },\n' +
    '  "url": "https://www.google.com/log?format=json&hasfast=true&authuser=0",\n' +
    '  "body": {\n' +
    '    "body-key1": "value1",\n' +
    '    "body-key2": "value2",\n' +
    '    "body-key3": "value3"\n' +
    '  }\n' +
    '}';

const parsedCurlInput = JSON.parse(curlInput);
const { ipcRenderer } = require('electron');


document.addEventListener('DOMContentLoaded', function () {

    // Populate the table with cURL components
    function populateTable() {
        const tableBody = document.getElementById('curlTableBody');
        if (tableBody) {
            tableBody.innerHTML = generateTableRows(parsedCurlInput);
        }
    }
    populateTable();
    populateDropdowns(parsedCurlInput);

    // Find all dropdown toggle buttons
    var dropdownToggleButtons = document.querySelectorAll('.dropdown-toggle');
    var dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'))

    // Loop through each dropdown toggle button
    dropdownToggleButtons = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl)
      })
});

function generateTableRows(components) {
    let tableRows = '';
    
    if (components.hasOwnProperty('url')) {
        const urlValue = components['url'];
        // Parse the URL string
        const urlObject = new URL(urlValue);

        // Add row for the domain
        tableRows += `<tr>
            <td>domain</td>
            <td>${urlObject.origin}</td>
        </tr>`;

        // Add row for the path
        tableRows += `<tr>
            <td>path</td>
            <td>${urlObject.pathname}</td>
        </tr>`;

        // Add rows for query parameters
        urlObject.searchParams.forEach((value, key) => {
            tableRows += `<tr>
                <td>${key}</td>
                <td class="align-middle my-auto">
                <div class="dropdown d-flex align-items-center my-auto justify-content-xxl-start align-items-xxl-end" id="dropdownElement-${key}">
                <button class="btn btn-secondary dropdown-toggle" 
                        aria-expanded="false" 
                        data-bs-toggle="dropdown"
                        type="button" data-key="drop-button-${key}" id="drop-button-${key}"> ${value} 
                    </button>
                    <div class="dropdown-menu" data-key="drop-menu-${key}" id="drop-menu-${key}">
                    <!-- Dropdown options will be populated dynamically -->
                </div>
                </div>
                </td>
            </tr>`;
        });
    }

    for (let key in components) {
        if (key !== 'url' && components.hasOwnProperty(key)) {
            const value = components[key];

            // If the value is an object, iterate over its keys
            if (typeof value === 'object' && value !== null) {
                for (let subKey in value) {
                    if (value.hasOwnProperty(subKey)) {
                        const subValue = value[subKey];
                        // Add a row for the subKey-subValue pair
                        tableRows += `<tr> 
                            <td>${subKey}</td>
                            <td class="align-middle my-auto">
                            <div class="dropdown d-flex align-items-center my-auto justify-content-xxl-start align-items-xxl-end" id="dropdownElement-${key}">
                            <button class="btn btn-secondary dropdown-toggle" 
                                    aria-expanded="false" 
                                    data-bs-toggle="dropdown"
                                    type="button" data-key="drop-button-${subKey}" id="drop-button-${subKey}"> ${subValue} 
                                </button>
                                <div class="dropdown-menu" data-key="drop-menu-${subKey}" id="drop-menu-${subKey}">
                                <!-- Dropdown options will be populated dynamically -->
                            </div>
                            </div>
                            </td>
                        </tr>`;
                    }
                }
            } else {
                // Add a row for the key-value pair
                tableRows += `<tr>
                    <td>${key}</td>
                    <td class="align-middle my-auto">
                    <div class="dropdown d-flex align-items-center my-auto justify-content-xxl-start align-items-xxl-end" id="dropdownElement-${key}">
                    <button class="btn btn-secondary dropdown-toggle" 
                            aria-expanded="false" 
                            data-bs-toggle="dropdown"
                            type="button" data-key="drop-button-${key}" id="drop-button-${key}"> ${value} 
                        </button>
                        <div class="dropdown-menu" data-key="drop-menu-${key}" id="drop-menu-${key}">
                        <!-- Dropdown options will be populated dynamically -->
                    </div>
                    </div>
                    </td>
                </tr>`;
            }
        }
    }

    return tableRows;
}

function populateDropdowns(components) {

    for (let key in components) {
        if (components.hasOwnProperty(key)) {
            const value = components[key];
            const dropdown = document.querySelector(`[data-key="drop-menu-${key}"]`);
            // const dropdown = document.getElementById(`drop-menu-${key}`);
            if (typeof value === 'object' && value !== null) {
                // Recursively populate dropdowns for nested properties
                populateDropdowns(value);
            }
            // Check if dropdown element exists
            if (dropdown) {
                // If value is not an object, add a single option with the value
                const dropdownItem = document.createElement('a');
                dropdownItem.classList.add('dropdown-item');
                dropdownItem.textContent = value;
                dropdownItem.setAttribute('href', '#');
                dropdownItem.setAttribute('id', `dropdownItem-${key}`);
                dropdown.appendChild(dropdownItem);

                // Event listener to update button text when an item is selected
                dropdown.addEventListener('click', function(event) {
                    if (event.target.classList.contains('dropdown-item')) {
                        const selectedItem = event.target.textContent;
                        const buttonId = dropdown.dataset.key.replace('drop-menu-', 'drop-button-');
                        const button = document.getElementById(buttonId);
                        if (button) {
                            button.textContent = selectedItem;
                        }
                    }
                });
                
                populateDropdown(key);
            }
        }
    }
}

function populateDropdown(key) {
    const dropdownMenu = document.getElementById(`drop-menu-${key}`);
    dropdownMenu.innerHTML = '';

    ipcRenderer.send('electronStore.get', 'appStorage.dataSource');

    ipcRenderer.on('electronStore.get.response', (event, collections) => {
        if (collections) {
            collections.forEach(entry => {
                const collection = entry.collection;
                const dataSample = collection.dataSample;

                // Check if dataSample is an object
                if (typeof dataSample === 'object' && dataSample !== null) {
                    // Extract keys of the dataSample object
                    const keys = Object.keys(dataSample);

                    // Add each key as a dropdown item
                    keys.forEach(key => {
                        const dropdownItem = document.createElement('a');
                        dropdownItem.classList.add('dropdown-item');
                        dropdownItem.textContent = key;
                        dropdownItem.setAttribute('href', '#');
                        dropdownItem.setAttribute('id', `dropdownItem-${key}`);
                        dropdownMenu.appendChild(dropdownItem);
                    });
                } else {
                    console.error('Error: dataSample is not an object');
                }
            });
        } else {
            console.error('Error: Failed to retrieve collections data from Electron store');
        }
    });
}
