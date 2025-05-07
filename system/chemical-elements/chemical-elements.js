// An object containing information about the elements
const elementData = {
    hydrogen: {
        name: 'Hydrogen',
        info: 'Hydrogen is a chemical element with the symbol H and atomic number 1.',
    },
    helium: {
        name: 'Helium',
        info: 'Helium is a chemical element with the symbol He and atomic number 2.',
    },
    lithium: {
        name: 'Lithium',
        info: 'Lithium is a chemical element with the symbol Li and atomic number 3.',
    },
    // Add more elements as needed
};

// Function to update the page content based on the selected element
function updateElementDetails(element) {
    const data = elementData[element];

    // Update the content on the page
    document.getElementById('element-name').textContent = data.name;
    document.getElementById('element-info').textContent = data.info;
}

// Function to get the URL parameter value by name
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Event listener to call the function whenever a new element is selected
document.getElementById('element-select').addEventListener('change', (event) => {
    const selectedElement = event.target.value;
    // Update the page
    updateElementDetails(selectedElement);
    // Update the URL with the new element selection
    window.history.pushState({}, '', `?element=${selectedElement}`);
});

// Initialize the page when it loads
window.onload = function() {
    const urlElement = getUrlParameter('element') || 'hydrogen'; // Default to 'hydrogen'
    // Set the dropdown to the correct element
    document.getElementById('element-select').value = urlElement;
    // Update the page with the element from the URL
    updateElementDetails(urlElement);
};
