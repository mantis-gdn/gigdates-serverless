// venue.js

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
    return `${year}-${month}-${day}`; // Return 'YYYY-MM-DD'
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

        // Update Venue Details
        document.getElementById('venue-name').innerText = data.venue.name || 'Unknown Venue';
        document.getElementById('venue-address').innerText = data.venue.address || 'No Address Provided';
        document.getElementById('venue-phone').innerText = data.venue.phone || 'No Phone Provided';
        document.getElementById('venue-parking').innerText = data.venue.parking || 'Parking details unavailable';
        document.getElementById('venue-seating').innerText = data.venue.seating || 'Seating details unavailable';
        document.getElementById('venue-description').innerText = data.venue.description || 'No description available';

        document.getElementById('venue-social').innerHTML = `
            <a href="${data.venue.socialMedia?.facebook || '#'}" target="_blank">Facebook</a> | 
            <a href="${data.venue.socialMedia?.instagram || '#'}" target="_blank">Instagram</a>
        `;

        // Render Events
        const eventsContainer = document.getElementById('venue-events');
        if (eventsContainer && data.events && data.events.length > 0) {
            const today = getTodayDateEastern();

            eventsContainer.innerHTML = data.events.map(event => {
                const isToday = event.date === today; // Compare event date with today's date
                return `
                    <div class="event-card">
                        <h3>
                            <a href="/event.html?id=${event.id}" style="color: #4a90e2;">
                                ${event.title || 'Unnamed Event'}
                            </a>
                        </h3>
                        <p>
                            <strong>Date:</strong> 
                            ${isToday ? '<span class="today-badge">TODAY</span>' : ''} 
                            ${event.date || 'No Date Provided'}
                        </p>
                        <p><strong>Time:</strong> ${event.time || 'No Time Provided'}</p>
                    </div>
                `;
            }).join('');
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
