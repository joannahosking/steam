// app/fonts.ts
import { Plus_Jakarta_Sans } from 'next/font/google'

export const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
})