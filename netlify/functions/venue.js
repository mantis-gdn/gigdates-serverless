const { venues } = require('../../data/venues');
const { events } = require('../../data/events');

exports.handler = async (event) => {
    try {
        const venueId = event.queryStringParameters?.id;

        if (!venueId) {
            console.error('Venue ID missing from query parameters');
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: 'Venue ID is required' }),
            };
        }

        const venue = venues.find(v => v.id === venueId);

        if (!venue) {
            console.error(`Venue not found for ID: ${venueId}`);
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: 'Venue not found' }),
            };
        }

        const venueEvents = events
            .filter(event => event.venueId === venueId)
            .map(event => ({
                id: event.id,
                title: event.title || 'Unnamed Event',
                date: event.schedule?.date || 'No Date Provided',
                time: event.schedule?.show || 'No Time Provided',
            }));

        console.log('Venue Data:', venue);
        console.log('Venue Events:', venueEvents);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                venue: {
                    id: venue.id,
                    name: venue.name,
                    address: venue.address || 'No Address Provided',
                    phone: venue.phone || 'No Phone Provided',
                    website: venue.website || '#',
                    eventsLink: venue.eventsLink || '#',
                    seating: venue.seating || 'Seating details unavailable',
                    parking: venue.parking || 'Parking details unavailable',
                    description: venue.description || 'No description available',
                    socialMedia: {
                        facebook: venue.socialMedia?.facebook || '#',
                        instagram: venue.socialMedia?.instagram || '#',
                    }
                },
                events: venueEvents
            }),
        };
    } catch (error) {
        console.error('Server Error:', error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
