import { getDb } from "../../../apps/api/src/queries/connection";
import {
  destinations,
  packages,
  testimonials,
  enquiries,
  blogPosts,
  type InsertDestination,
  type InsertPackage,
  type InsertTestimonial,
  type InsertEnquiry,
  type InsertBlogPost,
} from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  const destinationsData: InsertDestination[] = [
    {
      name: "Serengeti National Park",
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
      isFeatured: true,
    },
    {
      name: "Masai Mara",
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
    },
    {
      name: "Zanzibar",
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
      isFeatured: true,
    },
    {
      name: "Victoria Falls",
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
    },
    {
      name: "Cape Town",
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
    },
    {
      name: "Kruger National Park",
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
      isFeatured: true,
    },
    {
      name: "Marrakech",
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
    },
    {
      name: "Santorini",
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
      isFeatured: true,
    },
  ];

  try {
    for (const dest of destinationsData) {
      await db.insert(destinations).values(dest).onConflictDoNothing();
    }
    console.log("Seeded/Skipped destinations:", destinationsData.length);
  } catch (e) {
    console.error("Destination seed failed:", e);
  }

  // Seed Packages one by one
  const packagesData: InsertPackage[] = [
    {
      title: "Serengeti Classic Safari",
      slug: "serengeti-classic-safari",
      destinationId: 1,
      description:
        "Experience the ultimate Serengeti safari with daily game drives, luxury accommodation, and expert guides. Witness the incredible wildlife and landscapes of Tanzania's most famous national park.",
      shortDescription: "4-day luxury safari with daily game drives in Serengeti.",
      duration: 4,
      maxGroupSize: 6,
      price: "2850.00",
      depositAmount: "500.00",
      currency: "USD",
      inclusions: [
        "Airport transfers",
        "Luxury tented camp accommodation",
        "All meals",
        "Daily game drives",
        "Professional guide",
        "Park entrance fees",
        "Bottled water",
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Alcoholic beverages",
        "Gratuities",
        "Personal expenses",
      ],
      itinerary: [
        { day: 1, title: "Arrival & First Game Drive", description: "Arrive at Kilimanjaro Airport, transfer to Serengeti. Afternoon game drive." },
        { day: 2, title: "Full Day Serengeti Exploration", description: "Full-day game drive exploring the central Serengeti. Picnic lunch in the bush." },
        { day: 3, title: "Northern Serengeti & Migration", description: "Drive to northern Serengeti for migration viewing. Optional hot air balloon ride." },
        { day: 4, title: "Final Game Drive & Departure", description: "Morning game drive, breakfast, and transfer to airstrip." },
      ],
      image: "/images/packages/serengeti-classic.jpg",
      gallery: ["/images/packages/serengeti-classic-1.jpg"],
      category: "wildlife",
      difficulty: "easy",
      isFeatured: true,
      rating: "4.9",
      reviewCount: 124,
    },
    {
      title: "Masai Mara Migration Experience",
      slug: "masai-mara-migration",
      destinationId: 2,
      description:
        "Witness the Great Migration at Masai Mara with front-row seats to the Mara River crossings. Stay in luxury lodges and enjoy game drives in open 4x4 vehicles.",
      shortDescription: "5-day migration-focused safari with luxury lodge stays.",
      duration: 5,
      maxGroupSize: 8,
      price: "3200.00",
      depositAmount: "600.00",
      currency: "USD",
      inclusions: [
        "Nairobi airport transfers",
        "Luxury lodge accommodation",
        "All meals",
        "Daily game drives in 4x4",
        "Professional guide",
        "Park fees",
        "Bush breakfast experience",
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Alcoholic drinks",
        "Tips and gratuities",
        "Visa fees",
      ],
      itinerary: [
        { day: 1, title: "Nairobi to Masai Mara", description: "Pick-up from Nairobi, scenic drive through the Great Rift Valley." },
        { day: 2, title: "Migration Zone Exploration", description: "Full day in the migration zone with packed lunch. Witness river crossings." },
        { day: 3, title: "Big Cat Territory", description: "Explore the Musiara Marsh area known for big cat sightings." },
        { day: 4, title: "Rhino Ridge & Plains", description: "Search for rhinos on the Oloololo Escarpment. Hot air balloon option." },
        { day: 5, title: "Final Drive & Return", description: "Early morning game drive, breakfast, and return to Nairobi." },
      ],
      image: "/images/packages/mara-migration.jpg",
      gallery: ["/images/packages/mara-migration-1.jpg"],
      category: "wildlife",
      difficulty: "easy",
      isFeatured: true,
      rating: "4.8",
      reviewCount: 96,
    },
    {
      title: "Zanzibar Beach Paradise",
      slug: "zanzibar-beach-paradise",
      destinationId: 3,
      description:
        "Unwind on the pristine beaches of Zanzibar with crystal-clear waters and powdery white sand. Explore Stone Town's rich history and enjoy snorkeling in the coral reefs.",
      shortDescription: "6-day beach getaway with cultural exploration and water activities.",
      duration: 6,
      maxGroupSize: 12,
      price: "1950.00",
      depositAmount: "400.00",
      currency: "USD",
      inclusions: [
        "Airport transfers in Zanzibar",
        "Beach resort accommodation",
        "Daily breakfast",
        "Stone Town guided tour",
        "Spice plantation tour",
        "Snorkeling excursion",
        "Sunset dhow cruise",
      ],
      exclusions: [
        "Flights to Zanzibar",
        "Travel insurance",
        "Lunch and dinner",
        "Scuba diving",
        "Personal expenses",
      ],
      itinerary: [
        { day: 1, title: "Arrival & Beach Welcome", description: "Arrive in Zanzibar, transfer to beach resort. Welcome cocktail." },
        { day: 2, title: "Stone Town Discovery", description: "Guided walking tour of historic Stone Town. Visit spice market." },
        { day: 3, title: "Spice Tour & Jozani Forest", description: "Visit spice plantation. Afternoon at Jozani Forest to see red colobus monkeys." },
        { day: 4, title: "Mnemba Atoll Snorkeling", description: "Full-day snorkeling excursion to Mnemba Atoll." },
        { day: 5, title: "Prison Island & Free Time", description: "Morning trip to Prison Island. Free afternoon for relaxation." },
        { day: 6, title: "Departure", description: "Final morning at leisure. Transfer to airport." },
      ],
      image: "/images/packages/zanzibar-beach.jpg",
      gallery: ["/images/packages/zanzibar-beach-1.jpg"],
      category: "beach",
      difficulty: "easy",
      isFeatured: true,
      rating: "4.7",
      reviewCount: 78,
    },
    {
      title: "Kruger Big Five Safari",
      slug: "kruger-big-five-safari",
      destinationId: 6,
      description:
        "Track the Big Five in South Africa's premier national park. With expert rangers and luxury lodge accommodation, this safari offers unforgettable wildlife encounters.",
      shortDescription: "5-day Big Five safari with luxury lodge accommodation in Kruger.",
      duration: 5,
      maxGroupSize: 6,
      price: "3600.00",
      depositAmount: "700.00",
      currency: "USD",
      inclusions: [
        "Johannesburg transfers",
        "Luxury safari lodge",
        "All meals and drinks",
        "2 game drives daily",
        "Bush walks with armed ranger",
        "Park entrance fees",
        "Night drives",
      ],
      exclusions: [
        "Flights to Johannesburg",
        "Travel insurance",
        "Gratuities",
        "Spa treatments",
        "Curio shop purchases",
      ],
      itinerary: [
        { day: 1, title: "Transfer to Kruger", description: "Transfer from Johannesburg to Kruger. Afternoon game drive." },
        { day: 2, title: "Big Five Tracking", description: "Morning and afternoon game drives focused on Big Five sightings." },
        { day: 3, title: "Bush Walks & Birding", description: "Morning guided bush walk. Afternoon birding safari. Evening boma dinner." },
        { day: 4, title: "Full Day Exploration", description: "Extended game drive covering different zones of the park." },
        { day: 5, title: "Final Drive & Departure", description: "Early morning game drive, farewell brunch, and transfer back." },
      ],
      image: "/images/packages/kruger-safari.jpg",
      gallery: ["/images/packages/kruger-safari-1.jpg"],
      category: "wildlife",
      difficulty: "easy",
      isFeatured: true,
      rating: "4.9",
      reviewCount: 112,
    },
    {
      title: "Santorini Island Escape",
      slug: "santorini-island-escape",
      destinationId: 8,
      description:
        "Experience the magic of Santorini with its stunning caldera views, volcanic beaches, and world-famous sunsets. This romantic getaway includes wine tasting and a catamaran cruise.",
      shortDescription: "5-day Greek island paradise with wine tours and sunset cruises.",
      duration: 5,
      maxGroupSize: 12,
      price: "2100.00",
      depositAmount: "450.00",
      currency: "USD",
      inclusions: [
        "Airport/port transfers",
        "Boutique hotel (caldera view)",
        "Daily breakfast",
        "Wine tasting tour",
        "Catamaran sunset cruise",
        "Akrotiri guided tour",
        "Cooking class",
      ],
      exclusions: [
        "Flights to Santorini",
        "Travel insurance",
        "Lunch and dinner",
        "Personal expenses",
        "Optional excursions",
      ],
      itinerary: [
        { day: 1, title: "Arrival & Oia Sunset", description: "Arrive in Santorini. Transfer to hotel with caldera views. Evening in Oia." },
        { day: 2, title: "Island Tour & Wine Tasting", description: "Visit Akrotiri. Afternoon wine tasting at 3 volcanic wineries." },
        { day: 3, title: "Catamaran Cruise", description: "Full-day catamaran cruise around the caldera. Swim in hot springs." },
        { day: 4, title: "Beach Day & Cooking Class", description: "Morning at Red Beach. Evening traditional Greek cooking class." },
        { day: 5, title: "Fira & Departure", description: "Morning exploring Fira town. Transfer to airport/port." },
      ],
      image: "/images/packages/santorini-escape.jpg",
      gallery: ["/images/packages/santorini-escape-1.jpg"],
      category: "luxury",
      difficulty: "easy",
      isFeatured: true,
      rating: "4.8",
      reviewCount: 89,
    },
    {
      title: "East African Safari Circuit",
      slug: "east-african-safari-circuit",
      destinationId: 1,
      description:
        "The ultimate East African safari combining Serengeti and Masai Mara. Track the migration across borders and experience the best of Tanzania and Kenya.",
      shortDescription: "8-day cross-border safari combining Serengeti and Masai Mara.",
      duration: 8,
      maxGroupSize: 6,
      price: "5200.00",
      depositAmount: "1000.00",
      currency: "USD",
      inclusions: [
        "All internal flights",
        "Luxury lodges and camps",
        "All meals",
        "Daily game drives",
        "Expert guides",
        "All park fees",
        "Border crossing assistance",
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Visa fees",
        "Alcoholic beverages",
        "Tips and gratuities",
      ],
      itinerary: [
        { day: 1, title: "Arrive Arusha", description: "Arrive at Kilimanjaro Airport. Transfer to Arusha." },
        { day: 2, title: "Arusha to Serengeti", description: "Fly to Serengeti. Afternoon game drive." },
        { day: 3, title: "Serengeti North", description: "Full day in northern Serengeti for migration viewing." },
        { day: 4, title: "Serengeti Game Drives", description: "Another full day exploring Serengeti." },
        { day: 5, title: "Cross to Masai Mara", description: "Fly from Serengeti to Masai Mara. Afternoon game drive." },
        { day: 6, title: "Masai Mara Migration", description: "Full day at the Mara River for migration crossings." },
        { day: 7, title: "Big Cat Territory", description: "Explore the Marsh area for lion and leopard sightings." },
        { day: 8, title: "Departure", description: "Final morning game drive, fly to Nairobi." },
      ],
      image: "/images/packages/east-africa-circuit.jpg",
      gallery: ["/images/packages/east-africa-circuit-1.jpg"],
      category: "wildlife",
      difficulty: "easy",
      isFeatured: true,
      rating: "4.9",
      reviewCount: 45,
    },
    {
      title: "Victoria Falls Adventure",
      slug: "victoria-falls-adventure",
      destinationId: 4,
      description:
        "Experience the thundering Victoria Falls and adrenaline-pumping activities in the adventure capital of Africa. Perfect for thrill-seekers and nature lovers alike.",
      shortDescription: "4-day adventure trip with falls tour and adrenaline activities.",
      duration: 4,
      maxGroupSize: 10,
      price: "1650.00",
      depositAmount: "350.00",
      currency: "USD",
      inclusions: [
        "Airport transfers",
        "Hotel accommodation",
        "Guided falls tour",
        "Sunset cruise",
        "White-water rafting",
        "Bungee jump or zip line",
        "All activity equipment",
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Most meals",
        "Devil's Pool supplement",
        "Helicopter flights",
      ],
      itinerary: [
        { day: 1, title: "Arrival & Sunset Cruise", description: "Arrive at Victoria Falls Airport. Evening sunset cruise on the Zambezi." },
        { day: 2, title: "Falls Tour & Rafting", description: "Guided tour of Victoria Falls. Afternoon white-water rafting." },
        { day: 3, title: "Adventure Activities", description: "Choose between bungee jumping, zip-lining, or gorge swinging." },
        { day: 4, title: "Departure", description: "Optional helicopter flight. Transfer to airport." },
      ],
      image: "/images/packages/vicfalls-adventure.jpg",
      gallery: ["/images/packages/vicfalls-adventure-1.jpg"],
      category: "adventure",
      difficulty: "moderate",
      isFeatured: false,
      rating: "4.6",
      reviewCount: 54,
    },
    {
      title: "Cape Town & Winelands",
      slug: "cape-town-winelands",
      destinationId: 5,
      description:
        "Discover Cape Town's stunning beauty and world-class wine regions. From Table Mountain to Stellenbosch vineyards, this tour combines natural wonders with gourmet experiences.",
      shortDescription: "5-day cultural and culinary journey through Cape Town and Winelands.",
      duration: 5,
      maxGroupSize: 8,
      price: "2400.00",
      depositAmount: "500.00",
      currency: "USD",
      inclusions: [
        "Airport transfers",
        "Boutique hotel accommodation",
        "Table Mountain cable car",
        "Cape Peninsula tour",
        "Winelands day trip",
        "Robben Island ferry",
        "Breakfast daily",
      ],
      exclusions: [
        "International flights",
        "Travel insurance",
        "Lunch and dinner",
        "Personal expenses",
        "Optional activities",
      ],
      itinerary: [
        { day: 1, title: "Arrival & V&A Waterfront", description: "Arrive in Cape Town. Evening stroll at the V&A Waterfront." },
        { day: 2, title: "Table Mountain & City Tour", description: "Cable car up Table Mountain. City tour including Bo-Kaap." },
        { day: 3, title: "Cape Peninsula", description: "Visit Boulders Beach penguins, Cape Point, Chapman's Peak Drive." },
        { day: 4, title: "Winelands Tour", description: "Day trip to Stellenbosch and Franschhoek. Wine tastings." },
        { day: 5, title: "Robben Island & Departure", description: "Morning ferry to Robben Island. Transfer to airport." },
      ],
      image: "/images/packages/cape-town.jpg",
      gallery: ["/images/packages/cape-town-1.jpg"],
      category: "cultural",
      difficulty: "easy",
      isFeatured: false,
      rating: "4.8",
      reviewCount: 67,
    },
    {
      title: "Moroccan Culture & Cuisine",
      slug: "moroccan-culture-cuisine",
      destinationId: 7,
      description:
        "Immerse yourself in Morocco's rich culture with this comprehensive tour of Marrakech. Visit palaces, explore souks, and learn to cook traditional Moroccan dishes.",
      shortDescription: "5-day cultural immersion in Marrakech with cooking classes and city tours.",
      duration: 5,
      maxGroupSize: 10,
      price: "1450.00",
      depositAmount: "300.00",
      currency: "USD",
      inclusions: [
        "Airport transfers",
        "Riad accommodation",
        "Guided medina tour",
        "Cooking class",
        "Hammam spa experience",
        "Atlas Mountains excursion",
        "Daily breakfast",
      ],
      exclusions: [
        "Flights to Marrakech",
        "Travel insurance",
        "Lunch and dinner",
        "Personal shopping",
        "Tips",
      ],
      itinerary: [
        { day: 1, title: "Arrival & Medina Introduction", description: "Arrive in Marrakech. Evening walk through the medina." },
        { day: 2, title: "Palaces & Gardens", description: "Visit Bahia Palace, Saadian Tombs, and Majorelle Garden." },
        { day: 3, title: "Cooking Class & Hammam", description: "Market visit and cooking class. Afternoon hammam spa." },
        { day: 4, title: "Atlas Mountains", description: "Day trip to the Atlas Mountains. Visit a Berber village." },
        { day: 5, title: "Free Time & Departure", description: "Morning free for shopping. Transfer to airport." },
      ],
      image: "/images/packages/morocco-culture.jpg",
      gallery: ["/images/packages/morocco-culture-1.jpg"],
      category: "cultural",
      difficulty: "easy",
      isFeatured: false,
      rating: "4.5",
      reviewCount: 43,
    },
    {
      title: "Family Safari Adventure",
      slug: "family-safari-adventure",
      destinationId: 6,
      description:
        "A family-friendly safari designed for travelers with children. Educational wildlife experiences, safe accommodations, and activities that will captivate kids and adults alike.",
      shortDescription: "6-day family-friendly safari with educational wildlife experiences.",
      duration: 6,
      maxGroupSize: 8,
      price: "2800.00",
      depositAmount: "500.00",
      currency: "USD",
      inclusions: [
        "Family suite accommodation",
        "All meals with kid-friendly options",
        "Junior ranger program",
        "Daily game drives",
        "Swimming pool access",
        "Braai dinner experience",
        "Airport transfers",
      ],
      exclusions: [
        "Flights to South Africa",
        "Travel insurance",
        "Alcoholic beverages",
        "Personal expenses",
        "Gratuities",
      ],
      itinerary: [
        { day: 1, title: "Arrival & Pool Time", description: "Arrive at Kruger. Check into family suite. Afternoon at the pool." },
        { day: 2, title: "First Game Drive & Junior Ranger", description: "Morning game drive. Afternoon Junior Ranger program for kids." },
        { day: 3, title: "Big Five Day", description: "Full-day Big Five quest with treasure hunt checklist for kids." },
        { day: 4, title: "Nature Walk & Arts", description: "Morning nature walk. Afternoon bush arts and crafts session." },
        { day: 5, title: "Special Species", description: "Search for wild dogs and cheetahs. Evening braai dinner." },
        { day: 6, title: "Farewell Drive & Departure", description: "Final game drive with certificate ceremony. Transfer to airport." },
      ],
      image: "/images/packages/family-safari.jpg",
      gallery: ["/images/packages/family-safari-1.jpg"],
      category: "family",
      difficulty: "easy",
      isFeatured: false,
      rating: "4.7",
      reviewCount: 36,
    },
  ];

  try {
    for (const pkg of packagesData) {
      await db.insert(packages).values(pkg).onConflictDoNothing();
    }
    console.log("Seeded/Skipped packages:", packagesData.length);
  } catch (e) {
    console.error("Package seed failed:", e);
  }

  // Seed Testimonials
  const testimonialsData: InsertTestimonial[] = [
    {
      name: "Sarah Johnson",
      email: "sarah@email.com",
      rating: 5,
      comment:
        "The Serengeti safari was absolutely life-changing! Our guide was incredibly knowledgeable and we saw the Great Migration in all its glory. The luxury camp exceeded all expectations. Jemeka Tours handled every detail perfectly.",
      packageId: 1,
      destination: "Serengeti, Tanzania",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Michael Chen",
      email: "michael@email.com",
      rating: 5,
      comment:
        "We booked the Masai Mara Migration Experience and it was phenomenal! The Mara River crossing was the most incredible wildlife spectacle I've ever witnessed. Highly recommend Jemeka Tours!",
      packageId: 2,
      destination: "Masai Mara, Kenya",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Emma Williams",
      email: "emma@email.com",
      rating: 5,
      comment:
        "Zanzibar was the perfect honeymoon destination. The beach resort was stunning, the spice tour was fascinating, and the sunset dhow cruise was so romantic. Thank you Jemeka!",
      packageId: 3,
      destination: "Zanzibar, Tanzania",
      isVerified: true,
      isActive: true,
    },
    {
      name: "David Brown",
      email: "david@email.com",
      rating: 4,
      comment:
        "Victoria Falls was breathtaking and the adventure activities were thrilling. The white-water rafting was amazing! Organization was good and the guide was friendly.",
      packageId: 4,
      destination: "Victoria Falls, Zimbabwe",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Lisa Martinez",
      email: "lisa@email.com",
      rating: 5,
      comment:
        "The Cape Town and Winelands tour was exceptional! Table Mountain, the penguins at Boulders Beach, and the wine tastings in Stellenbosch were highlights. Jemeka curated the perfect itinerary.",
      packageId: 5,
      destination: "Cape Town, South Africa",
      isVerified: true,
      isActive: true,
    },
    {
      name: "James Anderson",
      email: "james@email.com",
      rating: 5,
      comment:
        "Kruger Big Five Safari was incredible! We saw all of the Big Five within the first two days. The luxury lodge was beautiful and the food was outstanding. Our ranger was passionate and made every game drive exciting.",
      packageId: 6,
      destination: "Kruger, South Africa",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Amara Okafor",
      email: "amara@email.com",
      rating: 4,
      comment:
        "The Moroccan Culture tour gave me a deep appreciation for this beautiful country. The cooking class was a highlight - I now make tagine at home! The riad was charming.",
      packageId: 7,
      destination: "Marrakech, Morocco",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Sophie Taylor",
      email: "sophie@email.com",
      rating: 5,
      comment:
        "Santorini was everything I dreamed of and more! The caldera views are surreal, the wine tasting was delightful, and the catamaran cruise was the best day of our trip. Perfectly organized by Jemeka Tours.",
      packageId: 8,
      destination: "Santorini, Greece",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Robert Kim",
      email: "robert@email.com",
      rating: 5,
      comment:
        "The East African Safari Circuit was the trip of a lifetime. Crossing between Tanzania and Kenya to follow the migration was an unparalleled experience. Jemeka's logistics were seamless.",
      packageId: 9,
      destination: "East Africa",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Olivia Thompson",
      email: "olivia@email.com",
      rating: 5,
      comment:
        "We took our kids on the Family Safari Adventure and it was amazing! The junior ranger program kept them engaged, and they loved checking off the Big Five list. A perfect family vacation!",
      packageId: 10,
      destination: "Kruger, South Africa",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Marcus Johnson",
      email: "marcus@email.com",
      rating: 5,
      comment:
        "I've traveled with many tour companies, but Jemeka Tours stands out for their attention to detail. The Serengeti hot air balloon ride at sunrise was worth every penny!",
      packageId: 1,
      destination: "Serengeti, Tanzania",
      isVerified: true,
      isActive: true,
    },
    {
      name: "Priya Sharma",
      email: "priya@email.com",
      rating: 4,
      comment:
        "Zanzibar Beach Paradise was exactly what we needed after a busy year. The resort was stunning, the snorkeling at Mnemba Atoll was world-class, and Stone Town was fascinating.",
      packageId: 3,
      destination: "Zanzibar, Tanzania",
      isVerified: true,
      isActive: true,
    },
  ];

  try {
    for (const t of testimonialsData) {
      await db.insert(testimonials).values(t).onConflictDoNothing();
    }
    console.log("Seeded/Skipped testimonials:", testimonialsData.length);
  } catch (e) {
    console.error("Testimonial seed failed:", e);
  }

  // Seed Blog Posts
  const blogPostsData: InsertBlogPost[] = [
    // ... (rest of the data)
  ];

  try {
    for (const bp of blogPostsData) {
      await db.insert(blogPosts).values(bp).onConflictDoNothing();
    }
    console.log("Seeded/Skipped blog posts:", blogPostsData.length);
  } catch (e) {
    console.error("Blog post seed failed:", e);
  }

  // Seed sample enquiries
  const enquiriesData: InsertEnquiry[] = [
    // ... (rest of the data)
  ];

  try {
    for (const eq of enquiriesData) {
      await db.insert(enquiries).values(eq).onConflictDoNothing();
    }
    console.log("Seeded/Skipped enquiries:", enquiriesData.length);
  } catch (e) {
    console.error("Enquiry seed failed:", e);
  }

  console.log("Database seeding complete!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
