const { bands } = require('../../data/bands');
const { events } = require('../../data/events');

// Fetch band details and associated events
exports.handler = async (event) => {
    try {
        const bandId = event.queryStringParameters?.id;

        if (!bandId) {
            console.error('Band ID missing from query parameters');
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: 'Band ID is required' }),
            };
        }

        const band = bands.find(b => b.id === bandId);

        if (!band) {
            console.error(`Band not found for ID: ${bandId}`);
            return {
                statusCode: 404,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: 'Band not found' }),
            };
        }

        const bandEvents = events
            .filter(event => event.bandIds && event.bandIds.includes(bandId))
            .map(event => ({
                id: event.id,
                title: event.title || 'Unnamed Event',
                date: event.schedule?.date || 'No Date Provided',
                time: event.schedule?.show || 'No Time Provided',
                venue: event.venue || 'Unknown Venue',
                venueId: event.venueId || null,
                bandIds: event.bandIds || []
            }));

        // Fetch band names for each event
        const eventsWithBands = bandEvents.map(event => {
            const eventBands = event.bandIds.map(bandId => {
                const foundBand = bands.find(b => b.id === bandId);
                return foundBand ? foundBand.name : `Unknown Band (${bandId})`;
            });
            return { ...event, bands: eventBands };
        });

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
                    members: band.members || []
                },
                events: eventsWithBands
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
