const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

// Capture elements
var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnDelete = document.getElementById('btnDelete');
var btnUpdate = document.getElementById('btnUpdate');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');
var wishlistname = document.getElementById('wishlistname');
var startDate = document.getElementById('startDate');
var endDate = document.getElementById('endDate');

let pathName = path.join(__dirname, 'Files');

// Function to open custom alert modal
function showAlert(message) {
    const alertModal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.innerText = message;
    alertModal.style.display = 'block';
}

// Close modal function
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Event listener for close button and modal button
document.getElementById('closeModal').onclick = function() {
    closeModal('alertModal');
};
document.getElementById('modalButton').onclick = function() {
    closeModal('alertModal');
};

// CREATE - creates a JSON file with contents and attributes
btnCreate.addEventListener('click', function() {
    let file = path.join(pathName, wishlistname.value + '.json');
    let data = {
        country: fileName.value,
        dateTravel: {
            start: startDate.value,
            end: endDate.value
        },
        activities: fileContents.value
    };

    fs.writeFile(file, JSON.stringify(data), function(err) {
        if (err) {
            console.log(err);
            showAlert("Error creating file: " + err.message);
            return;
        }
        showAlert(`${wishlistname.value} travel plan was created`);
        console.log("The file was created");

        // Display file creation info
        displayFileInfo(data);
    });
});

// READ - reads the content of the specified JSON file and displays each attribute
btnRead.addEventListener('click', function() {
    let targetFile = wishlistname.value + '.json';
    let file = path.join(pathName, targetFile);

    fs.readFile(file, 'utf8', function(err, data) {
        if (err) {
            console.log(err);
            showAlert("Error reading file: " + err.message);
            return;
        }

        let parsedData = JSON.parse(data);
        fileContents.value = parsedData.activities;
        showAlert(`File ${wishlistname.value} was read successfully!`);
        console.log("The file was read!");

        // Display read file information
        displayFileInfo(parsedData);
    });
});

// DELETE - opens a confirmation modal before deleting the specified JSON file
btnDelete.addEventListener('click', function() {
    document.getElementById('deleteModal').style.display = 'block'; // Show confirmation modal
});

// Confirm delete action
document.getElementById('confirmDeleteButton').onclick = function() {
    let targetFile = wishlistname.value + '.json';
    let file = path.join(pathName, targetFile);

    fs.unlink(file, function(err) {
        if (err) {
            console.log(err);
            showAlert("Error deleting file: " + err.message);
            return;
        }
        showAlert(`File ${wishlistname.value} was deleted successfully!`);
        console.log("The file was deleted!");

        // Clear form and hide creation information
        fileName.value = "";
        fileContents.value = "";
        wishlistname.value = "";
        startDate.value = "";
        endDate.value = "";
        document.getElementById('creationInfo').style.display = 'none';
    });

    closeModal('deleteModal'); // Hide confirmation modal after delete action
};

// Cancel delete action
document.getElementById('cancelDeleteButton').onclick = function() {
    closeModal('deleteModal'); // Hide confirmation modal
};

// UPDATE - updates the specified JSON file with new data
btnUpdate.addEventListener('click', function() {
    let targetFile = wishlistname.value + '.json';
    let file = path.join(pathName, targetFile);
    let data = {
        country: fileName.value,
        dateTravel: {
            start: startDate.value,
            end: endDate.value
        },
        activities: fileContents.value
    };

    fs.writeFile(file, JSON.stringify(data), function(err) {
        if (err) {
            console.log(err);
            showAlert("Error updating file: " + err.message);
            return;
        }
        showAlert(`File ${wishlistname.value} was updated successfully!`);
        console.log("The file was updated");

        // Display updated information
        displayFileInfo(data);
    });
});

// Helper function to display file information
function displayFileInfo(data) {
    document.getElementById('createdFileName').innerText = `Wishlist Name: ${wishlistname.value}`;
    document.getElementById('createdFileCountry').innerText = `Wishlist Country: ${data.country}`;
    document.getElementById('createdFileDate').innerText = `Travel Dates: From ${data.dateTravel.start} to ${data.dateTravel.end}`;
    document.getElementById('createdFileContents').innerText = `Activities: ${data.activities}`;
    document.getElementById('creationInfo').style.display = 'block';
}

// Populate Wishlist Country field on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedCountry = localStorage.getItem('wishlistCountry');
    if (savedCountry) {
        document.getElementById('fileName').value = savedCountry;
    }
});
