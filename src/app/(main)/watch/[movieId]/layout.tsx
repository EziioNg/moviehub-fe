import { ReactNode } from 'react'

export default function WatchLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="m-0 p-0 bg-black overflow-hidden">
        {children}
      </body>
    </html>
  )
}
