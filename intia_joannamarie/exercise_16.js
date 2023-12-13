let countryButton = document.querySelector('#country_search');

countryButton.addEventListener('click', function() {
    let countryChoice = 
        document.querySelector('#country_choice').value.trim();
    let apiURL = 
        `https://restcountries.com/v3.1/name/${countryChoice}?fullText=true`;

    fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
        console.log(data[0].flags.svg);
        console.log(data[0].name.common);
        console.log(data[0].capital[0]);
        console.log(data[0].region);
        console.log(Object.keys(data[0].currencies)[0]);

        console.log
            (data[0].currencies[Object.keys(data[0].currencies)[0]].name);
   
        let countryResult = document.querySelector('#country_result');

        countryResult.innerHTML = `
        <p><span class="highlight">Name:</span> ${data[0].name.common}</p>
        <p><span class="highlight">National Flag:</span></p>
        <img src="${data[0].flags.svg}">
        <p><span class="highlight">Capital:</span> ${data[0].capital[0]}</p>
        <p><span class="highlight">Region:</span> ${data[0].region}</p>
        <p><span class="highlight">Currency:</span> ${Object.keys(data[0]
            .currencies)[0]} - ${data[0]
            .currencies[Object.keys(data[0].currencies)[0]]
            .name}</p>
        `;
        return data;
    })

    .then((data) => {
        let region = 
            `https://restcountries.com/v3.1/region/${data[0].region}`;

        fetch(region)
        .then((response) => response.json())
        .then((data) => {
            let countriesOption = document.querySelector('#countries_option');

            countriesOption.innerHTML = `<p><span class="highlight">Other
            Countries in ${data[0].region}:</span></p>`;

            for (const country in data) {
                const newCountry = document.createElement('p');

                newCountry.innerHTML = `${data[country].name.common}`;

                countriesOption.appendChild(newCountry);
            }
        });
    });
}); 