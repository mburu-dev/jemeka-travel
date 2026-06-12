import { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'payload-users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
};
