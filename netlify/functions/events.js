const { venues } = require('../../data/venues');
const { events } = require('../../data/events');

exports.handler = async () => {
    try {
        // Map events and attach their respective venue names
        const enrichedEvents = events.map(event => {
            const venue = venues.find(v => v.id === event.venueId);
            return {
                id: event.id,
                title: event.title || 'Unnamed Event',
                date: event.schedule?.date || 'No Date Provided',
                time: event.schedule?.show || 'No Time Provided',
                venueName: venue?.name || 'Unknown Venue',
                venueId: event.venueId || 'Unknown Venue ID'
            };
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ events: enrichedEvents }),
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
