
function navbar_hamburger() {
    var contents_menu = document.getElementById("navbar-contents");
    var navbar = document.querySelector(".navbar")
    var hamburger_icon = document.querySelector(".hamburger-icon");

    // Toggle visibility of the dropdown menu
    contents_menu.classList.toggle("show");

    // Calculate and position the dropdown menu below the hamburger icon
    if (contents_menu.classList.contains("show")) {
        var iconRect = navbar.getBoundingClientRect();  // Get position of the hamburger icon
        
        // Set the dropdown position dynamically
        contents_menu.style.top = (iconRect.bottom + window.scrollY) + 'px';  // Position it below the icon
        contents_menu.style.left = (iconRect.left + window.scrollX) + 'px';  // Align it with the left of the icon

        // Close the menu when clicking outside
        document.addEventListener("click", function closeMenuOnClickOutside(event) {
            if (!contents_menu.contains(event.target) && !hamburger_icon.contains(event.target)) {
                contents_menu.classList.remove("show");
                contents_menu.removeEventListener("click", closeMenuOnClickOutside);  // Remove the event listener after it has run
            }
        });
    }
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
        toc.addEventListener("click", function() {
            toc.classList.remove("show");
            document.removeEventListener("click", closeMenuOnClickOutside);  // Remove the outside click listener when TOC is clicked
        });
    } else {
        // If TOC is hidden, remove the event listener for closing on outside click
        document.removeEventListener("click", closeMenuOnClickOutside);
    }
}


  
