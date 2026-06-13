import { CollectionConfig } from 'payload';

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'country', type: 'text', required: true },
    { 
      name: 'region', 
      type: 'select', 
      options: ['africa', 'europe', 'asia', 'americas', 'oceania'], 
      required: true 
    },
    {
      name: 'experienceCategories',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Wildlife Safaris', value: 'wildlife' },
        { label: 'Beach Holidays', value: 'beach' },
        { label: 'Adventure Travel', value: 'adventure' },
        { label: 'Mountain Climbing', value: 'mountain' },
        { label: 'Cultural Experiences', value: 'cultural' },
        { label: 'Honeymoon Escapes', value: 'honeymoon' },
        { label: 'Family Vacations', value: 'family' },
        { label: 'Luxury Travel', value: 'luxury' },
        { label: 'Corporate Retreats', value: 'corporate' },
      ],
    },
    { name: 'description', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'heroGallery',
      type: 'array',
      minRows: 4,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        }
      ]
    },
    {
      name: 'highlights',
      type: 'array',
      fields: [{ name: 'highlight', type: 'text' }]
    },
    {
      name: 'activities',
      type: 'array',
      fields: [{ name: 'activity', type: 'text' }]
    },
    {
      name: 'wildlife',
      type: 'array',
      fields: [{ name: 'animal', type: 'text' }]
    },
    { name: 'bestTimeToVisit', type: 'text' },
    { name: 'durationRecommendations', type: 'text' },
    { name: 'videoExperienceUrl', type: 'text' },
    {
      name: 'testimonials',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
      ]
    },
  ],
};
