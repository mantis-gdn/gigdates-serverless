const { events } = require('../../data/events');

exports.handler = async (event) => {
    try {
        // Extract the event ID from query parameters
        const eventId = event.queryStringParameters?.id;

        if (!eventId) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: 'Event ID is required' }),
            };
        }

        // Find the event by ID
        const eventDetails = events.find(e => String(e.id) === eventId);

        if (!eventDetails) {
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: 'Event not found' }),
            };
        }

        // Return event details
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: eventDetails.title,
                date: eventDetails.schedule?.date || 'No Date Provided',
                doors: eventDetails.schedule?.doors || 'No Time Provided',
                show: eventDetails.schedule?.show || 'No Time Provided',
                venue: eventDetails.venue || 'Unknown Venue',
                venueId: eventDetails.venueId || 'Unknown Venue ID'
            }),
        };
    } catch (error) {
        console.error('Error fetching event data:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
