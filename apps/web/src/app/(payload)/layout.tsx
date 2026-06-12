import configPromise from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => (
  <RootLayout config={configPromise}>{children}</RootLayout>
)

export default Layout
