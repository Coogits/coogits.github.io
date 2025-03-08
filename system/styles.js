
function navbar_hamburger() {
    var contents_menu = document.getElementById("navbar-contents");
    var navbar = document.querySelector(".navbar")
    var hamburger_icon = document.querySelector(".hamburger-icon");

    // Toggle visibility of the dropdown menu
    contents_menu.classList.toggle("show");

    // Close the menu when clicking outside
    document.addEventListener("click", function closeMenuOnClickOutside(event) {
        if (!contents_menu.contains(event.target) && !hamburger_icon.contains(event.target)) {
            contents_menu.classList.remove("show");
            contents_menu.removeEventListener("click", closeMenuOnClickOutside);  // Remove the event listener after it has run
        }
    });
}

function toggleTOC() {
    var toc = document.getElementById("table-of-contents");
    var tocToggle = document.querySelector(".toc-toggle");

    toc.classList.toggle("show");

    // Position the TOC when it's shown
    if (toc.classList.contains("show")) {
        var tocRect = tocToggle.getBoundingClientRect();
        toc.style.top = (tocRect.bottom + window.scrollY) + 'px';  // Position it below the icon
        toc.style.left = (tocRect.left + window.scrollX) + 'px';   // Align it with the left of the icon

        // Close the menu when clicking outside
        function closeMenuOnClickOutside(event) {
            if (!toc.contains(event.target) && !tocToggle.contains(event.target)) {
                toc.classList.remove("show");
                document.removeEventListener("click", closeMenuOnClickOutside);  // Remove listener after closing the menu
            }
        }

        // Add event listener to close when clicking outside
        document.addEventListener("click", closeMenuOnClickOutside);

        // Hide the TOC when clicking directly on it
        toc.addEventListener("click", function () {
            toc.classList.remove("show");
            document.removeEventListener("click", closeMenuOnClickOutside);  // Remove the outside click listener when TOC is clicked
        });
    } else {
        // If TOC is hidden, remove the event listener for closing on outside click
        document.removeEventListener("click", closeMenuOnClickOutside);
    }
}

// Function to bind click events
function collapsible() {
    // Add a click event listener to both <h3> and <h4> elements inside .header-block containers
    document.querySelectorAll('.header-button').forEach(function (header) {
        header.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default behavior (important for <button> elements)

            // Get the parent block of the clicked header/button
            var block = header.closest('.header-block');  // Look for any .header-block parent
            
            // Toggle the 'open' class on the parent block to show or hide the content
            block.classList.toggle('toggle');
        });
    });
}



// Call collapsible() when the DOM is ready
document.addEventListener('DOMContentLoaded', collapsible);

