'use client';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from './SettingsProvider';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                360
              </div>
              <span className="font-bold text-xl tracking-tight text-white">SPORT</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              {settings.footerDescription}
            </p>
            <div className="flex gap-4">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-blue hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Liên Hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-blue shrink-0 mt-0.5" />
                <span className="text-sm">{settings.contactAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-blue shrink-0" />
                <span className="text-sm">Hotline: {settings.contactPhone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-blue shrink-0" />
                <span className="text-sm">Email: {settings.contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Chính Sách</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Chính sách giao hàng</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Chính sách đổi trả</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="#" className="hover:text-brand-blue transition-colors">Hướng dẫn mua hàng</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 uppercase tracking-wider">Đăng Ký Nhận Tin</h3>
            <p className="text-sm mb-4">Nhận thông tin khuyến mãi và sản phẩm mới nhất từ 360 SPORT.</p>
            <form className="flex flex-col gap-3" suppressHydrationWarning>
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-brand-blue text-white text-sm"
                suppressHydrationWarning
              />
              <button 
                type="button"
                className="bg-brand-blue text-white px-4 py-2 rounded font-medium hover:bg-brand-dark-blue transition-colors text-sm uppercase tracking-wider"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} 360 SPORT. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
