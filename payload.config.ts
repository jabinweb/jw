import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Users } from '@/app/(payload)/collections/Users'
import { Media } from '@/app/(payload)/collections/Media'
import { Posts } from '@/app/(payload)/collections/Posts'
import { Pages } from '@/app/(payload)/collections/Pages'
import { Categories } from '@/app/(payload)/collections/Categories'



const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const Redirects = {
  slug: 'redirects',
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      label: 'From URL',
    },
    {
      name: 'to',
      type: 'group',
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'To URL',
          admin: {
            condition: (_, siblingData) => !siblingData.reference,
          },
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages', 'posts'], // Adjust collections based on your use case
          admin: {
            condition: (_, siblingData) => !siblingData.url,
          },
        },
      ],
    },
  ],
};

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Pages, Posts, Media, Categories, Users, Redirects],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  plugins: [
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
    formBuilderPlugin({
      // see below for a list of available options
    }),
  ],
})