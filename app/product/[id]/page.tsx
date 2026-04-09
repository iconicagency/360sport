'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound, useRouter } from "next/navigation";
import { Check, Shield, Truck, Star, Loader2 } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { products as hardcodedProducts } from "@/data/products";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Check hardcoded
          const found = hardcodedProducts.find(p => p.id === id);
          if (found) {
            setProduct(found);
          } else {
            router.push('/products');
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <Loader2 className="animate-spin h-12 w-12 text-brand-blue" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            {discount > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded">
                Giảm {discount}%
              </div>
            )}
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-cover" 
              priority
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <div className="text-sm text-brand-orange font-bold uppercase tracking-wider mb-2">{product.category}</div>
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight text-brand-blue">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(128 đánh giá)</span>
            </div>
            
            <div className="flex items-end gap-4 mb-8 pb-8 border-b">
              <span className="text-4xl font-bold text-brand-orange">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through mb-1">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-bold text-brand-blue mb-4">Mô tả sản phẩm</h3>
              <div 
                className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
              
              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>
                  <span className="font-medium">Hàng chính hãng 100%</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>
                  <span className="font-medium">Giao hàng toàn quốc</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full"><Check className="h-4 w-4 text-green-600" /></div>
                  <span className="font-medium">Đổi trả trong 7 ngày nếu có lỗi</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-auto">
              <AddToCartButton product={product} />
              
              <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl mt-8">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-brand-orange shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Bảo đảm chất lượng</div>
                    <div className="text-sm text-gray-500">Sản phẩm đã được kiểm định an toàn</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Truck className="h-8 w-8 text-brand-orange shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900 mb-1">Miễn phí vận chuyển</div>
                    <div className="text-sm text-gray-500">Áp dụng cho đơn hàng từ 500.000đ</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
