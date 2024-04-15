
const curlInput = '{\n' +
    '  "method": "OPTIONS",\n' +
    '  "headers": {\n' +
    '    "accept": "*/*",\n' +
    '    "accept-language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",\n' +
    '    "access-control-request-headers": "authorization",\n' +
    '    "access-control-request-method": "POST",\n' +
    '    "origin": "https://mail.google.com",\n' +
    '    "referer": "https://mail.google.com/",\n' +
    '    "sec-fetch-dest": "empty",\n' +
    '    "sec-fetch-mode": "cors",\n' +
    '    "sec-fetch-site": "same-site",\n' +
    '    "user-agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Mobile Safari/537.36"\n' +
    '  },\n' +
    '  "url": "https://play.google.com/log?format=json&hasfast=true"\n' +
    '}\n';

const parsedCurlInput = JSON.parse(curlInput);

document.addEventListener('DOMContentLoaded', function () {

    // Populate the table with cURL components
    function populateTable() {
        const tableBody = document.getElementById('curlTableBody');
        if (tableBody) {
            tableBody.innerHTML = generateTableRows(parsedCurlInput);
        }
    }
    populateTable();
    populateDropdowns(parsedCurlInput)
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
                <td>queryParam.${key}</td>
                <td>
                    <select class="dropdown" data-key="queryParam.${key}">
                        <!-- Dropdown options will be populated dynamically -->
                    </select>
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
                            <td>
                                <select class="dropdown" data-key="${subKey}">
                                    <!-- Dropdown options will be populated dynamically -->
                                </select>
                            </td>
                        </tr>`;
                    }
                }
            } else {
                // Add a row for the key-value pair
                tableRows += `<tr>
                    <td>${key}</td>
                    <td>
                        <select class="dropdown" data-key="${key}">
                            <!-- Dropdown options will be populated dynamically -->
                        </select>
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
            const dropdown = document.querySelector(`[data-key="${key}"]`);

            if (dropdown) {
                // Clear previous options
                dropdown.innerHTML = '';

                // Populate options
                // Check if the value is an object (for nested properties)
                if (typeof value === 'object' && value !== null) {
                    for (let subKey in value) {
                        const optionElement = document.createElement('option');
                        optionElement.text = value[subKey];
                        dropdown.add(optionElement);
                    }
                } else {
                    // If value is not an object, add a single option with the value
                    const optionElement = document.createElement('option');
                    optionElement.text = value;
                    dropdown.add(optionElement);
                }

                // Set default value if it exists in the options
                dropdown.value = value;
            }
        }
    }
}
