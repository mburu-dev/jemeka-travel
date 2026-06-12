import { CollectionConfig } from 'payload';

export const Packages: CollectionConfig = {
  slug: 'packages',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'destination', type: 'relationship', relationTo: 'destinations', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'duration', type: 'number', required: true },
    { name: 'price', type: 'text', required: true },
    { name: 'image', type: 'upload', relationTo: 'media' },
  ],
};
