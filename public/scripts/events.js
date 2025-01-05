// Fetch and Display All Events
async function fetchAllEvents() {
    const eventsContainer = document.getElementById('events-container');

    try {
        const response = await fetch('/.netlify/functions/events');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.events && data.events.length > 0) {
            eventsContainer.innerHTML = data.events.map(event => `
                <div class="event-card">
                    <h3>
                        <a href="/event.html?id=${event.id}">
                            ${event.title || 'Unnamed Event'}
                        </a>
                    </h3>
                    <p><strong>Date:</strong> ${event.date || 'No Date Provided'}</p>
                    <p><strong>Time:</strong> ${event.time || 'No Time Provided'}</p>
                    <p><strong>Venue:</strong> 
                        <a href="/venue.html?id=${event.venueId}">
                            ${event.venueName || 'Unknown Venue'}
                        </a>
                    </p>
                </div>
            `).join('');
        } else {
            eventsContainer.innerHTML = '<p>No events are currently available.</p>';
        }

    } catch (error) {
        console.error('Error fetching events:', error);
        eventsContainer.innerHTML = `<p>Failed to load events. Error: ${error.message}</p>`;
    }
}

// Initialize Fetch on Page Load
document.addEventListener('DOMContentLoaded', fetchAllEvents);
