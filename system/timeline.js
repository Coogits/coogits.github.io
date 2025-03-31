

// Ensure the timeline container exists before initializing
document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById('timeline-container');
    if (!container) {
        return; // Stop execution if the container doesn't exist
    }
    // Constants
    const MIN_YEAR = -271821;
    const YEAR_ZERO_OFFSET = 100000;

    // Function to convert BCE years correctly
    function convertBCE(year) {
        year = Math.max(MIN_YEAR, year);
        if (isNaN(year)) {
            console.error("Invalid year:", year);
            return null;
        }
        let adjustedYear = year + YEAR_ZERO_OFFSET;
        return new Date(Date.UTC(adjustedYear, 0, 1)).getTime();
    }

    // Custom function to format years
    function formatYear(year) {
        let actualYear = year - YEAR_ZERO_OFFSET + 1;
        return actualYear < 0 ? `${Math.abs(actualYear)} BCE` : `${actualYear} CE`;
    }

    let erasData = {};
    let groups = new vis.DataSet([
        { id: "era-0", content: "Eras" },
        { id: "era-1", content: "Ages" },
        { id: "era-2", content: "Periods" },
        { id: "Ancient Egypt", content: "Egypt" },
        { id: "Ancient Rome", content: "Rome" },
        { id: "Greece", content: "Greece" },
        { id: "Mesopotamia", content: "Mesopotamia" },
        { id: "people", content: "Peoples" },
        { id: "event", content: "Events" }
    ]);

    let items = new vis.DataSet();
    let timeline;

    fetch('/system/history.json')
        .then(response => response.json())
        .then(data => {
            data.history.forEach(entry => {
                items.add({
                    id: entry.id,
                    content: `<a href="${entry.url}">${entry.title}</a>`,
                    start: convertBCE(entry.start),
                    end: convertBCE(entry.end),
                    group: entry.group
                });
            });

            erasData = data.eras;

            const in_startYear = parseInt(container.getAttribute('data-start')) || -6000;
            const in_endYear = parseInt(container.getAttribute('data-end')) || 2025;
            const percent = Math.abs(in_endYear - in_startYear) * 0.02;
            const startYear = in_startYear - percent;
            const endYear = in_endYear + percent;

            var options = {
                stack: true,
                margin: { item: { horizontal: -1, vertical: 5 }, axis: 5 },
                showMajorLabels: true,
                showCurrentTime: false,
                zoomMin: 1000 * 60 * 60 * 24 * 365 * 1,
                zoomMax: 1000 * 60 * 60 * 24 * 365 * 100000,
                start: convertBCE(startYear),
                end: convertBCE(endYear),
                timeAxis: {
                    scale: 'year',
                    step: 100
                },
                format: {
                    minorLabels: date => formatYear(new Date(date).getUTCFullYear()),
                    majorLabels: date => formatYear(new Date(date).getUTCFullYear())
                },
            };

            timeline = new vis.Timeline(container, items, groups, options);
            timeline.on('rangechanged', updateTimelineLabels);
        })
        .catch(error => console.error('Error loading JSON:', error));

    function updateTimelineLabels() {
        var visibleStart = timeline.getWindow().start.getFullYear();
        var visibleEnd = timeline.getWindow().end.getFullYear();
        var range = visibleEnd - visibleStart;

        var newStep;
        if (range < 10) {
            newStep = 1;
        } else if (range < 50) {
            newStep = 5;
        } else if (range < 100) {
            newStep = 10;
        } else if (range < 200) {
            newStep = 50;
        } else if (range < 1000) {
            newStep = 100;
        } else if (range < 3000) {
            newStep = 500;
        } else if (range < 10000) {
            newStep = 1000;
        } else {
            newStep = 5000;
        }
        timeline.setOptions({
            timeAxis: { scale: 'year', step: newStep }
        });
    }

    // Dynamically create and append the toggle button to the timeline container
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleEgypt';
    toggleButton.textContent = 'Toggle Ancient Egypt';
    toggleButton.addEventListener('click', function () {
        toggleGroup('Ancient Egypt');
    });

    // Append the button to the timeline container
    container.appendChild(toggleButton);
    let hiddenGroups = {};  // Store hidden groups' ids and their previous positions
    // Toggle visibility of a group
    let groupPositions = {}; // Store the original order and position of groups
    // Toggle visibility of a group
    function toggleGroup(groupId) {
        const currentPosition = timeline.getWindow();  // Store current visible range
        // Check if the group is already hidden
        if (hiddenGroups[groupId]) {
            // Unhide the group and restore the previous position
            let groupsArray = groups.get();
            // Find the original position of the group (stored in groupPositions)
            const originalIndex = groupPositions[groupId];
            // Add the hidden group back to the exact position it was in
            const hiddenGroup = { id: groupId, content: groupId };  // Adjust the content if needed
            groupsArray.splice(originalIndex, 0, hiddenGroup); // Insert the group back at its original index
            groups.clear();
            groups.add(groupsArray);
            // Restore the timeline's previous position
            const previousPosition = hiddenGroups[groupId];
            timeline.setWindow(previousPosition.start, previousPosition.end);
            // Remove from the hidden groups list
            delete hiddenGroups[groupId];
        } else {
            // Hide the group and store the current position
            hiddenGroups[groupId] = currentPosition;
            // Store the original position of the group
            let groupsArray = groups.get();
            const groupIndex = groupsArray.findIndex(group => group.id === groupId);
            groupPositions[groupId] = groupIndex; // Store the group’s original position
            // Remove the group from the dataset
            groupsArray = groupsArray.filter(group => group.id !== groupId); // Remove hidden group
            groups.clear();
            groups.add(groupsArray);
            // Optionally update timeline position
            timeline.setWindow(currentPosition.start, currentPosition.end);
        }
    }

});


