// Fetch and Display Upcoming Events Only
async function fetchAllEvents() {
    const eventsContainer = document.getElementById('events-container');

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

// Function to fetch band details
async function fetchBandDetails(bandIds) {
    if (!bandIds || bandIds.length === 0) return [];
    
    console.log('Fetching bands:', bandIds); // Debug log

    const bandDetails = await Promise.all(bandIds.map(async (bandId) => {
        try {
            const response = await fetch(`/.netlify/functions/band?id=${bandId}`);
            console.log(`Response for ${bandId}:`, response);

            if (!response.ok) {
                console.warn(`Failed to fetch details for band ID: ${bandId}, Status: ${response.status}`);
                return { id: bandId, name: `Unknown Band (${bandId})` };
            }

            const data = await response.json();
            console.log(`Data for ${bandId}:`, data);

            return {
                id: bandId,
                name: data?.band?.name || `Unnamed Band (${bandId})`
            };
        } catch (error) {
            console.warn(`Error fetching band details for ${bandId}: ${error.message}`);
            return { id: bandId, name: `Error Loading Band (${bandId})` };
        }
    }));

    console.log('Final band details:', bandDetails); // Debug log

    return bandDetails.filter(Boolean); // Remove nulls or undefined entries
}


    try {
        const response = await fetch('/.netlify/functions/events');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const today = getTodayDateEastern();

        if (data.events && data.events.length > 0) {
            const upcomingEvents = data.events.filter(event => event.date >= today);

            if (upcomingEvents.length > 0) {
                eventsContainer.innerHTML = await Promise.all(upcomingEvents.map(async (event) => {
                    const isToday = event.date === today;
                    const dayOfWeek = getDayOfWeek(event.date);
                    const dayBadge = getDayBadge(dayOfWeek);

                    // Fetch band details if bandIds exist
                    let bandListHTML = '';
                    if (event.bandIds && event.bandIds.length > 0) {
                        const bands = await fetchBandDetails(event.bandIds);
                        bandListHTML = `
                        <p><strong>Bands:</strong> 
                            ${bands.map(band => `<a href="/band/?id=${band.id}" style="color: #4a90e2;">${band.name}</a>`).join(', ')}
                        </p>
                    `;
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
                                ${formatDate(event.date) || 'No Date Provided'}
                            </p>
                            <p><strong>Time:</strong> ${event.time || 'No Time Provided'}</p>
                            <p><strong>Venue:</strong> 
                                <a href="/venue/?id=${event.venueId}">
                                    ${event.venueName || 'Unknown Venue'}
                                </a>
                            </p>
                            ${bandListHTML}
                        </div>
                    `;
                })).then(eventCards => eventCards.join(''));
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
