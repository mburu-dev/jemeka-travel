import configPromise from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'

const NotFound = ({ params, searchParams }: { params: any; searchParams: any }) => {
  return NotFoundPage({ config: configPromise, params, searchParams })
}

export default NotFound
