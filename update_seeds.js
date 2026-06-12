const fs = require('fs');
const path = require('path');

const seedPath = path.join(__dirname, 'packages', 'db', 'src', 'seed.ts');
let content = fs.readFileSync(seedPath, 'utf-8');

// 1. Update Destinations
// Serengeti
content = content.replace(
  /name: "Serengeti National Park"[\s\S]*?isFeatured: true,/,
  `name: "Serengeti National Park",
      slug: "serengeti-national-park",
      country: "Tanzania",
      region: "africa",
      description:
        "The Serengeti is one of the most famous national parks in the world, renowned for its massive annual migration of wildebeest and zebra. Spanning over 14,750 square kilometers, this UNESCO World Heritage Site offers an unparalleled safari experience with its vast plains, diverse wildlife, and stunning sunsets. Witness the Big Five in their natural habitat and experience the raw beauty of the African wilderness.",
      shortDescription:
        "Witness the Great Migration and Big Five in Tanzania's legendary safari destination.",
      highlights: [
        "Great Migration viewing (1.5M wildebeest)",
        "Big Five safari experiences",
        "Hot air balloon rides over the plains",
        "Luxury tented camps",
        "Maasai cultural visits",
        "Ngorongoro Crater day trips",
      ],
      bestTimeToVisit: "June to October",
      image: "/images/destinations/serengeti.jpg",
      gallery: ["/images/destinations/serengeti-1.jpg", "/images/destinations/serengeti-2.jpg"],
      coordinates: { lat: -2.154, lng: 34.6857 },
      activities: ["Game Drives", "Hot Air Balloon", "Walking Safaris", "Bird Watching", "Cultural Tours"],
      isFeatured: false,
      isActive: false,`
);

// Masai Mara
content = content.replace(
  /name: "Masai Mara"[\s\S]*?isFeatured: true,/,
  `name: "Masai Mara",
      slug: "masai-mara",
      country: "Kenya",
      region: "africa",
      description:
        "The Masai Mara is Africa's most iconic safari destination, famous for its exceptional population of lions, leopards, cheetahs, and the annual wildebeest migration. This vast wilderness area offers breathtaking landscapes, incredible wildlife encounters, and authentic interactions with the Maasai people.",
      shortDescription:
        "Experience Kenya's premier wildlife reserve with spectacular Big Five encounters.",
      highlights: [
        "Mara River crossings",
        "Big cat tracking",
        "Maasai village visits",
        "Sundowner experiences",
        "Bush dining under stars",
        "Photographic hides",
      ],
      bestTimeToVisit: "July to October",
      image: "/images/destinations/masai-mara.jpg",
      gallery: ["/images/destinations/masai-mara-1.jpg"],
      coordinates: { lat: -1.4061, lng: 35.1858 },
      activities: ["Game Drives", "Bush Walks", "Hot Air Balloon", "Photography Tours", "Cultural Visits"],
      isFeatured: true,
      isActive: true,`
);

// Zanzibar
content = content.replace(
  /name: "Zanzibar"[\s\S]*?isFeatured: true,/,
  `name: "Zanzibar",
      slug: "zanzibar",
      country: "Tanzania",
      region: "africa",
      description:
        "Zanzibar is a tropical paradise off the coast of Tanzania, known for its pristine white-sand beaches, crystal-clear turquoise waters, and rich cultural heritage. The historic Stone Town, a UNESCO World Heritage Site, offers a fascinating blend of African, Arab, and European influences.",
      shortDescription:
        "Tropical island paradise with pristine beaches, spice tours, and rich Swahili culture.",
      highlights: [
        "Stone Town UNESCO heritage site",
        "Spice plantation tours",
        "Prison Island snorkeling",
        "Jozani Forest monkey sanctuary",
        "Sunset dhow cruises",
        "World-class diving",
      ],
      bestTimeToVisit: "June to October",
      image: "/images/destinations/zanzibar.jpg",
      gallery: ["/images/destinations/zanzibar-1.jpg"],
      coordinates: { lat: -6.1659, lng: 39.2026 },
      activities: ["Beach Relaxation", "Snorkeling", "Diving", "Spice Tours", "Historical Tours"],
      isFeatured: false,
      isActive: false,`
);

// Victoria Falls
content = content.replace(
  /name: "Victoria Falls"[\s\S]*?isFeatured: false,/,
  `name: "Victoria Falls",
      slug: "victoria-falls",
      country: "Zimbabwe",
      region: "africa",
      description:
        "Known locally as 'Mosi-oa-Tunya' or 'The Smoke That Thunders,' Victoria Falls is one of the Seven Natural Wonders of the World. This breathtaking waterfall on the Zambezi River creates a mist plume that can be seen from miles away.",
      shortDescription:
        "One of the Seven Natural Wonders with breathtaking waterfalls and adventure activities.",
      highlights: [
        "Devil's Pool swimming",
        "White-water rafting",
        "Bungee jumping",
        "Helicopter flights",
        "Sunset Zambezi cruises",
        "Rainbow viewing",
      ],
      bestTimeToVisit: "February to May",
      image: "/images/destinations/victoria-falls.jpg",
      gallery: ["/images/destinations/victoria-falls-1.jpg"],
      coordinates: { lat: -17.9243, lng: 25.8572 },
      activities: ["Adventure Sports", "Boat Cruises", "Nature Walks", "Photography"],
      isFeatured: false,
      isActive: false,`
);

// Cape Town
content = content.replace(
  /name: "Cape Town"[\s\S]*?isFeatured: false,/,
  `name: "Cape Town",
      slug: "cape-town",
      country: "South Africa",
      region: "africa",
      description:
        "Cape Town is a stunning coastal city nestled between the iconic Table Mountain and the Atlantic Ocean. This vibrant city offers a unique blend of natural beauty, rich history, world-class cuisine, and diverse culture.",
      shortDescription:
        "Stunning coastal city between Table Mountain and the Atlantic with rich culture.",
      highlights: [
        "Table Mountain cable car",
        "Cape Peninsula scenic drive",
        "Robben Island tours",
        "Winelands day trips",
        "Boulders Beach penguins",
        "Kirstenbosch Gardens",
      ],
      bestTimeToVisit: "November to March",
      image: "/images/destinations/cape-town.jpg",
      gallery: ["/images/destinations/cape-town-1.jpg"],
      coordinates: { lat: -33.9249, lng: 18.4241 },
      activities: ["City Tours", "Wine Tasting", "Hiking", "Beach Visits", "Historical Tours"],
      isFeatured: false,
      isActive: false,`
);

// Kruger
content = content.replace(
  /name: "Kruger National Park"[\s\S]*?isFeatured: true,/,
  `name: "Kruger National Park",
      slug: "kruger-national-park",
      country: "South Africa",
      region: "africa",
      description:
        "Kruger National Park is one of Africa's largest game reserves, spanning nearly 20,000 square kilometers. Home to an impressive diversity of wildlife including over 500 bird species, 147 mammals, and the iconic Big Five.",
      shortDescription:
        "South Africa's premier safari destination with incredible wildlife diversity.",
      highlights: [
        "Big Five encounters",
        "Over 500 bird species",
        "Night game drives",
        "Luxury safari lodges",
        "Self-drive safari routes",
        "Bush braai dinners",
      ],
      bestTimeToVisit: "May to September",
      image: "/images/destinations/kruger.jpg",
      gallery: ["/images/destinations/kruger-1.jpg"],
      coordinates: { lat: -23.9884, lng: 31.5547 },
      activities: ["Game Drives", "Bird Watching", "Photography", "Bush Walks"],
      isFeatured: false,
      isActive: false,`
);

// Marrakech
content = content.replace(
  /name: "Marrakech"[\s\S]*?isFeatured: false,/,
  `name: "Marrakech",
      slug: "marrakech",
      country: "Morocco",
      region: "africa",
      description:
        "Marrakech is a sensory feast of vibrant souks, ornate palaces, and fragrant gardens. Known as the 'Red City' for its rose-hued buildings, this ancient imperial city offers a mesmerizing blend of traditional Moroccan culture and modern luxury.",
      shortDescription:
        "Morocco's vibrant 'Red City' with bustling souks, ornate palaces, and rich culture.",
      highlights: [
        "Jemaa el-Fnaa square",
        "Majorelle Garden",
        "Bahia Palace",
        "Traditional souks",
        "Hammam spa experiences",
        "Atlas Mountains day trips",
      ],
      bestTimeToVisit: "March to May, September to November",
      image: "/images/destinations/marrakech.jpg",
      gallery: ["/images/destinations/marrakech-1.jpg"],
      coordinates: { lat: 31.6295, lng: -7.9811 },
      activities: ["Cultural Tours", "Shopping", "Cooking Classes", "Spa Experiences"],
      isFeatured: false,
      isActive: false,`
);

// Santorini
content = content.replace(
  /name: "Santorini"[\s\S]*?isFeatured: true,/,
  `name: "Santorini",
      slug: "santorini",
      country: "Greece",
      region: "europe",
      description:
        "Santorini is the crown jewel of the Greek islands, famous for its dramatic caldera views, whitewashed buildings with blue domes, and spectacular sunsets. This volcanic island offers a perfect blend of romantic ambiance, rich history, and culinary excellence.",
      shortDescription:
        "Greece's iconic island with stunning caldera views, blue domes, and legendary sunsets.",
      highlights: [
        "Oia sunset viewing",
        "Caldera boat cruises",
        "Volcanic beach visits",
        "Wine tasting tours",
        "Ancient Akrotiri ruins",
        "Fira town exploration",
      ],
      bestTimeToVisit: "April to October",
      image: "/images/destinations/santorini.jpg",
      gallery: ["/images/destinations/santorini-1.jpg"],
      coordinates: { lat: 36.3932, lng: 25.4615 },
      activities: ["Sunset Viewing", "Boat Tours", "Wine Tasting", "Beach Relaxation", "Photography"],
      isFeatured: false,
      isActive: false,`
);

// 2. Add Amboseli National Park
const amboseliStr = `{
      name: "Amboseli National Park",
      slug: "amboseli-national-park",
      country: "Kenya",
      region: "africa",
      description: "Crowned by Mount Kilimanjaro, Africa's highest peak, Amboseli National Park is one of Kenya's most popular parks. The name 'Amboseli' comes from a Maasai word meaning 'salty dust', and it is one of the best places in Africa to view large herds of elephants up close.",
      shortDescription: "Iconic park known for large elephant herds and stunning views of Mount Kilimanjaro.",
      highlights: ["Mount Kilimanjaro views", "Large elephant herds", "Observation Hill", "Maasai cultural visits", "Bird watching", "Photography"],
      bestTimeToVisit: "June to October",
      image: "/images/destinations/amboseli.jpg",
      gallery: ["/images/destinations/amboseli-1.jpg"],
      coordinates: { lat: -2.6416, lng: 37.2606 },
      activities: ["Game Drives", "Bird Watching", "Cultural Tours", "Photography"],
      isFeatured: true,
      isActive: true,
    },
  ];`;
content = content.replace(/  \];\n\n  try \{\n    for \(const dest of destinationsData\)/, amboseliStr + '\n\n  try {\n    for (const dest of destinationsData)');


// 3. Update Packages
// Serengeti Classic Safari
content = content.replace(/slug: "serengeti-classic-safari"[\s\S]*?reviewCount: 124,/, `slug: "serengeti-classic-safari",\n      destinationId: 1,\n      description: "Experience the ultimate Serengeti safari with daily game drives, luxury accommodation, and expert guides. Witness the incredible wildlife and landscapes of Tanzania's most famous national park.",\n      shortDescription: "4-day luxury safari with daily game drives in Serengeti.",\n      duration: 4,\n      maxGroupSize: 6,\n      price: "2850.00",\n      depositAmount: "500.00",\n      currency: "USD",\n      inclusions: ["Airport transfers", "Luxury tented camp accommodation", "All meals", "Daily game drives", "Professional guide", "Park entrance fees", "Bottled water"],\n      exclusions: ["International flights", "Travel insurance", "Alcoholic beverages", "Gratuities", "Personal expenses"],\n      itinerary: [{ day: 1, title: "Arrival & First Game Drive", description: "Arrive at Kilimanjaro Airport, transfer to Serengeti. Afternoon game drive." }, { day: 2, title: "Full Day Serengeti Exploration", description: "Full-day game drive exploring the central Serengeti. Picnic lunch in the bush." }, { day: 3, title: "Northern Serengeti & Migration", description: "Drive to northern Serengeti for migration viewing. Optional hot air balloon ride." }, { day: 4, title: "Final Game Drive & Departure", description: "Morning game drive, breakfast, and transfer to airstrip." }],\n      image: "/images/packages/serengeti-classic.jpg",\n      gallery: ["/images/packages/serengeti-classic-1.jpg"],\n      category: "wildlife",\n      difficulty: "easy",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.9,\n      reviewCount: 124,`);

// Masai Mara Migration Experience
content = content.replace(/slug: "masai-mara-migration"[\s\S]*?reviewCount: 96,/, `slug: "masai-mara-migration",\n      destinationId: 2,\n      description: "Witness the Great Migration at Masai Mara with front-row seats to the Mara River crossings. Stay in luxury lodges and enjoy game drives in open 4x4 vehicles.",\n      shortDescription: "5-day migration-focused safari with luxury lodge stays.",\n      duration: 5,\n      maxGroupSize: 8,\n      price: "3200.00",\n      depositAmount: "600.00",\n      currency: "USD",\n      inclusions: ["Nairobi airport transfers", "Luxury lodge accommodation", "All meals", "Daily game drives in 4x4", "Professional guide", "Park fees", "Bush breakfast experience"],\n      exclusions: ["International flights", "Travel insurance", "Alcoholic drinks", "Tips and gratuities", "Visa fees"],\n      itinerary: [{ day: 1, title: "Nairobi to Masai Mara", description: "Pick-up from Nairobi, scenic drive through the Great Rift Valley." }, { day: 2, title: "Migration Zone Exploration", description: "Full day in the migration zone with packed lunch. Witness river crossings." }, { day: 3, title: "Big Cat Territory", description: "Explore the Musiara Marsh area known for big cat sightings." }, { day: 4, title: "Rhino Ridge & Plains", description: "Search for rhinos on the Oloololo Escarpment. Hot air balloon option." }, { day: 5, title: "Final Drive & Return", description: "Early morning game drive, breakfast, and return to Nairobi." }],\n      image: "/images/packages/mara-migration.jpg",\n      gallery: ["/images/packages/mara-migration-1.jpg"],\n      category: "wildlife",\n      difficulty: "easy",\n      isFeatured: true,\n      isActive: true,\n      rating: 4.8,\n      reviewCount: 96,`);

// Zanzibar Beach Paradise
content = content.replace(/slug: "zanzibar-beach-paradise"[\s\S]*?reviewCount: 78,/, `slug: "zanzibar-beach-paradise",\n      destinationId: 3,\n      description: "Unwind on the pristine beaches of Zanzibar with crystal-clear waters and powdery white sand. Explore Stone Town's rich history and enjoy snorkeling in the coral reefs.",\n      shortDescription: "6-day beach getaway with cultural exploration and water activities.",\n      duration: 6,\n      maxGroupSize: 12,\n      price: "1950.00",\n      depositAmount: "400.00",\n      currency: "USD",\n      inclusions: ["Airport transfers in Zanzibar", "Beach resort accommodation", "Daily breakfast", "Stone Town guided tour", "Spice plantation tour", "Snorkeling excursion", "Sunset dhow cruise"],\n      exclusions: ["Flights to Zanzibar", "Travel insurance", "Lunch and dinner", "Scuba diving", "Personal expenses"],\n      itinerary: [{ day: 1, title: "Arrival & Beach Welcome", description: "Arrive in Zanzibar, transfer to beach resort. Welcome cocktail." }, { day: 2, title: "Stone Town Discovery", description: "Guided walking tour of historic Stone Town. Visit spice market." }, { day: 3, title: "Spice Tour & Jozani Forest", description: "Visit spice plantation. Afternoon at Jozani Forest to see red colobus monkeys." }, { day: 4, title: "Mnemba Atoll Snorkeling", description: "Full-day snorkeling excursion to Mnemba Atoll." }, { day: 5, title: "Prison Island & Free Time", description: "Morning trip to Prison Island. Free afternoon for relaxation." }, { day: 6, title: "Departure", description: "Final morning at leisure. Transfer to airport." }],\n      image: "/images/packages/zanzibar-beach.jpg",\n      gallery: ["/images/packages/zanzibar-beach-1.jpg"],\n      category: "beach",\n      difficulty: "easy",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.7,\n      reviewCount: 78,`);

// Kruger Big Five Safari
content = content.replace(/slug: "kruger-big-five-safari"[\s\S]*?reviewCount: 112,/, `slug: "kruger-big-five-safari",\n      destinationId: 6,\n      description: "Track the Big Five in South Africa's premier national park. With expert rangers and luxury lodge accommodation, this safari offers unforgettable wildlife encounters.",\n      shortDescription: "5-day Big Five safari with luxury lodge accommodation in Kruger.",\n      duration: 5,\n      maxGroupSize: 6,\n      price: "3600.00",\n      depositAmount: "700.00",\n      currency: "USD",\n      inclusions: ["Johannesburg transfers", "Luxury safari lodge", "All meals and drinks", "2 game drives daily", "Bush walks with armed ranger", "Park entrance fees", "Night drives"],\n      exclusions: ["Flights to Johannesburg", "Travel insurance", "Gratuities", "Spa treatments", "Curio shop purchases"],\n      itinerary: [{ day: 1, title: "Transfer to Kruger", description: "Transfer from Johannesburg to Kruger. Afternoon game drive." }, { day: 2, title: "Big Five Tracking", description: "Morning and afternoon game drives focused on Big Five sightings." }, { day: 3, title: "Bush Walks & Birding", description: "Morning guided bush walk. Afternoon birding safari. Evening boma dinner." }, { day: 4, title: "Full Day Exploration", description: "Extended game drive covering different zones of the park." }, { day: 5, title: "Final Drive & Departure", description: "Early morning game drive, farewell brunch, and transfer back." }],\n      image: "/images/packages/kruger-safari.jpg",\n      gallery: ["/images/packages/kruger-safari-1.jpg"],\n      category: "wildlife",\n      difficulty: "easy",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.9,\n      reviewCount: 112,`);

// Santorini Island Escape
content = content.replace(/slug: "santorini-island-escape"[\s\S]*?reviewCount: 89,/, `slug: "santorini-island-escape",\n      destinationId: 8,\n      description: "Experience the magic of Santorini with its stunning caldera views, volcanic beaches, and world-famous sunsets. This romantic getaway includes wine tasting and a catamaran cruise.",\n      shortDescription: "5-day Greek island paradise with wine tours and sunset cruises.",\n      duration: 5,\n      maxGroupSize: 12,\n      price: "2100.00",\n      depositAmount: "450.00",\n      currency: "USD",\n      inclusions: ["Airport/port transfers", "Boutique hotel (caldera view)", "Daily breakfast", "Wine tasting tour", "Catamaran sunset cruise", "Akrotiri guided tour", "Cooking class"],\n      exclusions: ["Flights to Santorini", "Travel insurance", "Lunch and dinner", "Personal expenses", "Optional excursions"],\n      itinerary: [{ day: 1, title: "Arrival & Oia Sunset", description: "Arrive in Santorini. Transfer to hotel with caldera views. Evening in Oia." }, { day: 2, title: "Island Tour & Wine Tasting", description: "Visit Akrotiri. Afternoon wine tasting at 3 volcanic wineries." }, { day: 3, title: "Catamaran Cruise", description: "Full-day catamaran cruise around the caldera. Swim in hot springs." }, { day: 4, title: "Beach Day & Cooking Class", description: "Morning at Red Beach. Evening traditional Greek cooking class." }, { day: 5, title: "Fira & Departure", description: "Morning exploring Fira town. Transfer to airport/port." }],\n      image: "/images/packages/santorini-escape.jpg",\n      gallery: ["/images/packages/santorini-escape-1.jpg"],\n      category: "luxury",\n      difficulty: "easy",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.8,\n      reviewCount: 89,`);

// East African Safari Circuit
content = content.replace(/slug: "east-african-safari-circuit"[\s\S]*?reviewCount: 45,/, `slug: "east-african-safari-circuit",\n      destinationId: 1,\n      description: "The ultimate East African safari combining Serengeti and Masai Mara. Track the migration across borders and experience the best of Tanzania and Kenya.",\n      shortDescription: "8-day cross-border safari combining Serengeti and Masai Mara.",\n      duration: 8,\n      maxGroupSize: 6,\n      price: "5200.00",\n      depositAmount: "1000.00",\n      currency: "USD",\n      inclusions: ["All internal flights", "Luxury lodges and camps", "All meals", "Daily game drives", "Expert guides", "All park fees", "Border crossing assistance"],\n      exclusions: ["International flights", "Travel insurance", "Visa fees", "Alcoholic beverages", "Tips and gratuities"],\n      itinerary: [{ day: 1, title: "Arrive Arusha", description: "Arrive at Kilimanjaro Airport. Transfer to Arusha." }, { day: 2, title: "Arusha to Serengeti", description: "Fly to Serengeti. Afternoon game drive." }, { day: 3, title: "Serengeti North", description: "Full day in northern Serengeti for migration viewing." }, { day: 4, title: "Serengeti Game Drives", description: "Another full day exploring Serengeti." }, { day: 5, title: "Cross to Masai Mara", description: "Fly from Serengeti to Masai Mara. Afternoon game drive." }, { day: 6, title: "Masai Mara Migration", description: "Full day at the Mara River for migration crossings." }, { day: 7, title: "Big Cat Territory", description: "Explore the Marsh area for lion and leopard sightings." }, { day: 8, title: "Departure", description: "Final morning game drive, fly to Nairobi." }],\n      image: "/images/packages/east-africa-circuit.jpg",\n      gallery: ["/images/packages/east-africa-circuit-1.jpg"],\n      category: "wildlife",\n      difficulty: "easy",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.9,\n      reviewCount: 45,`);

// Victoria Falls Adventure
content = content.replace(/slug: "victoria-falls-adventure"[\s\S]*?reviewCount: 54,/, `slug: "victoria-falls-adventure",\n      destinationId: 4,\n      description: "Experience the thundering Victoria Falls and adrenaline-pumping activities in the adventure capital of Africa. Perfect for thrill-seekers and nature lovers alike.",\n      shortDescription: "4-day adventure trip with falls tour and adrenaline activities.",\n      duration: 4,\n      maxGroupSize: 10,\n      price: "1650.00",\n      depositAmount: "350.00",\n      currency: "USD",\n      inclusions: ["Airport transfers", "Hotel accommodation", "Guided falls tour", "Sunset cruise", "White-water rafting", "Bungee jump or zip line", "All activity equipment"],\n      exclusions: ["International flights", "Travel insurance", "Most meals", "Devil's Pool supplement", "Helicopter flights"],\n      itinerary: [{ day: 1, title: "Arrival & Sunset Cruise", description: "Arrive at Victoria Falls Airport. Evening sunset cruise on the Zambezi." }, { day: 2, title: "Falls Tour & Rafting", description: "Guided tour of Victoria Falls. Afternoon white-water rafting." }, { day: 3, title: "Adventure Activities", description: "Choose between bungee jumping, zip-lining, or gorge swinging." }, { day: 4, title: "Departure", description: "Optional helicopter flight. Transfer to airport." }],\n      image: "/images/packages/vicfalls-adventure.jpg",\n      gallery: ["/images/packages/vicfalls-adventure-1.jpg"],\n      category: "adventure",\n      difficulty: "moderate",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.6,\n      reviewCount: 54,`);

// Cape Town & Winelands
content = content.replace(/slug: "cape-town-winelands"[\s\S]*?reviewCount: 67,/, `slug: "cape-town-winelands",\n      destinationId: 5,\n      description: "Discover Cape Town's stunning beauty and world-class wine regions. From Table Mountain to Stellenbosch vineyards, this tour combines natural wonders with gourmet experiences.",\n      shortDescription: "5-day cultural and culinary journey through Cape Town and Winelands.",\n      duration: 5,\n      maxGroupSize: 8,\n      price: "2400.00",\n      depositAmount: "500.00",\n      currency: "USD",\n      inclusions: ["Airport transfers", "Boutique hotel accommodation", "Table Mountain cable car", "Cape Peninsula tour", "Winelands day trip", "Robben Island ferry", "Breakfast daily"],\n      exclusions: ["International flights", "Travel insurance", "Lunch and dinner", "Personal expenses", "Optional activities"],\n      itinerary: [{ day: 1, title: "Arrival & V&A Waterfront", description: "Arrive in Cape Town. Evening stroll at the V&A Waterfront." }, { day: 2, title: "Table Mountain & City Tour", description: "Cable car up Table Mountain. City tour including Bo-Kaap." }, { day: 3, title: "Cape Peninsula", description: "Visit Boulders Beach penguins, Cape Point, Chapman's Peak Drive." }, { day: 4, title: "Winelands Tour", description: "Day trip to Stellenbosch and Franschhoek. Wine tastings." }, { day: 5, title: "Robben Island & Departure", description: "Morning ferry to Robben Island. Transfer to airport." }],\n      image: "/images/packages/cape-town.jpg",\n      gallery: ["/images/packages/cape-town-1.jpg"],\n      category: "cultural",\n      difficulty: "easy",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.8,\n      reviewCount: 67,`);

// Moroccan Culture & Cuisine
content = content.replace(/slug: "moroccan-culture-cuisine"[\s\S]*?reviewCount: 43,/, `slug: "moroccan-culture-cuisine",\n      destinationId: 7,\n      description: "Immerse yourself in Morocco's rich culture with this comprehensive tour of Marrakech. Visit palaces, explore souks, and learn to cook traditional Moroccan dishes.",\n      shortDescription: "5-day cultural immersion in Marrakech with cooking classes and city tours.",\n      duration: 5,\n      maxGroupSize: 10,\n      price: "1450.00",\n      depositAmount: "300.00",\n      currency: "USD",\n      inclusions: ["Airport transfers", "Riad accommodation", "Guided medina tour", "Cooking class", "Hammam spa experience", "Atlas Mountains excursion", "Daily breakfast"],\n      exclusions: ["Flights to Marrakech", "Travel insurance", "Lunch and dinner", "Personal shopping", "Tips"],\n      itinerary: [{ day: 1, title: "Arrival & Medina Introduction", description: "Arrive in Marrakech. Evening walk through the medina." }, { day: 2, title: "Palaces & Gardens", description: "Visit Bahia Palace, Saadian Tombs, and Majorelle Garden." }, { day: 3, title: "Cooking Class & Hammam", description: "Market visit and cooking class. Afternoon hammam spa." }, { day: 4, title: "Atlas Mountains", description: "Day trip to the Atlas Mountains. Visit a Berber village." }, { day: 5, title: "Free Time & Departure", description: "Morning free for shopping. Transfer to airport." }],\n      image: "/images/packages/morocco-culture.jpg",\n      gallery: ["/images/packages/morocco-culture-1.jpg"],\n      category: "cultural",\n      difficulty: "easy",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.5,\n      reviewCount: 43,`);

// Family Safari Adventure
content = content.replace(/slug: "family-safari-adventure"[\s\S]*?reviewCount: 36,/, `slug: "family-safari-adventure",\n      destinationId: 6,\n      description: "A family-friendly safari designed for travelers with children. Educational wildlife experiences, safe accommodations, and activities that will captivate kids and adults alike.",\n      shortDescription: "6-day family-friendly safari with educational wildlife experiences.",\n      duration: 6,\n      maxGroupSize: 8,\n      price: "2800.00",\n      depositAmount: "500.00",\n      currency: "USD",\n      inclusions: ["Family suite accommodation", "All meals with kid-friendly options", "Junior ranger program", "Daily game drives", "Swimming pool access", "Braai dinner experience", "Airport transfers"],\n      exclusions: ["Flights to South Africa", "Travel insurance", "Alcoholic beverages", "Personal expenses", "Gratuities"],\n      itinerary: [{ day: 1, title: "Arrival & Pool Time", description: "Arrive at Kruger. Check into family suite. Afternoon at the pool." }, { day: 2, title: "First Game Drive & Junior Ranger", description: "Morning game drive. Afternoon Junior Ranger program for kids." }, { day: 3, title: "Big Five Day", description: "Full-day Big Five quest with treasure hunt checklist for kids." }, { day: 4, title: "Nature Walk & Arts", description: "Morning nature walk. Afternoon bush arts and crafts session." }, { day: 5, title: "Special Species", description: "Search for wild dogs and cheetahs. Evening braai dinner." }, { day: 6, title: "Farewell Drive & Departure", description: "Final game drive with certificate ceremony. Transfer to airport." }],\n      image: "/images/packages/family-safari.jpg",\n      gallery: ["/images/packages/family-safari-1.jpg"],\n      category: "family",\n      difficulty: "easy",\n      isFeatured: false,\n      isActive: false,\n      rating: 4.7,\n      reviewCount: 36,`);

// Add Amboseli Package
const amboseliPkgStr = `{
      title: "Amboseli Elephant Safari",
      slug: "amboseli-elephant-safari",
      destinationId: 9, // Assuming Amboseli is ID 9 since there are 8 destinations
      description: "Get up close to large herds of elephants with the magnificent Mount Kilimanjaro as a backdrop. Enjoy guided game drives and learn about the Maasai culture in this unforgettable Amboseli experience.",
      shortDescription: "3-day Amboseli safari focused on elephant herds and Kilimanjaro views.",
      duration: 3,
      maxGroupSize: 6,
      price: "1850.00",
      depositAmount: "300.00",
      currency: "USD",
      inclusions: ["Nairobi transfers", "Safari lodge accommodation", "All meals", "Daily game drives", "Professional guide", "Park fees", "Maasai village visit"],
      exclusions: ["International flights", "Travel insurance", "Alcoholic beverages", "Gratuities"],
      itinerary: [
        { day: 1, title: "Nairobi to Amboseli", description: "Drive from Nairobi to Amboseli. Afternoon game drive." },
        { day: 2, title: "Full Day Exploration", description: "Morning and afternoon game drives. Optional Maasai village visit." },
        { day: 3, title: "Final Drive & Return", description: "Early morning game drive. Return to Nairobi." }
      ],
      image: "/images/packages/amboseli-safari.jpg",
      gallery: ["/images/packages/amboseli-safari-1.jpg"],
      category: "wildlife",
      difficulty: "easy",
      isFeatured: true,
      isActive: true,
      rating: 4.8,
      reviewCount: 42,
    },
  ];`;
content = content.replace(/  \];\n\n  try \{\n    for \(const pkg of packagesData\)/, amboseliPkgStr + '\n\n  try {\n    for (const pkg of packagesData)');

// 4. Update Testimonials
// Replace the entire testimonialsData array
const newTestimonials = `const testimonialsData: InsertTestimonial[] = [
    {
      name: "Placeholder (To be replaced with real user consent)",
      email: "placeholder1@example.com",
      rating: 5,
      comment:
        "Our trip to the Masai Mara was incredible! The guide was highly knowledgeable and we saw everything we wanted. (Note: Awaiting real verified testimony replacement).",
      packageId: 2,
      destination: "Masai Mara, Kenya",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Placeholder 2 (To be replaced with real user consent)",
      email: "placeholder2@example.com",
      rating: 5,
      comment:
        "The Amboseli safari gave us perfect views of Mount Kilimanjaro and we loved seeing the large elephant herds! (Note: Awaiting real verified testimony replacement).",
      packageId: 11, // Assuming Amboseli package is ID 11
      destination: "Amboseli, Kenya",
      isVerified: true,
      isActive: true,
    },
  ];`;
content = content.replace(/const testimonialsData: InsertTestimonial\[\] = \[\s*\{[\s\S]*?\}\s*\];/m, newTestimonials);

fs.writeFileSync(seedPath, content);
console.log('Seed updated successfully.');
