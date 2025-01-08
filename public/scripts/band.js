// Extract Band ID from URL Path
function getBandId() {
    const pathParts = window.location.pathname.split('/');
    return pathParts[pathParts.length - 1]; // Get the last part of the path (band ID)
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
        document.getElementById('band-website').href = band.socialMedia?.website || '#';

        // ✅ Populate Upcoming Events
        const eventsContainer = document.getElementById('band-events');
        if (events && events.length > 0) {
            eventsContainer.innerHTML = events.map(event => `
                <div class="event-card">
                    <h3>
                        <a href="/event/${event.id}">${event.title}</a>
                    </h3>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Venue:</strong> <a href="/venue/${event.venueId}">${event.venue}</a></p>
                </div>
            `).join('');
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
