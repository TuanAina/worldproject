// Function to handle button click for fetching country data and displaying map links
function buttonClick() {
    const countryInput = document.getElementById("countryInput").value;

    // Fetch country data by name
    fetch(`https://restcountries.com/v3.1/name/${countryInput}`)
        .then(response => {
            if (!response.ok) throw new Error('Country not found');
            return response.json();
        })
        .then(data => {
            const countryData = data[0];
            const countryName = countryData.name.common;

            // Display country name
            document.getElementById('countryDisplay').innerText = countryName;

            // Display map links
            const googleMapsLink = countryData.maps.googleMaps;
            const openStreetMapsLink = countryData.maps.openStreetMaps;

            // Create link elements dynamically
            document.getElementById('googleMapsLink').href = googleMapsLink;
            document.getElementById('openStreetMapsLink').href = openStreetMapsLink;
            document.getElementById('mapLinks').style.display = 'block'; // Show links section

            // Set map to the country's coordinates
            const lat = countryData.latlng[0];
            const lng = countryData.latlng[1];
            map.setView([lat, lng], 5); // Zoom in on country
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('countryDisplay').innerText = 'Country not found';
            document.getElementById('mapLinks').style.display = 'none'; // Hide links if not found
        });
    const searchInput = document.getElementById('countryInput').value; // Get input value
    localStorage.setItem('wishlistCountry', searchInput);
}

// Function to handle "View Country Details" button click
function viewCountryDetails() {
    const countryInput = document.getElementById("countryInput").value; // Get the country name from the input

    if (countryInput) {
        // Fetch country data by name
        fetch(`https://restcountries.com/v3.1/name/${countryInput}`)
            .then(response => {
                if (!response.ok) throw new Error('Country not found');
                return response.json();
            })
            .then(data => {
                const country = data[0]; // Get the first country from the response

                // Display details and borders
                const details = `
                    <img src="${country.flags.png}" alt="Flag of ${country.name.common}" style="width: 100px; height: auto;" />
                    <p><strong>Country Name:</strong> ${country.name.common}</p>
                    <p><strong>Official Name:</strong> ${country.name.official}</p>
                    <p><strong>Capital City:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                    <p><strong>Region:</strong> ${country.region}</p>
                    <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
                    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                    <p><strong>Area:</strong> ${country.area ? country.area.toLocaleString() + " km²" : "N/A"}</p>
                    <p><strong>Continent:</strong> ${country.continents ? country.continents.join(', ') : "N/A"}</p>
                    <p><strong>Languages Spoken:</strong> ${country.languages ? Object.values(country.languages).join(', ') : "N/A"}</p>
                    <p><strong>Time Zones:</strong> ${country.timezones ? country.timezones.join(', ') : "N/A"}</p>
                    <p><strong>Location:</strong> ${country.latlng ? `Latitude: ${country.latlng[0]}, Longitude: ${country.latlng[1]}` : "N/A"}</p><br>
                    <p><strong>Coat of Arms:</strong> <br>
                    <img src="${country.coatOfArms.png}" alt="Coat of Arms of ${country.name.common}" style="width: 100px; height: auto;" /></p>
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
            })
            .catch(error => {
                console.error("Error fetching country details:", error);
                document.getElementById('country-details').innerHTML = `<p>Error fetching details: ${error.message}</p>`;
                document.getElementById('countryModal').style.display = "block"; // Show modal even on error
            });
    } else {
        document.getElementById('country-details').innerHTML = `<p>Please enter a country name.</p>`;
        document.getElementById('countryModal').style.display = "block"; // Show modal for user input error
    }
}

// Function to close the modal
function closeModal() {
    document.getElementById('countryModal').style.display = "none"; // Hide the modal
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('countryModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Initialize the map separately
let map;
document.addEventListener("DOMContentLoaded", function () {
    map = L.map("map").setView([20, 0], 2);

    // Set up the OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
});
