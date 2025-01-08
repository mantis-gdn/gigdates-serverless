// Function to fetch band details
async function fetchBandDetails(bandIds) {
    if (!bandIds || bandIds.length === 0) return [];

    console.log('Fetching bands:', bandIds);

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

    console.log('Final band details:', bandDetails);
    return bandDetails.filter(Boolean); // Remove nulls or undefined entries
}

// Function to fetch and display event details
async function fetchEventDetails() {
    const eventContainer = document.getElementById('event-container');
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    if (!eventId) {
        eventContainer.innerHTML = `<p>Error: Event ID is missing in the URL.</p>`;
        document.title = 'Unknown Event - Gigdates.net';
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/event?id=${eventId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const event = await response.json();
        console.log('Fetched Event:', event);

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
                            <a href="/band/?id=${band.id}" style="color: #4a90e2;">${band.name}</a>
                        </li>
                    `).join('')}
                </ul>
            `;
        }

        // Render Event Details
        eventContainer.innerHTML = `
            <h1>${event.title || 'Unnamed Event'}</h1>
            <h2>
                <a href="/venue/?id=${event.venueId}" style="color: #4a90e2;">
                    ${event.venue || 'Unknown Venue'}
                </a>
            </h2>
            <p><strong>Date:</strong> ${event.date || 'No Date Provided'}</p>
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
