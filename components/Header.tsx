'use client';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, User } from 'lucide-react';
import { useCart } from './CartProvider';
import { useEffect, useState } from 'react';

export default function Header() {
  const { totalItems, toggleCart } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      {/* Top Bar */}
      <div className="bg-[#f97316] text-white text-sm py-2 px-4 text-center">
        <p>MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC CHO ĐƠN HÀNG TỪ 500K</p>
      </div>

      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="lg:hidden p-2 text-gray-600 hover:text-[#f97316]">
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#f97316] rounded-full flex items-center justify-center text-white font-bold text-lg">
            360
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block text-gray-900">SPORT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-sm text-gray-700">
          <Link href="/" className="hover:text-[#f97316] transition-colors">TRANG CHỦ</Link>
          <Link href="/products" className="hover:text-[#f97316] transition-colors">SẢN PHẨM THỂ THAO</Link>
          <Link href="/about" className="hover:text-[#f97316] transition-colors">VỀ 360 SPORT</Link>
          <Link href="/blog" className="hover:text-[#f97316] transition-colors">NHỊP SỐNG 360</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="pl-4 pr-10 py-1.5 border rounded-full text-sm focus:outline-none focus:border-[#f97316] w-56 transition-all"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f97316]">
              <Search className="h-4 w-4" />
            </button>
          </div>
          
          <Link href="/admin" className="p-2 text-gray-600 hover:text-[#f97316] transition-colors">
            <User className="h-5 w-5" />
          </Link>
          
          <button onClick={toggleCart} className="p-2 text-gray-600 hover:text-[#f97316] transition-colors relative">
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute top-0 right-0 bg-[#f97316] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
