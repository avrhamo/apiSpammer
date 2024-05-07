
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
    '    "body-key1": "value1",\n' +
    '    "body-key2": "value2",\n' +
    '    "body-key3": "value3"\n' +
    '  }\n' +
    '}';

const parsedCurlInput = JSON.parse(curlInput);
const { ipcRenderer } = require('electron');


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
            tableRows += generateRowWithCheckbox(key, value);
        });
    }

    for (let key in components) {
        if (components.hasOwnProperty(key)) {
            const value = components[key];

            // If the value is an object, iterate over its keys
            if (typeof value === 'object' && value !== null) {
                for (let subKey in value) {
                    if (value.hasOwnProperty(subKey)) {
                        const subValue = value[subKey];
                        if(typeof subValue !== 'object') tableRows += generateRowWithCheckbox(subKey, subValue);
                    }
                }
            } else {
                tableRows += generateRowWithCheckbox(key, value);
            }
        }
    }

    return tableRows;
}

function generateRowWithCheckbox(key, value) {
    return `<tr style="border: 1px solid #ced4da;"> <!-- Add border styling to the row -->
        <td>${key}</td>
        <td class="align-middle my-auto">
            <div class="dropdown-checkbox-container d-flex align-items-center">
                <div class="dropdown" id="dropdownElement-${key}">
                    <button class="btn btn-secondary dropdown-toggle" 
                            aria-expanded="false" 
                            data-bs-toggle="dropdown"
                            type="button" data-key="drop-button-${key}" id="drop-button-${key}"> ${value} 
                    </button>
                    <div class="dropdown-menu dropdown-menu-scroll" style="max-height: 300px; overflow-y: auto;" data-key="drop-menu-${key}" id="drop-menu-${key}">
                        <!-- Dropdown options will be populated dynamically -->
                    </div>
                </div>
                <div class="form-check" style="margin-left: 10px;"> <!-- Added custom margin -->
                    <input class="form-check-input" type="checkbox" id="checkbox-${key}" data-key="${key}">
                    <label class="form-check-label" for="checkbox-${key}">Disable</label>
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
