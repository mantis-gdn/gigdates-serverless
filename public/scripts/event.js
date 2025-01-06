// Event Page JavaScript
document.addEventListener('DOMContentLoaded', async () => {
    const eventContainer = document.getElementById('event-container');
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

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

            eventContainer.innerHTML = `
                <div class="event-details">
                    <h1>${event.title}</h1>
                    <h2><a href="/venue.html?id=${event.venueId}">${event.venue}</a></h2>
                    <p><strong>Date:</strong> ${event.date}</p>
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
