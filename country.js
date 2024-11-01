const container = document.getElementById('countries-container');
const filterContainer = document.getElementById('filterContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentIndex = 0;
let totalSlides = 0;
let allCountries = [];

// Fetch all countries from the REST Countries API
fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        allCountries = data;
        const subregions = [...new Set(data.map(country => country.subregion))].filter(Boolean); // Unique subregions

        // Create "All Countries" filter button
        const allButton = document.createElement('button');
        allButton.textContent = "All Countries";
        allButton.classList.add('filter-button');
        allButton.addEventListener('click', () => displayCountries(allCountries)); // Show all countries on click
        filterContainer.appendChild(allButton);

        // Create filter buttons for each subregion
        subregions.forEach(subregion => {
            const button = document.createElement('button');
            button.textContent = subregion;
            button.classList.add('filter-button');
            button.addEventListener('click', () => filterBySubregion(subregion));
            filterContainer.appendChild(button);
        });

        displayCountries(data); // Display all countries initially
    })
    .catch(error => console.error('Error fetching country data:', error));

// Display countries in groups of 20
function displayCountries(countries) {
    container.innerHTML = ''; // Clear previous content
    const chunkSize = 20;
    totalSlides = Math.ceil(countries.length / chunkSize);
    currentIndex = 0; // Reset to the first slide on display update

    for (let i = 0; i < totalSlides; i++) {
        const countryGroup = document.createElement('div');
        countryGroup.className = 'country-group';

        countries.slice(i * chunkSize, i * chunkSize + chunkSize).forEach(country => {
            const countryDiv = document.createElement('div');
            countryDiv.className = 'country';

            const flag = document.createElement('img');
            flag.src = country.flags.png;
            flag.alt = `${country.name.common} flag`;

            const name = document.createElement('span');
            name.textContent = country.name.common;

            countryDiv.appendChild(flag);
            countryDiv.appendChild(name);
            countryGroup.appendChild(countryDiv);

            countryDiv.addEventListener('click', () => displayCountryInfo(country));
        });

        container.appendChild(countryGroup);
    }
    updateDisplay(); // Set initial display and button states
}

// Filter by subregion
function filterBySubregion(subregion) {
    const filteredCountries = allCountries.filter(country => country.subregion === subregion);
    displayCountries(filteredCountries);
}

// Scroll to the left
function scrollLeft() {
    if (currentIndex > 0) {
        currentIndex--;
        updateDisplay(); // Update display to show the correct slide
    }
}

// Scroll to the right
function scrollRight() {
    if (currentIndex < totalSlides - 1) {
        currentIndex++;
        updateDisplay(); // Update display to show the correct slide
    }
}

// Update the display and container transform based on the current index
function updateDisplay() {
    const offset = currentIndex * 100; // Calculate the offset for translation
    container.style.transform = `translateX(-${offset}%)`; // Move the container
    updateButtons(); // Update button state
}

// Enable/disable buttons based on the current index
function updateButtons() {
    prevBtn.disabled = currentIndex === 0; // Disable prev if at the first slide
    nextBtn.disabled = currentIndex === totalSlides - 1; // Disable next if at the last slide
}

// Display country info in modal with additional details
function displayCountryInfo(country) {
    const details = `
        <h2 id="modalCountryName" class="country-name">${country.name.common}</h2>
        <img src="${country.flags.png}" alt="Flag of ${country.name.common}" class="country-flag" />
        <p><strong>Official Name:</strong> ${country.name.official}</p>
        <p><strong>Capital City:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area ? country.area.toLocaleString() + " km²" : "N/A"}</p>
        <p><strong>Languages Spoken:</strong> ${country.languages ? Object.values(country.languages).join(', ') : "N/A"}</p>
        <p><strong>Time Zones:</strong> ${country.timezones ? country.timezones.join(', ') : "N/A"}</p>
        <p><strong>Location:</strong> ${country.latlng ? `Latitude: ${country.latlng[0]}, Longitude: ${country.latlng[1]}` : "N/A"}</p>
    `;

    // Check and display nearby countries if available
    if (country.borders && country.borders.length > 0) {
        Promise.all(country.borders.map(border =>
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                .then(response => response.json())
                .then(data => data[0].name.common) // Extract country name
        )).then(neighbors => {
            document.getElementById('country-details').innerHTML = `${details}
                <p><strong>Nearby Countries:</strong> ${neighbors.join(', ')}</p>`;
            document.getElementById('countryModal').style.display = "block"; // Show modal with details
        });
    } else {
        document.getElementById('country-details').innerHTML = `${details}
            <p><strong>Nearby Countries:</strong> None</p>`;
        document.getElementById('countryModal').style.display = "block"; // Show modal with details
    }
}

// Close modal functionality
const modal = document.getElementById('countryModal');
document.getElementById('closeModal').onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
