'use client';

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { ArrowRight, Zap, Shield, Truck, Award, Hexagon, Activity, Leaf, MapPin } from "lucide-react";

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSettings } from "@/components/SettingsProvider";

export default function HomePage() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbPosts, setDbPosts] = useState<any[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    async function fetchData() {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        setDbProducts(productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        
        const blogSnapshot = await getDocs(collection(db, 'blogPosts'));
        setDbPosts(blogSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const [selectedTab, setSelectedTab] = useState('Nhịp sống 360 Sport');
  const allProducts = [...dbProducts, ...products].slice(0, 4);
  const allPosts = dbPosts.filter(post => {
    if (selectedTab === 'Nhịp sống 360 Sport') return true;
    return post.category === selectedTab;
  }).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-brand-blue text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src={settings.heroImage} 
              alt="Hero Background" 
              fill 
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/80 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-block bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4">
                SẢN PHẨM MỚI
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight uppercase">
                {settings.heroTitle}
              </h1>
              <p className="text-base md:text-lg text-blue-50 mb-8 leading-relaxed max-w-xl">
                {settings.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={settings.heroButton1Link} 
                  className="bg-brand-blue hover:bg-brand-dark-blue text-white px-6 py-3 rounded-full font-bold text-base transition-all flex items-center gap-2 shadow-lg shadow-brand-blue/30"
                >
                  {settings.heroButton1Text} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href={settings.heroButton2Link} 
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-full font-bold text-base transition-all"
                >
                  {settings.heroButton2Text}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About 360 SPORT Section */}
        <section className="py-16 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-8 z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-blue uppercase tracking-tight">
                  Về 360 SPORT
                </h2>
                
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-20 shrink-0 flex flex-col items-center text-center">
                      <div className="w-12 h-12 mb-2 flex items-center justify-center text-brand-blue">
                        <Hexagon className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Công thức<br/>độc đáo</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Là sản phẩm đầu tiên trên thị trường Việt Nam với sự kết hợp của Levagen +, Hồng Sâm và các chất điện giải.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-20 shrink-0 flex flex-col items-center text-center">
                      <div className="w-12 h-12 mb-2 flex items-center justify-center text-brand-blue">
                        <Activity className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Công dụng<br/>tối ưu</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Bù nước điện giải, tăng cường sinh lực, ngăn ngừa nguy cơ chuột rút.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-20 shrink-0 flex flex-col items-center text-center">
                      <div className="w-12 h-12 mb-2 flex items-center justify-center text-brand-blue">
                        <Leaf className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Không sử<br/>dụng đường<br/>hóa học</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Sử dụng &quot;Đường cỏ ngọt&quot; đáp ứng nhu cầu khắt khe nhất trong việc kiểm soát cân nặng và đường huyết.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/about" className="inline-flex items-center gap-3 text-gray-400 hover:text-brand-blue transition-colors group">
                    <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-brand-blue transition-colors">
                      <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="font-bold tracking-widest uppercase text-xs">Xem Thêm</span>
                  </Link>
                </div>
              </div>

              <div className="lg:w-1/2 relative mt-10 lg:mt-0">
                <div className="relative h-[500px] md:h-[700px] w-full lg:scale-125 lg:translate-x-10">
                  <Image 
                    src={settings.aboutImage} 
                    alt="About 360 SPORT" 
                    fill 
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section id="products" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-blue mb-3 uppercase tracking-tight">Sản Phẩm Nổi Bật</h2>
              <div className="w-16 h-1 bg-brand-blue mx-auto rounded-full"></div>
              <p className="mt-4 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Khám phá các dòng sản phẩm thức uống bổ sung năng lượng và phụ kiện thể thao chất lượng cao từ 360 SPORT.
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {allProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-6 py-2.5 rounded-full font-bold transition-colors uppercase tracking-wider text-xs"
              >
                Xem Tất Cả Sản Phẩm
              </Link>
            </div>
          </div>
        </section>

        {/* Blue Info Banner Section */}
        <section className="relative bg-brand-blue text-white overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 z-0">
            <Image 
              src={settings.bannerImage} 
              alt="Runner Background" 
              fill 
              className="object-cover opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/90 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
                {settings.bannerTitle}
              </h2>
              <p className="text-sm md:text-base text-blue-100 mb-10 leading-relaxed max-w-xl">
                {settings.bannerDesc}
              </p>
              
              <Link href={settings.heroButton2Link} className="inline-flex items-center gap-3 text-white hover:text-blue-200 transition-colors group">
                <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center group-hover:border-white transition-colors">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="font-bold tracking-widest uppercase text-xs">{settings.bannerButtonText}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Cẩm Nang 360 Section */}
        <section className="py-20 bg-[#f4f7f8]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-brand-blue mb-8 uppercase tracking-tight">CẨM NANG 360</h2>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button 
                  onClick={() => setSelectedTab('Nhịp sống 360 Sport')}
                  className={`${selectedTab === 'Nhịp sống 360 Sport' ? 'bg-brand-blue text-white' : 'border border-brand-blue/30 text-brand-blue'} px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider shadow-lg shadow-brand-blue/20`}>
                  NHỊP SỐNG 360 SPORT
                </button>
                <button 
                  onClick={() => setSelectedTab('Sản phẩm mới')}
                  className={`${selectedTab === 'Sản phẩm mới' ? 'bg-brand-blue text-white' : 'border border-brand-blue/30 text-brand-blue'} px-6 py-2.5 rounded-full text-sm transition-colors font-medium`}>
                  Sản phẩm mới
                </button>
                <button 
                  onClick={() => setSelectedTab('Review sản phẩm')}
                  className={`${selectedTab === 'Review sản phẩm' ? 'bg-brand-blue text-white' : 'border border-brand-blue/30 text-brand-blue'} px-6 py-2.5 rounded-full text-sm transition-colors font-medium`}>
                  Review sản phẩm
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {allPosts.length > 0 ? allPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`} className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <Image 
                      src={post.image} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="text-xs text-gray-400 mb-3">{post.date}</div>
                    <h3 className="font-bold text-lg text-gray-500 group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              )) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                  Đang cập nhật bài viết mới nhất...
                </div>
              )}
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/blog" className="inline-flex items-center gap-3 text-gray-400 hover:text-brand-blue transition-colors group">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-brand-blue transition-colors">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="font-bold tracking-widest uppercase text-xs">XEM THÊM</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Banner Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="bg-gray-900 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 z-0">
                <Image 
                  src={settings.partnerBannerImage} 
                  alt="Banner" 
                  fill 
                  className="object-cover opacity-50"
                />
              </div>
              <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                  {settings.partnerBannerTitle}
                </h2>
                <p className="text-gray-300 mb-8 text-sm md:text-base">
                  {settings.partnerBannerDesc}
                </p>
                <Link 
                  href="/blog" 
                  className="bg-brand-blue hover:bg-brand-dark-blue text-white px-6 py-3 rounded-full font-bold text-base transition-all shadow-lg"
                >
                  {settings.partnerBannerButtonText}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Product Highlights Section */}
        <section className="py-16 bg-white border-t overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              {/* Left Image */}
              <div className="lg:w-1/2 relative">
                <div className="relative h-[400px] md:h-[600px] w-full">
                  <Image 
                    src={settings.productHighlightImage} 
                    alt="360 SPORT Player" 
                    fill 
                    className="object-contain"
                  />
                  {/* Floating Bubbles (Simulated) */}
                  <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-blue-100/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-blue-200 animate-pulse">
                    <span className="font-bold text-blue-800 text-sm transform -rotate-12">LEVAGEN</span>
                  </div>
                  <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-blue-100/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-blue-200">
                    <span className="font-bold text-blue-800 text-xs transform rotate-12 text-center">HỒNG<br/>SÂM</span>
                  </div>
                  <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-blue-100/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-blue-200">
                    <span className="font-bold text-blue-800 text-xs transform -rotate-6">TAURINE</span>
                  </div>
                </div>
              </div>

              {/* Right Features */}
              <div className="lg:w-1/2">
                <div className="grid grid-cols-2 gap-x-8 gap-y-16">
                  {/* Feature 1 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-brand-blue mb-6 shadow-[0_0_30px_rgba(0,65,130,0.15)]">
                      <MapPin className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-brand-blue uppercase tracking-wide text-sm md:text-base">
                      SẢN XUẤT HOÀN TOÀN<br/>TẠI VIỆT NAM
                    </h3>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-brand-blue mb-6 shadow-[0_0_30px_rgba(0,65,130,0.15)]">
                      <Shield className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-brand-blue uppercase tracking-wide text-sm md:text-base">
                      KHÔNG ĐƯỜNG<br/>HOÁ HỌC
                    </h3>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-brand-blue mb-6 shadow-[0_0_30px_rgba(0,65,130,0.15)]">
                      <Activity className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-brand-blue uppercase tracking-wide text-sm md:text-base">
                      KHÔNG CÓ<br/>PHẨM MÀU
                    </h3>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-brand-blue mb-6 shadow-[0_0_30px_rgba(0,65,130,0.15)]">
                      <Award className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-brand-blue uppercase tracking-wide text-sm md:text-base">
                      HÀNG VIỆT NAM<br/>CHẤT LƯỢNG CAO
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
