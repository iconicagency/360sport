'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface SiteSettings {
  brandBlue: string;
  brandOrange: string;
  logoImage: string;
  faviconImage: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroButton1Text: string;
  heroButton1Link: string;
  heroButton2Text: string;
  heroButton2Link: string;
  aboutImage: string;
  bannerImage: string;
  bannerTitle: string;
  bannerDesc: string;
  bannerButtonText: string;
  partnerBannerImage: string;
  partnerBannerTitle: string;
  partnerBannerDesc: string;
  partnerBannerButtonText: string;
  productHighlightImage: string;
  featuredProductIds: string[];
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
  logoImage: '/logo.png',
  faviconImage: '/favicon.ico',
  seoTitle: '360 Sport - Thức uống tăng lực bù khoáng, bù điện giải',
  seoDescription: '360 SPORT - Thức uống tăng lực bù khoáng, bù điện giải hàng đầu Việt Nam. Hỗ trợ phục hồi năng lượng và cơ bắp sau tập luyện.',
  heroTitle: 'THỨC UỐNG TĂNG LỰC BÙ KHOÁNG BÙ ĐIỆN GIẢI',
  heroSubtitle: 'Sản phẩm 360 SPORT được nghiên cứu dựa trên thể trạng và nhu cầu của người Việt. Bổ sung năng lượng tức thì, hỗ trợ phục hồi cơ bắp sau tập luyện.',
  heroImage: 'https://picsum.photos/seed/360sport-hero/1920/800',
  heroButton1Text: 'Mua Ngay',
  heroButton1Link: '#products',
  heroButton2Text: 'Tìm Hiểu Thêm',
  heroButton2Link: '/about',
  aboutImage: 'https://picsum.photos/seed/soccer-kick/1000/1000',
  bannerImage: 'https://picsum.photos/seed/runner-blue/1920/800',
  bannerTitle: 'THỨC UỐNG BỔ SUNG NĂNG LƯỢNG TĂNG LỰC, BÙ KHOÁNG, BÙ ĐIỆN GIẢI',
  bannerDesc: 'Sản phẩm 360 SPORT được nghiên cứu dựa trên thể trạng và nhu cầu của người Việt. Với các thành phần tối ưu 360 SPORT là sản phẩm tăng lực, bù khoáng, bù điện giải đầu tiên trên thị trường Việt Nam sử dụng LEVAGEN+ kết hợp với Hồng Sâm, Đường cỏ ngọt và các chất điện giải tạo nên công thức độc đáo có công dụng ngăn ngừa nguy cơ chuột rút, hỗ trợ phục hồi cơ bắp và giảm mệt mỏi sau tập luyện.',
  bannerButtonText: 'XEM THÊM',
  partnerBannerImage: 'https://picsum.photos/seed/360sport-banner/1200/600',
  partnerBannerTitle: 'ĐỒNG HÀNH CÙNG MỌI GIẢI ĐẤU THỂ THAO',
  partnerBannerDesc: '360 SPORT tự hào là nhà tài trợ và đồng hành cùng nhiều giải chạy marathon, trail và các sự kiện thể thao lớn trên toàn quốc.',
  partnerBannerButtonText: 'Đọc Nhịp Sống 360',
  productHighlightImage: 'https://picsum.photos/seed/360sport-player/800/800',
  featuredProductIds: [],
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
