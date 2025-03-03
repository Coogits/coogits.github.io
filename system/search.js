 
/* 
jsonData syntax:
{
  "pages": [
    {
      "url": "/Content/About/",
      "title": "About"
    },
    {
      "url": "/Content/index/",
      "title": "Home"
    }
  ]
}
*/

// Variable to hold the JSON data
let jsonData = {};

// Load the JSON data from the file when the page loads
window.onload = function() {
    fetch('/system/search.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data; // Store the JSON data into the variable
        })
        .catch(error => {
            console.error("Error loading the JSON file:", error);
        });
};

// Function to search through the JSON data and display the results
function searchContent() {
    // Get the search query entered by the user
    const query = document.getElementById('searchQuery').value.toLowerCase();

    // Get the element to display the results
    const resultsContainer = document.getElementById('searchResults');

    // Clear any previous results
    resultsContainer.innerHTML = '';

    // If the query is not empty, perform the search
    if (query) {
        // Filter the pages based on the title matching the query
        const results = jsonData.pages.filter(page => 
            page.title.toLowerCase().includes(query)
        );

        // Display the matching results
        if (results.length > 0) {
            results.forEach(result => {
                // Create a new list item for each result
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${result.url}">${result.title}</a>`;
                resultsContainer.appendChild(listItem);
            });
            resultsContainer.style.display = 'block';  // Show the results
        } else {
            // Display a message if no results were found
            resultsContainer.innerHTML = '<li>No results found</li>';
            resultsContainer.style.display = 'block';  // Show the "no results" message
        }
    } else {
        resultsContainer.style.display = 'none';  // Hide results if the query is empty
    }

    // Position the results container below the search input dynamically
    positionResultsContainer();
}

// Function to position the results container dynamically
function positionResultsContainer() {
    const searchInput = document.getElementById('searchQuery');
    const resultsContainer = document.getElementById('searchResults');
    
    const rect = searchInput.getBoundingClientRect();  // Get the position of the input field
    const inputBottom = rect.bottom + window.scrollY; // Get the bottom position of the input

    // Set the position of the results container
    resultsContainer.style.top = `${inputBottom}px`;  // Position below the input field
    resultsContainer.style.left = `${rect.left + window.scrollX}px`;  // Align with the input field horizontally
}

// Add event listener to trigger searchContent when typing
document.getElementById('searchQuery').addEventListener('input', searchContent);
