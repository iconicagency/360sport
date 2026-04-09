'use client';
import { useEffect } from 'react';
import { useSettings } from './SettingsProvider';

export default function FaviconManager() {
  const { settings } = useSettings();

  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.setAttribute('rel', 'shortcut icon');
    link.setAttribute('href', settings.faviconImage);
    document.head.appendChild(link);
  }, [settings.faviconImage]);

  return null;
}
