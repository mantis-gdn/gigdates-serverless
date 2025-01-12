// Extract Band ID from URL Path
function getBandId() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1]; // Get the last part of the path (band ID)
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to get the day of the week
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

// Function to get today's date in YYYY-MM-DD format
function getTodayDateEastern() {
    const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Fetch Band Details for Event Cards
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

    return bandDetails.filter(Boolean);
}

// Fetch Band Details and Events
async function fetchBandData() {
    const bandId = getBandId();

    if (!bandId) {
        document.getElementById('band-name').innerText = 'Band ID is missing.';
        document.title = 'Unknown Band - Gigdates.net';
        console.error('Error: Band ID is missing in the URL');
        return;
    }

    try {
        console.log('Fetching band details for ID:', bandId);
        const response = await fetch(`/.netlify/functions/band?id=${bandId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const band = data.band;
        const events = data.events;

        console.log('Fetched Band Data:', band);
        console.log('Fetched Band Events:', events);

        // ✅ Set Dynamic Page Title
        document.title = `${band.name || 'Unnamed Band'} - Gigdates.net`;

        // ✅ Populate Band Details
        document.getElementById('band-name').innerText = band.name || 'No Name Provided';
        document.getElementById('band-genre').innerText = band.genre || 'No Genre Provided';
        document.getElementById('band-description').innerText = band.description || 'No Description Provided';
        console.log(band.website);

        // ✅ Populate Band Members
        const membersList = document.getElementById('band-members-list');
        if (band.members && Array.isArray(band.members) && band.members.length > 0) {
            membersList.innerHTML = band.members.map(member => `
                <li>
                    <strong>${member.name}</strong> - ${member.role}
                </li>
            `).join('');
        } else {
            membersList.innerHTML = '<li>No members listed.</li>';
        }

        // ✅ Populate Social Media Links
        document.getElementById('band-facebook').href = band.socialMedia?.facebook || '#';
        document.getElementById('band-instagram').href = band.socialMedia?.instagram || '#';
        document.getElementById('band-website').href = band.website || '#';

        // ✅ Populate Upcoming Events
        const eventsContainer = document.getElementById('band-events');
        if (events && events.length > 0) {
            const today = getTodayDateEastern();

            eventsContainer.innerHTML = await Promise.all(events.map(async (event) => {
                const isToday = event.date === today;
                const dayOfWeek = getDayOfWeek(event.date);
                const dayBadge = getDayBadge(dayOfWeek);

                // Fetch band details if bandIds exist
                let bandListHTML = '';
                if (event.bandIds && event.bandIds.length > 0) {
                    const bands = await fetchBandDetails(event.bandIds);
                    bandListHTML = `
                        <p><strong>Bands:</strong> 
                            ${bands.map(band => `<a href="/band/${band.id}" style="color: #4a90e2;">${band.name}</a>`).join(', ')}
                        </p>
                    `;
                }

                return `
                    <div class="event-card">
                        <h3>
                            <a href="/event/${event.id}">${event.title}</a>
                        </h3>
                        <p>
                            <strong>Date:</strong> 
                            ${isToday ? '<span class="today-badge">TODAY</span>' : ''} 
                            ${dayBadge}
                            ${formatDate(event.date)}
                        </p>
                        <p><strong>Time:</strong> ${event.time || 'No Time Provided'}</p>
                           <p><strong>Venue:</strong> 
                                <a href="/venue/${event.venueId}">
                                    ${event.venue || 'Unknown Venue'}
                                </a>
                            </p>
                        ${bandListHTML}
                    </div>
                `;
            })).then(eventCards => eventCards.join(''));
        } else {
            eventsContainer.innerHTML = '<p>No upcoming events available for this band.</p>';
        }

    } catch (error) {
        console.error('Error fetching band data:', error);
        document.getElementById('band-name').innerText = 'Error loading band details.';
        document.title = 'Error Loading Band - Gigdates.net';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', fetchBandData);
