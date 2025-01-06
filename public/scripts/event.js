// Event Page JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    const eventContainer = document.getElementById('event-container');
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    // Function to format a date to a readable format in Eastern Time
    function formatDate(dateString) {
        const date = new Date(`${dateString}T00:00:00-05:00`); // Explicit Eastern Time
        return date.toLocaleDateString('en-US', { 
            timeZone: 'America/New_York', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Function to get today's date in YYYY-MM-DD format in Eastern Time
    function getTodayDateEastern() {
        const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Return 'YYYY-MM-DD'
    }

    async function fetchEventDetails() {
        if (!eventId) {
            eventContainer.innerHTML = `<p>Event ID is missing in the URL.</p>`;
            return;
        }

        try {
            const response = await fetch(`/.netlify/functions/event?id=${eventId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const event = await response.json();
            const today = getTodayDateEastern();

            // Direct string comparison for date in 'YYYY-MM-DD' format
            const eventDate = event.date; // Ensure this is 'YYYY-MM-DD'
            const isToday = eventDate === today;

            eventContainer.innerHTML = `
                <div class="event-details">
                    <h1>${event.title}</h1>
                    <h2>
                        <a href="/venue.html?id=${event.venueId}">${event.venue}</a>
                    </h2>
                    <p>
                        <strong>Date:</strong> 
                        ${isToday ? '<span class="today-badge">TODAY</span>' : ''} 
                        ${formatDate(event.date)}
                    </p>
                    <p><strong>Doors Open:</strong> ${event.doors}</p>
                    <p><strong>Show Starts:</strong> ${event.show}</p>
                </div>
            `;
        } catch (error) {
            console.error('Error fetching event details:', error);
            eventContainer.innerHTML = `<p>Failed to load event details. Error: ${error.message}</p>`;
        }
    }

    fetchEventDetails();
});
