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
    { name: 'description', type: 'textarea', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
};
