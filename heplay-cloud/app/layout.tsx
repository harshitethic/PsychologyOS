import './globals.css';
export const metadata = { title: 'HEPlay Cloud', description: 'HEPlay multi-user Telegram configuration service' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
