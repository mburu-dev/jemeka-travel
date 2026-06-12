import { CollectionConfig } from 'payload';

export const BlogPosts: CollectionConfig = {
  slug: 'blog_posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'content', type: 'richText', required: true },
    { name: 'isPublished', type: 'checkbox', defaultValue: false },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
  ],
};
