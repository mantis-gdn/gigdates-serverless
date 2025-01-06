// Fetch and Display All Events
async function fetchAllEvents() {
    const eventsContainer = document.getElementById('events-container');

    // Function to get today's date in YYYY-MM-DD format in Eastern Time
    function getTodayDateEastern() {
        const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // Return 'YYYY-MM-DD'
    }

    // Function to format a date into a readable format
    function formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    try {
        const response = await fetch('/.netlify/functions/events');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const today = getTodayDateEastern();

        if (data.events && data.events.length > 0) {
            eventsContainer.innerHTML = data.events.map(event => {
                const isToday = event.date === today; // Compare event date with today's date

                return `
                    <div class="event-card">
                        <h3>
                            <a href="/event.html?id=${event.id}">
                                ${event.title || 'Unnamed Event'}
                            </a>
                        </h3>
                        <p>
                            <strong>Date:</strong> 
                            ${isToday ? '<span class="today-badge">TODAY</span>' : ''} 
                            ${formatDate(event.date) || 'No Date Provided'}
                        </p>
                        <p><strong>Time:</strong> ${event.time || 'No Time Provided'}</p>
                        <p><strong>Venue:</strong> 
                            <a href="/venue.html?id=${event.venueId}">
                                ${event.venueName || 'Unknown Venue'}
                            </a>
                        </p>
                    </div>
                `;
            }).join('');
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
