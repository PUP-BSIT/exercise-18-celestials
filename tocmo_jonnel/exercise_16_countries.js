let searchBtn = document.querySelector('#search_btn');

searchBtn.addEventListener('click', function() {
    let countryInput = document.querySelector('#country_input').value.trim();
    let apiURL = 
    `https://restcountries.com/v3.1/name/${countryInput}?fullText=true`;

    fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {

        result.innerHTML = `
            <p><span class="highlight">Name:</span> ${data[0].name.common}</p>
            <p><span class="highlight">National Flag:</span></p>
            <img src="${data[0].flags.svg}">
            <p><span class="highlight">Capital:</span> ${data[0]
                .capital[0]}</p>
            <p><span class="highlight">Region:</span> ${data[0].region}</p>
            <p><span class="highlight">Currency:</span> ${Object.keys(data[0]
                .currencies)[0]} - ${data[0]
                .currencies[Object.keys(data[0].currencies)[0]]
                .name}</p>
            `;
            return data;
    })
    .then((data) => {
        let region = `https://restcountries.com/v3.1/region/${data[0].region}`;

        fetch(region)
        .then((response) => response.json())
        .then((data) => {
            let otherCountries = document.querySelector('#other_countries');

            otherCountries.innerHTML = `<p><span class="highlight">Other
             Countries in ${data[0].region}:</span></p>`;

            for (const country in data) {
                const newCountry = document.createElement('p');

                newCountry.innerHTML = `${data[country].name.common}`;

                otherCountries.appendChild(newCountry);
            }
        });
    });
});