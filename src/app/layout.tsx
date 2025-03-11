import React from 'react';

export const metadata = {
  title: 'Personal AI Assistant',
  description: 'Your personal AI assistant for productivity and research',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
