'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect, use } from 'react';
import { doc, getDoc, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { notFound, useRouter } from "next/navigation";
import { Check, Shield, Truck, Star, Loader2, ChevronRight, Facebook, Twitter, MessageCircle, Share2, RefreshCcw } from "lucide-react";
import AddToCartButton from "@/components/AddToCartButton";
import { products as hardcodedProducts } from "@/data/products";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        let productData: any = null;

        if (docSnap.exists()) {
          productData = { id: docSnap.id, ...docSnap.data() };
        } else {
          // Check hardcoded
          const found = hardcodedProducts.find(p => p.id === id);
          if (found) {
            productData = found;
          } else {
            router.push('/products');
            return;
          }
        }

        setProduct(productData);

        // Fetch related products
        if (productData.category) {
          const q = query(
            collection(db, 'products'),
            where('category', '==', productData.category),
            limit(4)
          );
          const relatedSnap = await getDocs(q);
          const related = relatedSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => p.id !== id);
          setRelatedProducts(related);
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
      
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gray-500">
            <Link href="/" className="hover:text-brand-blue transition-colors">TRANG CHỦ</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-brand-blue transition-colors">SẢN PHẨM</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery (5 columns) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm group">
                {discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    -{discount}%
                  </div>
                )}
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110" 
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Thumbnails (Placeholder for now) */}
              <div className="grid grid-cols-4 gap-4 mt-4">
                <div className="aspect-square rounded-lg border-2 border-brand-blue overflow-hidden relative cursor-pointer">
                  <Image src={product.image} alt={product.name} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                {/* Add more thumbnails if available in data */}
              </div>
            </div>
          </div>
          
          {/* Right: Product Info (7 columns) */}
          <div className="lg:col-span-7 flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight text-brand-blue uppercase">{product.name}</h1>
            
            <div className="w-20 h-1 bg-brand-orange mb-6"></div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="text-3xl font-bold text-brand-orange">{formatPrice(product.price)}</div>
              {product.originalPrice && (
                <div className="text-xl text-gray-400 line-through">{formatPrice(product.originalPrice)}</div>
              )}
            </div>
            
            <div className="prose prose-sm max-w-none text-gray-600 mb-8 leading-relaxed italic border-l-4 border-gray-100 pl-4 whitespace-pre-line">
              {product.shortDescription || "1 Đôi Tất Thể Thao Đa Năng – Nâng Tầm Trải Nghiệm Thể Thao Của Bạn. Thiết kế tối ưu, phù hợp mọi hoạt động thể thao. Hãy mua Thức uống tăng lực 360 SPORT để được tặng tất thể thao đa năng miễn phí."}
            </div>
            
            <AddToCartButton product={product} />
            
            {/* Meta Info */}
            <div className="space-y-3 py-6 border-t border-b border-gray-100 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-900">Mã:</span>
                <span className="text-gray-500">{product.sku || `360S-${product.id.slice(0, 4).toUpperCase()}`}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-gray-900">Danh mục:</span>
                <Link href={`/products?category=${product.category}`} className="text-gray-500 hover:text-brand-blue transition-colors">{product.category}</Link>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-bold text-gray-900">Từ khóa:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: string) => (
                      <span key={tag} className="text-gray-500 hover:text-brand-blue cursor-pointer transition-colors">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Trust Badges & Sharing */}
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Truck className="h-4 w-4 text-brand-blue" />
                  MIỄN PHÍ VẬN CHUYỂN
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <Shield className="h-4 w-4 text-brand-blue" />
                  CHÍNH HÃNG 100%
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <RefreshCcw className="h-4 w-4 text-brand-blue" />
                  ĐỔI TRẢ 7 NGÀY
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Facebook className="h-4 w-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Twitter className="h-4 w-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:opacity-80 transition-opacity">
                  <MessageCircle className="h-4 w-4" />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-300 transition-colors">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="mt-16">
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === 'description' ? 'border-brand-orange text-brand-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Mô tả
            </button>
            <button 
              onClick={() => setActiveTab('info')}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === 'info' ? 'border-brand-orange text-brand-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Thông tin bổ sung
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${activeTab === 'reviews' ? 'border-brand-orange text-brand-blue' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Đánh giá (0)
            </button>
          </div>
          
          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                <div dangerouslySetInnerHTML={{ __html: product.description }} />
              </div>
            )}
            {activeTab === 'info' && (
              <div className="max-w-2xl">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 font-bold text-gray-900 w-1/3">Trọng lượng</td>
                      <td className="py-3 text-gray-500">0.1 kg</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-bold text-gray-900">Kích thước</td>
                      <td className="py-3 text-gray-500">10 × 5 × 2 cm</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 font-bold text-gray-900">Chất liệu</td>
                      <td className="py-3 text-gray-500">Cotton cao cấp, Spandex</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                <button className="mt-4 text-brand-blue font-bold hover:underline">Hãy là người đầu tiên đánh giá</button>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-brand-blue uppercase tracking-tight">Sản phẩm liên quan</h2>
              <div className="h-px flex-grow mx-8 bg-gray-100 hidden md:block"></div>
              <Link href="/products" className="text-brand-orange font-bold text-sm hover:underline">XEM TẤT CẢ</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
