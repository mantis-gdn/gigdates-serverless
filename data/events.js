const events = [ 
    {
        id: 1,
        title: "Brothers All Band – An Allman Brothers Experience",
        schedule: { date: "2024-12-28", doors: "7:00 PM", show: "8:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 2,
        title: "New Year's Eve with Bearly Dead",
        schedule: { date: "2024-12-31", doors: "8:00 PM", show: "9:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 3,
        title: "School of Rock Seekonk presents FALL END OF SEASON",
        schedule: { date: "2025-01-05", doors: "10:30 AM", show: "11:00 AM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 4,
        title: "The DMB Project – Dave Matthews Tribute – Dave’s Birthday Bash",
        schedule: { date: "2025-01-11", doors: "8:00 PM", show: "9:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI",
        bandIds: ["dmb_project"]
    },
    {
        id: 5,
        title: "School of Rock Attleboro Presents: Fall Seasonal Show 1",
        schedule: { date: "2025-01-12", doors: "1:30 PM", show: "2:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 6,
        title: "Tom DiMenna & Friends Present STORY SONGS OF THE 70s",
        schedule: { date: "2025-01-16", doors: "7:00 PM", show: "8:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 7,
        title: "Wolfman Jack with Support: Chop",
        schedule: { date: "2025-01-17", doors: "7:00 PM", show: "8:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI",
        bandIds: ["wolfman_jack"]
    },
    {
        id: 8,
        title: "Ballznight Live: Korn Ballz, Limp Ballz, Beastie Ballz",
        schedule: { date: "2025-01-18", doors: "7:30 PM", show: "8:30 PM" },
        venueId: "met_ri",
        venue: "The Met RI",
        bandIds: ["korn_ballz", "limp_ballz", "beastie_ballz"]
    },
    {
        id: 9,
        title: "School of Rock Attleboro Presents: Fall Seasonal Show 2",
        schedule: { date: "2025-01-19", doors: "1:30 PM", show: "2:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 10,
        title: "Max Creek Creekend – Night 1",
        schedule: { date: "2025-01-24", doors: "8:00 PM", show: "9:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 11,
        title: "Max Creek Creekend – Night 2",
        schedule: { date: "2025-01-25", doors: "8:00 PM", show: "9:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 12,
        title: "Dead Meat – An Electrifying Tribute to The Grateful Dead",
        schedule: { date: "2025-02-01", doors: "7:30 PM", show: "8:30 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 13,
        title: "The 15th Annual NE Winter Blues Festival",
        schedule: { date: "2025-02-02", doors: "4:00 PM", show: "5:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 14,
        title: "Joey Harkum & Special Guests",
        schedule: { date: "2025-02-07", doors: "7:00 PM", show: "8:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 15,
        title: "Opiate Performing Tool with Alice playing Alice In Chains",
        schedule: { date: "2025-02-08", doors: "8:00 PM", show: "9:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 16,
        title: "Neighbor Live Performance",
        schedule: { date: "2025-02-22", doors: "8:00 PM", show: "9:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 17,
        title: "The Warped Tour Band – Emo/Pop-Punk Tribute",
        schedule: { date: "2025-03-01", doors: "7:00 PM", show: "8:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 18,
        title: "Eggy: Here & How Tour",
        schedule: { date: "2025-03-20", doors: "8:00 PM", show: "9:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 19,
        title: "Tyler Hilton Live Performance",
        schedule: { date: "2025-03-27", doors: "7:00 PM", show: "8:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 20,
        title: "Hey Nineteen – A Tribute to Steely Dan",
        schedule: { date: "2025-03-28", doors: "7:00 PM", show: "8:00 PM" },
        venueId: "met_ri",
        venue: "The Met RI"
    },
    {
        id: 21,
        title: "Wolfman Jack: Rock & Blues Night",
        schedule: { date: "2025-02-14", doors: "7:30 PM", show: "8:30 PM" },
        venueId: "met_ri",
        venue: "The Met RI",
        bandIds: ["wolfman_jack"]
    },
    {
        id: 22,
        title: "Wolfman Jack: Live at The Grove",
        schedule: { date: "2025-03-07", doors: "7:00 PM", show: "8:00 PM" },
        venueId: "grove_ct",
        venue: "The Grove CT",
        bandIds: ["wolfman_jack"]
    },
    {
        id: 23,
        title: "Wolfman Jack: Rock Revival Tour",
        schedule: { date: "2025-04-05", doors: "6:30 PM", show: "7:30 PM" },
        venueId: "oceanview_ri",
        venue: "Oceanview Pavilion RI",
        bandIds: ["wolfman_jack"]
    },
    {
        id: 24,
        title: "The DMB Project - Live at Oceanview Pavilion",
        schedule: { date: "2025-02-15", doors: "7:00 PM", show: "8:00 PM" },
        venue: "Oceanview Pavilion",
        venueId: "oceanview_ri",
        bandIds: ["dmb_project"]
    },
    {
        id: 25,
        title: "The DMB Project - Sunset Music Festival",
        schedule: { date: "2025-03-10", doors: "6:30 PM", show: "7:30 PM" },
        venue: "Sunset Music Festival Grounds",
        venueId: "sunset_festival_ri",
        bandIds: ["dmb_project"]
    },
    {
        id: 26,
        title: "The DMB Project - Summer Breeze Concert Series",
        schedule: { date: "2025-06-20", doors: "8:00 PM", show: "9:00 PM" },
        venue: "Breeze Amphitheater",
        venueId: "breeze_amphitheater",
        bandIds: ["dmb_project"]
    },
    {
        id: 27,
        title: "The DMB Project - Dave Matthews Night",
        schedule: { date: "2025-09-05", doors: "7:30 PM", show: "8:30 PM" },
        venue: "The Met RI",
        venueId: "met_ri",
        bandIds: ["dmb_project"]
    },
    {
        id: 28,
        title: "The DMB Project - Fall Festival Finale",
        schedule: { date: "2025-10-12", doors: "6:00 PM", show: "7:00 PM" },
        venue: "Greenfield Park Stage",
        venueId: "greenfield_stage",
        bandIds: ["dmb_project"]
    }
];

module.exports = { events };
