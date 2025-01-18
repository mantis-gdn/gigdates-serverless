// Function to fetch band details
async function fetchBandDetails(bandIds) {
    if (!bandIds || bandIds.length === 0) return [];

    const bandDetails = await Promise.all(bandIds.map(async (bandId) => {
        try {
            const response = await fetch(`/.netlify/functions/band?id=${bandId}`);
            if (!response.ok) {
                console.warn(`Failed to fetch details for band ID: ${bandId}, Status: ${response.status}`);
                return { id: bandId, name: `Unknown Band (${bandId})` };
            }

            const data = await response.json();
            return {
                id: bandId,
                name: data?.band?.name || `Unnamed Band (${bandId})`
            };
        } catch (error) {
            console.warn(`Error fetching band details for ${bandId}: ${error.message}`);
            return { id: bandId, name: `Error Loading Band (${bandId})` };
        }
    }));

    return bandDetails.filter(Boolean); // Remove nulls or undefined entries
}

// Extract Event ID from URL Path
function getEventId() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1]; // Get the last part of the path (event ID)
}

// Function to get today's date in Eastern Time
function getTodayDateEastern() {
    const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Function to fetch and display event details
async function fetchEventDetails() {
    const eventContainer = document.getElementById('event-container');
    const eventId = getEventId();

    if (!eventId) {
        eventContainer.innerHTML = `<p>Error: Event ID is missing in the URL.</p>`;
        document.title = 'Unknown Event - Gigdates.net';
        console.error('Error: Event ID is missing in the URL');
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/event?id=${eventId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const event = await response.json();

        // Format the date if it exists
        let formattedDate = 'No Date Provided';
        const todayDate = getTodayDateEastern(); // Get today's date in Eastern Time
        let isToday = false;

        if (event.date) {
            const date = new Date(`${event.date}T00:00:00Z`);
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/New_York',
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            formattedDate = formatter.format(date);

            // Check if the event date matches today's date
            isToday = event.date === todayDate;
        }

        // Set Dynamic Page Title
        document.title = `${event.title || 'Unnamed Event'} - Gigdates.net`;

        // Fetch and display bands
        let bandListHTML = '';
        if (event.bandIds && event.bandIds.length > 0) {
            const bands = await fetchBandDetails(event.bandIds);
            bandListHTML = `
                <p><strong>Bands Performing:</strong></p>
                <ul>
                    ${bands.map(band => `
                        <li>
                            <a href="/band/${band.id}" style="color: #4a90e2;">${band.name}</a>
                        </li>
                    `).join('')}
                </ul>
            `;
        }

        // Render Event Details
        eventContainer.innerHTML = `
            <h1>${event.title || 'Unnamed Event'}</h1>
            <h2>
                <a href="/venue/${event.venueId}" style="color: #4a90e2;">
                    ${event.venue || 'Unknown Venue'}
                </a>
            </h2>
            <p>
                <strong>Date:</strong> 
                ${isToday ? '<span class="today-badge" style="color: red; font-weight: bold;">TODAY</span>' : ''} 
                ${formattedDate}
            </p>
            <p><strong>Doors Open:</strong> ${event.doors || 'No Time Provided'}</p>
            <p><strong>Show Starts:</strong> ${event.show || 'No Time Provided'}</p>
            ${bandListHTML}
        `;

    } catch (error) {
        console.error('Error fetching event details:', error);
        eventContainer.innerHTML = `<p>Failed to load event details. Error: ${error.message}</p>`;
        document.title = 'Error Loading Event - Gigdates.net';
    }
}

// Initialize Fetch on Page Load
document.addEventListener('DOMContentLoaded', fetchEventDetails);
