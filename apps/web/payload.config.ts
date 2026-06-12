import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import path from 'path';

import { Users } from './src/collections/Users';
import { Media } from './src/collections/Media';
import { Destinations } from './src/collections/Destinations';
import { Packages } from './src/collections/Packages';
import { BlogPosts } from './src/collections/BlogPosts';

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
    Users,
    Media,
    Destinations,
    Packages,
    BlogPosts,
  ],
  routes: {
    admin: '/cms',
  },
  admin: {
    user: 'payload-users',
  },
  secret: process.env.PAYLOAD_SECRET || 'super-secret-key-1234',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:../api/sqlite.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || 'jemeka-media',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || 'admin',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'password',
        },
        region: process.env.S3_REGION || 'us-east-1',
        endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
        forcePathStyle: true,
      },
    }),
  ],
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
});
