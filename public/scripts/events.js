// Fetch and Display Upcoming Events Only
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

    // Function to get the day of the week from a date
    function getDayOfWeek(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long' });
    }

    // Function to assign colors to each day of the week
    function getDayBadge(day) {
        const dayColors = {
            'Sunday': '#FF6347',    // Tomato Red
            'Monday': '#FFB347',    // Orange
            'Tuesday': '#FFD700',   // Gold
            'Wednesday': '#9ACD32', // Yellow-Green
            'Thursday': '#6495ED',  // Cornflower Blue
            'Friday': '#DA70D6',    // Orchid
            'Saturday': '#8A2BE2'   // Blue Violet
        };

        const color = dayColors[day] || '#FFFFFF'; // Fallback to white
        return `<span class="day-badge" style="background-color: ${color};">${day}</span>`;
    }

    try {
        const response = await fetch('/.netlify/functions/events');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const today = getTodayDateEastern();

        if (data.events && data.events.length > 0) {
            // Filter only events from today forward
            const upcomingEvents = data.events.filter(event => event.date >= today);

            if (upcomingEvents.length > 0) {
                eventsContainer.innerHTML = upcomingEvents.map(event => {
                    const isToday = event.date === today; // Compare event date with today's date
                    const dayOfWeek = getDayOfWeek(event.date); // Get the day of the week
                    const dayBadge = getDayBadge(dayOfWeek); // Get the day badge

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
                                ${dayBadge} 
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
                eventsContainer.innerHTML = '<p>No upcoming events available.</p>';
            }
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
