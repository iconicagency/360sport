'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SiteSettings {
  brandBlue: string;
  brandOrange: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  footerDescription: string;
}

const defaultSettings: SiteSettings = {
  brandBlue: '#004182',
  brandOrange: '#f58220',
  heroTitle: 'THỨC UỐNG TĂNG LỰC BÙ KHOÁNG BÙ ĐIỆN GIẢI',
  heroSubtitle: 'Sản phẩm 360 SPORT được nghiên cứu dựa trên thể trạng và nhu cầu của người Việt. Bổ sung năng lượng tức thì, hỗ trợ phục hồi cơ bắp sau tập luyện.',
  heroImage: 'https://picsum.photos/seed/360sport-hero/1920/800',
  contactPhone: '090 123 4567',
  contactEmail: 'contact@360sport.vn',
  contactAddress: '123 Đường Thể Thao, Quận 1, TP. Hồ Chí Minh',
  facebookUrl: 'https://facebook.com/360sport',
  instagramUrl: 'https://instagram.com/360sport',
  youtubeUrl: 'https://youtube.com/360sport',
  footerDescription: '360 SPORT tự hào là thương hiệu thức uống thể thao hàng đầu Việt Nam, đồng hành cùng mọi giải đấu và tinh thần bền bỉ của người Việt.'
};

const SettingsContext = createContext<{
  settings: SiteSettings;
  loading: boolean;
}>({
  settings: defaultSettings,
  loading: true,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'site'), (doc) => {
      if (doc.exists()) {
        setSettings(prev => ({ ...prev, ...doc.data() }));
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching settings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Inject colors into CSS variables
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--color-brand-blue', settings.brandBlue);
      root.style.setProperty('--color-brand-orange', settings.brandOrange);
      
      // Calculate light and dark variants (simplified)
      root.style.setProperty('--color-brand-dark-blue', adjustColor(settings.brandBlue, -20));
      root.style.setProperty('--color-brand-light-blue', adjustColor(settings.brandBlue, 20));
    }
  }, [settings.brandBlue, settings.brandOrange]);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Helper to darken/lighten hex colors
function adjustColor(hex: string, percent: number) {
  if (!hex || !hex.startsWith('#')) return hex;
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 0 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 0 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 0 ? 0 : B : 255)).toString(16).slice(1);
}
