import configPromise from '@payload-config'
import '@payloadcms/next/css'
import { RootLayout } from '@payloadcms/next/layouts'
import { importMap } from './cms/[[...segments]]/importMap'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => (
  // @ts-expect-error – Payload's RootLayout requires serverFunction internally; not needed for basic usage
  <RootLayout config={configPromise} importMap={importMap}>
    {children}
  </RootLayout>
)

export default Layout
