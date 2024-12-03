// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    loadActivityLog();  // Load activity logs dynamically
    enableActionButtons();  // Enable action buttons with feedback
});

// Function to load activity logs from the server-side data (passed from Flask)
function loadActivityLog() {
    // Fetch the activity log data that is passed by Flask via Jinja
    const activityLogs = {{ activity_logs | tojson }};  // Flask automatically converts this to JSON

    // Find the container where activity logs will be displayed
    const logContainer = document.getElementById("activity-log");

    // Loop through each log and create list items to append to the container
    activityLogs.forEach(log => {
        const logItem = document.createElement("li");

        // Format and populate the log item
        logItem.innerHTML = `
            <span>${log.user}</span>
            <span>${log.action}</span>
            <span>${log.timestamp}</span>
        `;

        // Append the log item to the container
        logContainer.appendChild(logItem);
    });
}

// Function to enable action buttons with click feedback
function enableActionButtons() {
    const actionButtons = document.querySelectorAll(".action-btn");
    
    actionButtons.forEach(button => {
        button.addEventListener("click", () => {
            alert(`You clicked: ${button.textContent}`);
        });
    });
}
