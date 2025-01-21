const { events } = require('../../data/events');

// Utility function to get today's date in YYYY-MM-DD format
function getTodayDateEastern() {
    const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

exports.handler = async () => {
    try {
        const today = getTodayDateEastern();

        // Filter out past events and sort by date
        const filteredAndSortedEvents = events
            .filter(event => event.schedule?.date >= today) // Only future or today's events
            .sort((a, b) => new Date(a.schedule?.date) - new Date(b.schedule?.date)); // Sort by date ascending

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                events: filteredAndSortedEvents.map(event => ({
                    id: event.id,
                    genre: event.genre,
                    title: event.title,
                    date: event.schedule?.date || 'No Date Provided',
                    time: event.schedule?.doors || 'No Time Provided',
                    venueName: event.venue,
                    venueId: event.venueId,
                    bandIds: event.bandIds || [] // Ensure bandIds are included, defaulting to an empty array
                }))
            }),
        };
    } catch (error) {
        console.error('Error fetching events:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
