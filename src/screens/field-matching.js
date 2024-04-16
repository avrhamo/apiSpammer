
const curlInput = '{"method":"GET","headers":{"authority":"login.bankhapoalim.co.il","accept":"application/json, text/plain, */*","accept-language":"he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7","content-type":"application/json;charset=UTF-8","$cookie":"_cls_v=b9460df9-b310-40bf-b065-8ab55c870260; bnhpremarketing=","referer":"https://login.bankhapoalim.co.il/ng-portals/rb/he/plastic-cards/order","sec-ch-ua":"\\"Chromium\\";v=\\"112\\", \\"Google Chrome\\";v=\\"112\\", \\"Not:A-Brand\\";v=\\"99\\"","sec-ch-ua-mobile":"?0","sec-ch-ua-platform":"\\"macOS\\"","sec-fetch-dest":"empty","sec-fetch-mode":"cors","sec-fetch-site":"same-origin","user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36","x-api-version":"2","x-b3-traceid":"60e464a7-3393-da14-5c3c-32d6a240adc8","x-xsrf-token":"44d150ef9fd5736621a8ada34d09405e72076a1de3bf8cf852d755224ddeb773","Accept-Encoding":"deflate, gzip"},"url":"https://login.bankhapoalim.co.il/bnhp-api/cards-channels/web-proposal/v1/proposals/credit-lobby?accountId=12-544-468629&_lang=he-IL"}';

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
                <td>${key}</td>
                <td>
                    <select class="dropdown" data-key="${key}">
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

function populateDropdowns(components, prefix = '') {
    for (let key in components) {
        if (components.hasOwnProperty(key)) {
            const value = components[key];
            const dropdown = document.querySelector(`[data-key="${key}"]`);

            if (dropdown || typeof value === 'object') {
                // Clear previous options if dropdown exists
                if (dropdown) {
                    dropdown.innerHTML = '';
                }

                // Populate options
                // Check if the value is an object (for nested properties)
                if (typeof value === 'object' && value !== null) {
                    // Recursively populate dropdowns for nested properties
                    populateDropdowns(value, `${prefix}${key}.`);
                } else {
                    // If value is not an object, add a single option with the value
                    const optionElement = document.createElement('option');
                    optionElement.text = value;
                    if (dropdown) {
                        dropdown.add(optionElement);
                    }
                }

                // Set default value if it exists in the options
                if (dropdown) {
                    dropdown.value = value;
                }
            }
        }
    }
}
