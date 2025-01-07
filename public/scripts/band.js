// Fetch Band Details and Events
async function fetchBandData() {
    const urlParams = new URLSearchParams(window.location.search);
    const bandId = urlParams.get('id');

    if (!bandId) {
        document.getElementById('band-name').innerText = 'Band ID is missing.';
        return;
    }

    try {
        const response = await fetch(`/.netlify/functions/band?id=${bandId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const band = data.band;
        const events = data.events;

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
                        <a href="/event.html?id=${event.id}">${event.title}</a>
                    </h3>
                    <p><strong>Date:</strong> ${event.date}</p>
                    <p><strong>Time:</strong> ${event.time}</p>
                    <p><strong>Venue:</strong> <a href="/venue.html?id=${event.venueId}">${event.venue}</a></p>
                </div>
            `).join('');
        } else {
            eventsContainer.innerHTML = '<p>No upcoming events available for this band.</p>';
        }

    } catch (error) {
        console.error('Error fetching band data:', error);
        document.getElementById('band-name').innerText = 'Error loading band details.';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', fetchBandData);
