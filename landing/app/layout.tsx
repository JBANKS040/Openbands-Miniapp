import './globals.css'
import { Manrope } from 'next/font/google'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'Openbands — Anonymous. Verified. Raw.',
  description:
    'Join verified workplace conversations without giving up your privacy.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${manrope.variable} font-sans bg-white text-gray-900 h-full antialiased`}>{children}</body>
    </html>
  )
}


