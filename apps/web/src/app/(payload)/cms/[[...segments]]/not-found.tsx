import configPromise from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from './importMap'

type Params = Promise<{ segments: string[] }>
type SearchParams = Promise<{ [key: string]: string | string[] }>

const NotFound = ({ params, searchParams }: { params: Params; searchParams: SearchParams }) => {
  return NotFoundPage({ config: configPromise, importMap, params, searchParams })
}

export default NotFound
