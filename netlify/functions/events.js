const { events } = require('../../data/events');

exports.handler = async () => {
    try {
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                events: events.map(event => ({
                    id: event.id,
                    title: event.title,
                    date: event.schedule?.date || 'No Date Provided',
                    time: event.schedule?.show || 'No Time Provided',
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
