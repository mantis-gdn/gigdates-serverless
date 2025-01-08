// Extract Venue ID from URL Query String
function getVenueId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Utility function to safely set innerHTML
function safeSetInnerHTML(id, html) {
    const element = document.getElementById(id);
    if (element) {
        element.innerHTML = html;
    } else {
        console.warn(`Element with ID '${id}' not found.`);
    }
}

// Function to get today's date in YYYY-MM-DD format in Eastern Time
function getTodayDateEastern() {
    const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
        'Sunday': '#FF6347',
        'Monday': '#FFB347',
        'Tuesday': '#FFD700',
        'Wednesday': '#9ACD32',
        'Thursday': '#6495ED',
        'Friday': '#DA70D6',
        'Saturday': '#8A2BE2'
    };

    const color = dayColors[day] || '#FFFFFF';
    return `<span class="day-badge" style="background-color: ${color};">${day}</span>`;
}

// Fetch Venue Data from API
async function fetchVenueData() {
    const venueId = getVenueId();

    if (!venueId) {
        document.getElementById('venue-name').innerText = 'Venue ID is missing in the URL.';
        console.error('Error: Venue ID is missing in the URL');
        return;
    }

    try {
        console.log('Fetching venue details for ID:', venueId);
        const response = await fetch(`/.netlify/functions/venue?id=${venueId}`);

        console.log('Response Status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched Data:', data);

        if (!data.venue) {
            throw new Error('Venue data is missing in the response.');
        }

        // Update Page Title Dynamically
        document.title = `${data.venue.name} - Gigdates.net`;

        // Update Venue Details on the Page
        document.getElementById('venue-name').innerText = data.venue.name || 'Unknown Venue';
        document.getElementById('venue-address').innerText = data.venue.address || 'No Address Provided';
        document.getElementById('venue-phone').innerText = data.venue.phone || 'No Phone Provided';
        document.getElementById('venue-parking').innerText = data.venue.parking || 'Parking details unavailable';
        document.getElementById('venue-seating').innerText = data.venue.seating || 'Seating details unavailable';
        document.getElementById('venue-description').innerText = data.venue.description || 'No description available';

        document.getElementById('venue-social').innerHTML = `
            <a href="${data.venue.socialMedia?.facebook || '#'}" target="_blank">Facebook</a> | 
            <a href="${data.venue.socialMedia?.instagram || '#'}" target="_blank">Instagram</a> | 
            <a href="${data.venue.socialMedia?.website || '#'}" target="_blank">Website</a>
        `;

        // Render Upcoming Events
        const eventsContainer = document.getElementById('venue-events');
        if (eventsContainer && data.events && data.events.length > 0) {
            const today = getTodayDateEastern();

            const upcomingEvents = data.events.filter(event => event.date >= today);

            if (upcomingEvents.length > 0) {
                eventsContainer.innerHTML = upcomingEvents.map(event => {
                    const isToday = event.date === today;
                    const dayOfWeek = getDayOfWeek(event.date);
                    const dayBadge = getDayBadge(dayOfWeek);

                    // Add Band Details if Available
                    let bandListHTML = '';
                    if (event.bandIds && event.bandIds.length > 0) {
                        const bands = event.bandIds.map(bandId => `<a href="/band/?id=${bandId}">${bandId}</a>`).join(', ');
                        bandListHTML = `<p><strong>Bands:</strong> ${bands}</p>`;
                    }

                    return `
                        <div class="event-card">
                            <h3>
                                <a href="/event/?id=${event.id}">
                                    ${event.title || 'Unnamed Event'}
                                </a>
                            </h3>
                            <p>
                                <strong>Date:</strong> 
                                ${isToday ? '<span class="today-badge">TODAY</span>' : ''} 
                                ${dayBadge}
                                ${formatDate(event.date)}
                            </p>
                            <p><strong>Time:</strong> ${event.time || 'No Time Provided'}</p>
                            ${bandListHTML}
                        </div>
                    `;
                }).join('');
            } else {
                eventsContainer.innerHTML = '<p>No upcoming events available for this venue.</p>';
            }
        } else if (eventsContainer) {
            eventsContainer.innerHTML = '<p>No events available for this venue.</p>';
        }

    } catch (error) {
        console.error('Error fetching venue data:', error.message);
        document.getElementById('venue-name').innerText = 'Error fetching venue details.';
    }
}

// Initialize Fetch on Page Load
document.addEventListener('DOMContentLoaded', fetchVenueData);
