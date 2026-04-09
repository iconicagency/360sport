'use client';
import { useCart } from './CartProvider';
import { X, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function MiniCart() {
  const { isCartOpen, closeCart, items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        closeCart();
      }
    };
    if (isCartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  return (
    <div ref={cartRef} className="fixed bottom-6 right-6 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[80vh]">
      <div className="p-5 border-b flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-lg uppercase tracking-wider">Giỏ Hàng</h3>
        <button onClick={closeCart} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-5 space-y-5">
        {items.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="font-medium">Giỏ hàng đang trống</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              <div className="flex-grow">
                <h4 className="text-sm font-bold line-clamp-2 leading-snug mb-1 hover:text-[#f97316] transition-colors">
                  <Link href={`/product/${item.id}`} onClick={closeCart}>{item.name}</Link>
                </h4>
                <div className="text-[#f97316] font-bold text-sm mb-2">{formatPrice(item.price)}</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-gray-200 rounded-lg h-8">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 text-gray-500 hover:text-[#f97316]">-</button>
                    <span className="text-sm w-6 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 text-gray-500 hover:text-[#f97316]">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="p-5 border-t bg-gray-50">
          <div className="flex justify-between font-bold mb-4 text-lg">
            <span>Tổng cộng:</span>
            <span className="text-[#f97316]">{formatPrice(totalPrice)}</span>
          </div>
          <Link href="/checkout" onClick={closeCart} className="w-full bg-[#f97316] text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30 uppercase tracking-wider text-sm">
            Thanh Toán Ngay <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
