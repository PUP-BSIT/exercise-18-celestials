let searchButton = document.querySelector('#search_button');

searchButton.addEventListener('click', function() {
    let inputCountry = document.querySelector('#input_country').value;
    let apiURL = `https://restcountries.com/v3.1/name/${inputCountry}?
        fullText=true`;

    fetch(apiURL)
        .then((response) => response.json())
        .then((data) => {
            console.log(data[0]);
            displayDetailsInTable(data[0]);
            displayCountriesInSameRegion(data[0].region);
        });
});

function displayDetailsInTable(countryData) {
    let table = document.createElement('table');
    table.classList.add('country-details-table');

    const propertiesToDisplay = [
        { label: 'Name', value: countryData.name.common },
        { label: 'Flag', value: `<img src="${countryData.flags.svg}">` },
        { label: 'Capital', value: countryData.capital[0] },
        { label: 'Region', value: countryData.region },
        { label: 'Currency', value: `${Object.keys(countryData.currencies)[0]}  
            - ${countryData.currencies[Object.keys
            (countryData.currencies)[0]].name}`}
    ];

    propertiesToDisplay.forEach((property) => {
        const row = table.insertRow();
        const labelCell = row.insertCell(0);
        const valueCell = row.insertCell(1);

        labelCell.textContent = property.label;
        valueCell.innerHTML = property.value;
    });

    let displayDetails = document.querySelector('#display_details');
    displayDetails.innerHTML = '';
    displayDetails.appendChild(table);
}

function displayCountriesInSameRegion(region) {
    let regionApiURL = `https://restcountries.com/v3.1/region/${region}`;

    fetch(regionApiURL)
        .then((response) => response.json())
        .then((data) => {
            displayOtherCountries(data);
        });
}

function displayOtherCountries(countries) {
    let regionTable = document.createElement('table');
    regionTable.classList.add('region-countries-table');

    const headerRow = regionTable.insertRow();
    const headerCell = document.createElement('th');
    headerCell.textContent = 'Other Countries in the Same Region';
    headerCell.colSpan = 2;
    headerRow.appendChild(headerCell);

    countries.forEach((country) => {
        const row = regionTable.insertRow();
        const countryCell = row.insertCell(0);
        const flagCell = row.insertCell(1);

        countryCell.textContent = country.name.common;
        flagCell.innerHTML = `<img src="${country.flags.svg}">`;
    });

    let otherCountriesDisplay = document.querySelector('#other_countries');
    otherCountriesDisplay.innerHTML = '';
    otherCountriesDisplay.appendChild(regionTable);
}