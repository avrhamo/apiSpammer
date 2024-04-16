
const curlInput = '{\n' +
    '  "method": "POST",\n' +
    '  "headers": {\n' +
    '    "authority": "www.google.com",\n' +
    '    "accept": "*/*",\n' +
    '    "accept-language": "he-IL,he;q=0.9,en-US;q=0.8,en;q=0.7",\n' +
    '    "authorization": "SAPISIDHASH fd6f438c547cf9565ed53d9c95f5a8bc5ab5e0fe",\n' +
    '    "content-type": "text/plain;charset=UTF-8",\n' +
    '    "cookie": "SEARCH_SAMESITE=CgQIgZoB; HSID=AxLuoewIsbPmSoVYm; SSID=AiNd8eNJ0RKAp_nz7; SAPISID=GSF0KpO42ELxwOTG/A4LlgTZOQ1kj4huLd; APISID=roPIWJw55f9b7Dyf/AUHWrEbUZOlaJGZty; __Secure-1PAPISID=GSF0KpO42ELxwOTG/A4LlgTZOQ1kj4huLd; __Secure-3PAPISID=GSF0KpO42ELxwOTG/A4LlgTZOQ1kj4huLd; S=billing-ui-v3=N8eLfGB2-5OklhR4be_K1qh7NB_L8jr_:billing-ui-v3-efe=N8eLfGB2-5OklhR4be_K1qh7NB_L8jr_; SID=g.a000hwjqMoLKWUs2YFiznOIt5lMfppRLpzg8MG1QDo9wAq9RAJJ-8thxuTPRos0USUkzIa1yfQACgYKASMSAQASFQHGX2Mi4Mk-t-q1dKVyUyyjGSNaJhoVAUF8yKr_anKsuF0rwvnxbfuaEcGu0076; __Secure-1PSID=g.a000hwjqMoLKWUs2YFiznOIt5lMfppRLpzg8MG1QDo9wAq9RAJJ-CdgCoETE_hsnPPcwuxubjgACgYKAeUSAQASFQHGX2Mi3L5GLszryowCm987iqhi9BoVAUF8yKoCFmMI_4Mk3PxuxBNCE-_I0076; __Secure-3PSID=g.a000hwjqMoLKWUs2YFiznOIt5lMfppRLpzg8MG1QDo9wAq9RAJJ-waBaus0NSU_ml9ZIqcZkEwACgYKAUASAQASFQHGX2Mi2Di5qom_p1DiqoaEdQu9RBoVAUF8yKpJCMgIpydfDNAx3GmSqslt0076; AEC=AQTF6HyX_XxLFicqydpFP5T9g-MXp8N_Q90_cweT3X4PqETmqxF5yAHIKg; __Secure-1PSIDTS=sidts-CjEB7F1E_BVWEHvheYvLGNt-kv388zZXOz1s5omdHVx61xUTY5rLkZrRwZdjz71A_tHhEAA; __Secure-3PSIDTS=sidts-CjEB7F1E_BVWEHvheYvLGNt-kv388zZXOz1s5omdHVx61xUTY5rLkZrRwZdjz71A_tHhEAA; NID=513=hy3QFkWN7ELdPfQr1kLUd5_-_YxN8zn0XPvCdu2es4tHS97JbmWRWMybLsAarsKFuhmsepiggGSyg0PcN2oQsgaAl2iklptJhkylf_0qtPfArrA8IBRpIsm-1uZ_YVYE0xOhG8hRiqy66BhmY7O0yGv6nWayS6rzpQ8I5IcvjM7-vQPGwmaZV5MFNP8e5_ZtTFrm73mVwybJQdwLquOUcfFWEudOPRJvIRlWQSfEEolLt2xqgPbrlKYJIp-2PXG2Gwte-FbdHf9ROtLk2Ya-xtCS8vwm609d0Mp_RZlAol53vbjGU_-xR4OUJx-gM07IcCKC_Iq1ypVWZdasrZ4UkUJ9nPHBoudbiegcmtEYdZxbfNOMJyxjcunukg-JPO3SKqlfZn9F7x3gRwuRZq6PFPPemocA4Ho5QamuGy6P1lqJHloQNMGY80fWPh9utrZ37xo; 1P_JAR=2024-04-16-17; DV=QwpTQpIkRJpbACJ-bZgLX57d_JKA7phw4P5MyRCtgwAAAMDhzkjRjHWQtQAAAKxvDnFuwjx5PQAAAGggPL0IFLG4EQAAAA; SIDCC=AKEyXzWBj_4YncB5a17SO_koQlbgtyUhcFHqwD5GF8v976nsnEafQwJ2N2V9TIA0qE-UkaM_Oo0; __Secure-1PSIDCC=AKEyXzXen20O4yFeaC-98MJPShGrY-G2EcU-vJocbYCvUBIUpwmpxu14QVJQnQvTOd0dTxN_X-Ps; __Secure-3PSIDCC=AKEyXzXwUgmnCsi6Kw-2xiLJ-9dAX-E_-gxLOGD1v2-g38BbO1HiRsIeO9-2h_CCA-p9btVmQJFW",\n' +
    '    "origin": "https://www.google.com",\n' +
    '    "referer": "https://www.google.com/",\n' +
    '    "sec-ch-ua": "\\"Chromium\\";v=\\"112\\", \\"Google Chrome\\";v=\\"112\\", \\"Not:A-Brand\\";v=\\"99\\"",\n' +
    '    "sec-ch-ua-arch": "\\"arm\\"",\n' +
    '    "sec-ch-ua-bitness": "\\"64\\"",\n' +
    '    "sec-ch-ua-full-version": "\\"112.0.5615.121\\"",\n' +
    '    "sec-ch-ua-full-version-list": "\\"Chromium\\";v=\\"112.0.5615.121\\", \\"Google Chrome\\";v=\\"112.0.5615.121\\", \\"Not:A-Brand\\";v=\\"99.0.0.0\\"",\n' +
    '    "sec-ch-ua-mobile": "?0",\n' +
    '    "sec-ch-ua-model": "\\"\\"",\n' +
    '    "sec-ch-ua-platform": "\\"macOS\\"",\n' +
    '    "sec-ch-ua-platform-version": "\\"14.4.0\\"",\n' +
    '    "sec-ch-ua-wow64": "?0",\n' +
    '    "sec-fetch-dest": "empty",\n' +
    '    "sec-fetch-mode": "cors",\n' +
    '    "sec-fetch-site": "same-origin",\n' +
    '    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",\n' +
    '    "x-client-data": "CJW2yQEIpbbJAQipncoBCLyKywEIkqHLAQiGoM0BCIqnzQEIu8jNAQ==",\n' +
    '    "x-goog-authuser": "0",\n' +
    '    "Content-Type": "application/x-www-form-urlencoded"\n' +
    '  },\n' +
    '  "url": "https://www.google.com/log?format=json&hasfast=true&authuser=0",\n' +
    '  "body": {\n' +
    '    "body-value1": "value1",\n' +
    '    "body-value2": "value2",\n' +
    '    "body-value3": "value3"\n' +
    '  }\n' +
    '}';

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
                                <select class="form-select" data-key="${subKey}">
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
                        <div style="display: flex;">
                            <select class="form-select" data-key="${key}">
                            <!-- Dropdown options will be populated dynamically -->
                            </select>
                        </div>
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
