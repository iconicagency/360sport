'use client';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartProvider";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const finalPrice = totalPrice >= 500000 ? totalPrice : totalPrice + 30000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      await addDoc(collection(db, 'orders'), {
        customerName: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        address: formData.get('address'),
        notes: formData.get('notes'),
        paymentMethod,
        items,
        totalAmount: finalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: auth.currentUser?.uid || 'guest'
      });
      
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error saving order:", error);
      alert("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center max-w-md w-full">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-extrabold mb-4">Đặt Hàng Thành Công!</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Cảm ơn bạn đã mua sắm tại 360 SPORT. Đơn hàng của bạn đang được xử lý và sẽ được giao trong thời gian sớm nhất.
            </p>
            <Link href="/" className="bg-[#f97316] text-white px-8 py-4 rounded-full font-bold inline-block hover:bg-orange-600 transition-colors w-full uppercase tracking-wider">
              Về Trang Chủ
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight mb-8">Thanh Toán</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6">Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                <input required name="name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all" placeholder="Nhập họ và tên" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                  <input required name="phone" type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all" placeholder="Nhập số điện thoại" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input required name="email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all" placeholder="Nhập email" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                <input required name="address" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all" placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea name="notes" rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#f97316] focus:border-transparent outline-none transition-all" placeholder="Ghi chú thêm về đơn hàng..."></textarea>
              </div>
              
              <h2 className="text-xl font-bold mb-6 pt-6 border-t">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-4 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#f97316] focus:ring-[#f97316]" />
                  <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <div className="border rounded-xl overflow-hidden">
                  <label className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input type="radio" name="payment" value="transfer" checked={paymentMethod === 'transfer'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-5 h-5 text-[#f97316] focus:ring-[#f97316]" />
                    <span className="font-medium">Chuyển khoản ngân hàng</span>
                  </label>
                  {paymentMethod === 'transfer' && (
                    <div className="p-4 bg-orange-50 border-t text-sm text-gray-800 space-y-2">
                      <p>Vui lòng chuyển khoản với nội dung: <strong>[Tên của bạn] - [Số điện thoại]</strong></p>
                      <div className="bg-white p-4 rounded-lg border border-orange-100 mt-2">
                        <p className="mb-1"><span className="text-gray-500 inline-block w-24">Ngân hàng:</span> <strong>Techcombank</strong></p>
                        <p className="mb-1"><span className="text-gray-500 inline-block w-24">Tên TK:</span> <strong>Bế Thị Nhung</strong></p>
                        <p><span className="text-gray-500 inline-block w-24">Số TK:</span> <strong className="text-lg text-[#f97316]">9100099999</strong></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#f97316] text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-colors uppercase tracking-wider mt-8 shadow-lg shadow-orange-500/30 disabled:opacity-50 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  'Hoàn Tất Đặt Hàng'
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-100 p-8 rounded-2xl h-fit">
            <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.id} className="flex gap-4 items-center bg-white p-4 rounded-xl">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-sm line-clamp-2">{item.name}</h3>
                    <div className="text-[#f97316] font-bold text-sm mt-1">{formatPrice(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-300 pt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>{totalPrice >= 500000 ? 'Miễn phí' : '30.000 đ'}</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-300">
                <span>Tổng cộng</span>
                <span className="text-[#f97316]">{formatPrice(finalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
