
const curlInput = '{\n' +
'  "method": "POST",\n' +
'  "headers": {\n' +
'    "authority": "www.google.com",\n' +
'    "accept": "*/*",\n' +
'    "accept-language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",\n' +
'    "authorization": "SAPISIDHASH fd6f438c547cf9565ed53d9c95f5a8bc5ab5e0fe",\n' +
'    "jwt": "SAPISIDHASH fd6f438c547cf9565ed53d9c95f5a8bc5ab5e0fe",\n' +
'    "content-type": "text/plain;charset=UTF-8"\n' +
'  },\n' +
'  "url": "http://localhost:8080/log?format=json&hasfast=true&authuser=0",\n' +
'  "body": {\n' +
'    "body-key1": {"key1": "value1", "key2": "value2", "key3": "value3"},\n' +
'    "body-key2": "value2",\n' +
'    "body-key3": "value3"\n' +
'  }\n' +
'}';

const parsedCurlInput = JSON.parse(curlInput);
const { ipcRenderer } = require('electron');
let urlParsed = false;

document.addEventListener('DOMContentLoaded', function () {
    function extractParamsFromUrl(url) {
        const urlObject = new URL(url);
        const pathParams = urlObject.pathname.split('/').filter(param => param !== ''); // Extract path params
        const queryParams = Object.fromEntries(urlObject.searchParams); // Extract query params
        return { pathParams, queryParams };
    }
    
    // Extract parameters from the URL and add them to the parsedCurlInput object
    const { pathParams, queryParams } = extractParamsFromUrl(parsedCurlInput.url);
    parsedCurlInput.urlParams = { pathParams, queryParams };
    console.log(parsedCurlInput);

    
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

function generateTableRows(components, parentKey = '') {
    let tableRows = '';

    if (components.hasOwnProperty('url') && !urlParsed) {
        const urlValue = components['url'];
        // Parse the URL string
        const urlObject = new URL(urlValue);

        // Add row for the domain
        tableRows += `<tr style="border: 1px solid #ced4da;">
            <td class="align-middle my-auto">Domain</td>
            <td><input type="text" class="align-middle my-auto" value="${urlObject.origin}" id="domainInput" /></td>
        </tr>`;
        // Add row for the path
        tableRows += `<tr style="border: 1px solid #ced4da;">
            <td class="align-middle my-auto">Path</td>
            <td><input type="text" class="align-middle my-auto" value="${urlObject.pathname}" id="pathInput" /></td>
        </tr>`;

        // Add rows for query parameters
        urlObject.searchParams.forEach((value, key) => {
            tableRows += generateRowWithCheckbox(`urlParams.queryParams.${key}`, value);
        });

        urlParsed = true;
    }

    // Title rows for "HEADERS" and "BODY"
    const titleRows = {
        headers: '<tr class="table-active"><td colspan="2">HEADERS</td></tr>',
        body: '<tr class="table-active"><td colspan="2">BODY</td></tr>'
    };

    for (let key in components) {
        if (components.hasOwnProperty(key) && key !== 'url') {
            const value = components[key];
            const fullKey = parentKey ? `${parentKey}.${key}` : key;

            if (typeof value === 'object' && value !== null) {
                // Add title row if it's a header or body section
                if (titleRows[key]) {
                    tableRows += titleRows[key];
                }

                // Check if the key indicates URL parameters and process accordingly
                if (key.toLowerCase().includes('params')) {
                    // URL parameters
                    for (let subKey in value) {
                        if (value.hasOwnProperty(subKey)) {
                            const subValue = value[subKey];
                            tableRows += generateRowWithCheckbox(`${key}.${subKey}`, subValue);
                        }
                    }
                } else {
                    // Headers or body fields
                    if (Array.isArray(value)) {
                        // If it's an array, recursively process each item
                        value.forEach((item, index) => {
                            tableRows += generateTableRows(item, `${fullKey}.${index}`);
                        });
                    } else {
                        tableRows += generateTableRows(value, fullKey);
                    }
                }
            } else {
                // Generate row for a simple key-value pair
                tableRows += generateRowWithCheckbox(fullKey, value);
            }
        }
    }

    return tableRows;
}


function generateRowWithCheckbox(key, value, isSpecialField = true) {
    return `<tr style="border: 1px solid #ced4da;">
        <td>${key}</td>
        <td class="align-middle my-auto">
            <div class="row">
                <div class="col-6">
                    <div class="dropdown mr-3" id="dropdownElement-${key}">
                        <button class="btn btn-secondary dropdown-toggle" 
                                aria-expanded="false" 
                                data-bs-toggle="dropdown"
                                type="button" data-key="drop-button-${key}" id="drop-button-${key}"> ${value} 
                        </button>
                        <div class="dropdown-menu dropdown-menu-scroll" style="max-height: 300px; overflow-y: auto;" data-key="drop-menu-${key}" id="drop-menu-${key}">
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="form-check mr-3">
                        <input class="form-check-input" type="checkbox" id="checkbox-${key}" data-key="${key}">
                        <label class="form-check-label ml-1" for="checkbox-${key}">Disable</label>
                    </div>
                </div>
                <div class="col-2">
                    ${isSpecialField ? 
                        `<button class="btn btn-info" 
                            aria-expanded="false"
                            type="button" data-special-field-btn="true"> Special Field
                        </button>` : ''}
                </div>
            </div>
        </td>
    </tr>`;
}


function populateDropdowns(components) {
    for (let key in components) {
        if (components.hasOwnProperty(key)) {
            const value = components[key];
            const dropdown = document.querySelector(`[data-key="drop-menu-${key}"]`);
            if (typeof value === 'object' && value !== null) {
                // Recursively populate dropdowns for nested properties
                populateDropdowns(value);
            }
            // Check if dropdown element exists
            if (dropdown) {
                // Create search input field within the dropdown menu
                const searchInput = document.createElement('input');
                searchInput.setAttribute('type', 'text');
                searchInput.setAttribute('placeholder', 'Search...');
                searchInput.classList.add('dropdown-item', 'search-input');
                dropdown.appendChild(searchInput);

                // Add event listener to filter dropdown items based on search input
                searchInput.addEventListener('input', function (event) {
                    const searchText = event.target.value.toLowerCase();
                    const dropdownItems = dropdown.querySelectorAll('.dropdown-item:not(.search-input)');
                    dropdownItems.forEach(function (item) {
                        const textContent = item.textContent.toLowerCase();
                        if (textContent.includes(searchText)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
                // Add event listener to search input field
                searchInput.addEventListener('keydown', function (event) {
                    const dropdownItems = dropdown.querySelectorAll('.dropdown-item:not(.search-input)');
                    const visibleItems = Array.from(dropdownItems).filter(item => item.style.display !== 'none');
                    const currentIndex = visibleItems.findIndex(item => item === document.activeElement);

                    switch (event.key) {
                        case 'ArrowDown':
                            event.preventDefault();
                            if (currentIndex < visibleItems.length - 1) {
                                visibleItems[currentIndex + 1].focus();
                            }
                            break;
                        case 'ArrowUp':
                            event.preventDefault();
                            if (currentIndex > 0) {
                                visibleItems[currentIndex - 1].focus();
                            }
                            break;
                    }
                });

                // Event listener to update button text when an item is selected
                dropdown.addEventListener('click', function (event) {
                    if (event.target.classList.contains('dropdown-item') && !event.target.classList.contains('search-input')) {
                        const selectedItem = event.target.textContent;
                        const buttonId = dropdown.dataset.key.replace('drop-menu-', 'drop-button-');
                        const button = document.getElementById(buttonId);
                        if (button) {
                            button.textContent = selectedItem;
                            // Update default value
                            button.dataset.defaultValue = selectedItem;
                        }
                    }
                });

                // Populate dropdown options asynchronously
                populateDropdown(key, value);
            }
        }
    }
}

function populateDropdown(key, value) {
    const dropdownMenu = document.getElementById(`drop-menu-${key}`);
    if (!dropdownMenu) return;

    ipcRenderer.send('electronStore.get', 'appStorage.dataSource');

    ipcRenderer.once('electronStore.get.response', (event, collections) => {
        if (collections) {
            collections.forEach(entry => {
                const collection = entry.collection;
                const dataSample = collection.dataSample;

                // Check if dataSample is an object
                if (typeof dataSample === 'object' && dataSample !== null) {
                    // Extract keys of the dataSample object
                    const keys = Object.keys(dataSample);
                    keys.push(value);
                    // Add each key as a dropdown item
                    keys.forEach(key => {
                        const dropdownItem = document.createElement('a');
                        dropdownItem.classList.add('dropdown-item');
                        dropdownItem.textContent = key;
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


// Function to handle checkbox change event
function handleCheckboxChange(event) {
    const key = event.target.dataset.key;
    const dropdownButton = document.getElementById(`drop-button-${key}`);
    if (event.target.checked) {
        dropdownButton.setAttribute('disabled', 'disabled');
    } else {
        dropdownButton.removeAttribute('disabled');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const specialFieldButtons = document.querySelectorAll('[data-special-field-btn]');
    const modal = new bootstrap.Modal(document.getElementById('specialFieldModal'));

    specialFieldButtons.forEach(button => {
        button.addEventListener('click', function () {
            modal.show();
        });
    });

    document.getElementById('saveSpecialFieldBtn').addEventListener('click', function () {
        // Get the value entered in the modal input field
        const specialFieldValue = document.getElementById('specialFieldInput').value;
        // Do something with the value, e.g., send it to the server
        console.log('Special Field Value:', specialFieldValue);
        // Close the modal
        modal.hide();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const authorizationCheckbox = document.getElementById('authorizationCheckbox');
    const encodedFieldCheckbox = document.getElementById('encodedFieldCheckbox');
    const jwtCheckbox = document.getElementById('jwtCheckbox');

    const authorizationFields = document.getElementById('authorizationFields');
    const encodedField = document.getElementById('encodedField');
    const jwtField = document.getElementById('jwtField');

    const modal = new bootstrap.Modal(document.getElementById('specialFieldModal'));

    // Function to show only the related fields based on checkbox selection
    function showRelatedFields() {
        authorizationFields.style.display = authorizationCheckbox.checked ? 'block' : 'none';
        encodedField.style.display = encodedFieldCheckbox.checked ? 'block' : 'none';
        jwtField.style.display = jwtCheckbox.checked ? 'block' : 'none';
    }

    // Initially show only the authorization fields
    showRelatedFields();

    // Function to handle checkbox selection
    function handleCheckboxSelection(checkbox) {
        if (checkbox === authorizationCheckbox) {
            encodedFieldCheckbox.checked = false;
            jwtCheckbox.checked = false;
        } else if (checkbox === encodedFieldCheckbox) {
            authorizationCheckbox.checked = false;
            jwtCheckbox.checked = false;
        } else if (checkbox === jwtCheckbox) {
            authorizationCheckbox.checked = false;
            encodedFieldCheckbox.checked = false;
        }

        // Show only the related fields
        showRelatedFields();
    }

    // Event listeners for checkbox selection
    authorizationCheckbox.addEventListener('change', function () {
        handleCheckboxSelection(this);
    });

    encodedFieldCheckbox.addEventListener('change', function () {
        handleCheckboxSelection(this);
    });

    jwtCheckbox.addEventListener('change', function () {
        handleCheckboxSelection(this);
    });

    // Event listener for saving the special field
    document.getElementById('saveSpecialFieldBtn').addEventListener('click', function () {
        // Handle saving the special field based on the checkbox selection
        // ...

        // Close the modal
        modal.hide();
    });
});
