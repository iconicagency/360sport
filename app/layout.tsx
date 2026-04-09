import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { CartProvider } from '@/components/CartProvider';
import MiniCart from '@/components/MiniCart';
import { FirebaseProvider } from '@/components/FirebaseProvider';
import { SettingsProvider } from '@/components/SettingsProvider';

export const metadata: Metadata = {
  title: '360 Sport Clone',
  description: 'E-commerce website for sports equipment inspired by 360sport.com.vn',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <FirebaseProvider>
          <SettingsProvider>
            <CartProvider>
              {children}
              <MiniCart />
            </CartProvider>
          </SettingsProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
