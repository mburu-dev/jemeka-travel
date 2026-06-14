import configPromise from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from './importMap'
import { Metadata } from 'next'

type Params = Promise<{ segments: string[] }>
type SearchParams = Promise<{ [key: string]: string | string[] }>

export const generateMetadata = async ({ params, searchParams }: { params: Params; searchParams: SearchParams }): Promise<Metadata> => {
  return generatePageMetadata({ config: configPromise, params, searchParams })
}

const Page = ({ params, searchParams }: { params: Params; searchParams: SearchParams }) => {
  return RootPage({ config: configPromise, importMap, params, searchParams })
}

export default Page
