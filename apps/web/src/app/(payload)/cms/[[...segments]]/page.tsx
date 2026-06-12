import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { Metadata } from 'next'

export const generateMetadata = async ({ params }: { params: any }): Promise<Metadata> => {
  return generatePageMetadata({ config: configPromise, params })
}

const Page = ({ params, searchParams }: { params: any; searchParams: any }) => {
  return RootPage({ config: configPromise, params, searchParams })
}

export default Page
