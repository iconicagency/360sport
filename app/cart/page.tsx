'use client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";
import { Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-8">Giỏ Hàng Của Bạn</h1>
        
        {items.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link href="/products" className="bg-[#f97316] text-white px-8 py-3 rounded-full font-bold inline-block hover:bg-orange-600 transition-colors">
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow text-center sm:text-left">
                    <Link href={`/product/${item.id}`} className="font-bold hover:text-[#f97316] transition-colors line-clamp-2">{item.name}</Link>
                    <div className="text-[#f97316] font-bold mt-1">{formatPrice(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg h-10">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 text-gray-500 hover:text-[#f97316]">-</button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 text-gray-500 hover:text-[#f97316]">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-xl font-bold mb-6 pb-4 border-b">Tổng Đơn Hàng</h2>
              <div className="flex justify-between mb-4 text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between mb-6 text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{totalPrice >= 500000 ? 'Miễn phí' : '30.000 đ'}</span>
              </div>
              <div className="flex justify-between mb-8 pb-6 border-b text-lg font-bold">
                <span>Tổng cộng</span>
                <span className="text-[#f97316]">{formatPrice(totalPrice >= 500000 ? totalPrice : totalPrice + 30000)}</span>
              </div>
              <Link href="/checkout" className="w-full bg-[#f97316] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors uppercase tracking-wider">
                Thanh Toán <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
