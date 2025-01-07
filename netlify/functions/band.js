const { bands } = require('../../data/bands');
const { events } = require('../../data/events');

exports.handler = async (event) => {
    try {
        // Extract Band ID from query parameters
        const bandId = event.queryStringParameters?.id;

        if (!bandId) {
            console.error('Band ID missing from query parameters');
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: 'Band ID is required' }),
            };
        }

        // Find Band by ID
        const band = bands.find(b => b.id === bandId);

        if (!band) {
            console.error(`Band not found for ID: ${bandId}`);
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: 'Band not found' }),
            };
        }

        // Find Events associated with the Band
        const bandEvents = events
            .filter(event => event.bandIds && event.bandIds.includes(bandId))
            .map(event => ({
                id: event.id,
                title: event.title || 'Unnamed Event',
                date: event.schedule?.date || 'No Date Provided',
                time: event.schedule?.show || 'No Time Provided',
                venue: event.venue || 'Unknown Venue',
                venueId: event.venueId || null,
            }));

        console.log('Band Data:', band);
        console.log('Band Events:', bandEvents);

        // Return Band Details and Events
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                band: {
                    id: band.id,
                    name: band.name,
                    genre: band.genre || 'No Genre Provided',
                    description: band.description || 'No description available',
                    socialMedia: {
                        facebook: band.socialMedia?.facebook || '#',
                        instagram: band.socialMedia?.instagram || '#',
                        website: band.socialMedia?.website || '#',
                    },
                    members: band.members || [] // Ensure members are included in the response
                },
                events: bandEvents
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
