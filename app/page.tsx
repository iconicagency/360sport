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

export default function Home() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDbProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const allProducts = [...dbProducts, ...products].slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://picsum.photos/seed/360sport-hero/1920/800" 
              alt="Hero Background" 
              fill 
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-block bg-[#f97316] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-4">
                SẢN PHẨM MỚI
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
                THỨC UỐNG TĂNG LỰC <br/>
                <span className="text-[#f97316]">BÙ KHOÁNG BÙ ĐIỆN GIẢI</span>
              </h1>
              <p className="text-base md:text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
                Sản phẩm 360 SPORT được nghiên cứu dựa trên thể trạng và nhu cầu của người Việt. Bổ sung năng lượng tức thì, hỗ trợ phục hồi cơ bắp sau tập luyện.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="#products" 
                  className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold text-base transition-all flex items-center gap-2 shadow-lg shadow-orange-500/30"
                >
                  Mua Ngay <ArrowRight className="h-4 w-4" />
                </Link>
                <Link 
                  href="/about" 
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-full font-bold text-base transition-all"
                >
                  Tìm Hiểu Thêm
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
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-400 uppercase tracking-tight">
                  Về 360 SPORT
                </h2>
                
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-20 shrink-0 flex flex-col items-center text-center">
                      <div className="w-12 h-12 mb-2 flex items-center justify-center text-gray-700">
                        <Hexagon className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Công thức<br/>độc đáo</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Là sản phẩm đầu tiên trên thị trường Việt Nam với sự kết hợp của Levagen +, Hồng Sâm và các chất điện giải.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-20 shrink-0 flex flex-col items-center text-center">
                      <div className="w-12 h-12 mb-2 flex items-center justify-center text-gray-700">
                        <Activity className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Công dụng<br/>tối ưu</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Bù nước điện giải, tăng cường sinh lực, ngăn ngừa nguy cơ chuột rút.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-20 shrink-0 flex flex-col items-center text-center">
                      <div className="w-12 h-12 mb-2 flex items-center justify-center text-gray-700">
                        <Leaf className="w-8 h-8" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Không sử<br/>dụng đường<br/>hóa học</span>
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Sử dụng &quot;Đường cỏ ngọt&quot; đáp ứng nhu cầu khắt khe nhất trong việc kiểm soát cân nặng và đường huyết.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/about" className="inline-flex items-center gap-3 text-gray-400 hover:text-[#f97316] transition-colors group">
                    <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#f97316] transition-colors">
                      <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="font-bold tracking-widest uppercase text-xs">Xem Thêm</span>
                  </Link>
                </div>
              </div>

              <div className="lg:w-1/2 relative mt-10 lg:mt-0">
                <div className="relative h-[500px] md:h-[700px] w-full lg:scale-125 lg:translate-x-10">
                  <Image 
                    src="https://picsum.photos/seed/soccer-kick/1000/1000" 
                    alt="Soccer Player Kicking" 
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
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 uppercase tracking-tight">Sản Phẩm Nổi Bật</h2>
              <div className="w-16 h-1 bg-[#f97316] mx-auto rounded-full"></div>
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
        <section className="relative bg-[#1e4b8f] text-white overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://picsum.photos/seed/runner-blue/1920/800" 
              alt="Runner Background" 
              fill 
              className="object-cover opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1e4b8f] via-[#1e4b8f]/90 to-transparent"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
                THỨC UỐNG BỔ SUNG<br/>
                NĂNG LƯỢNG<br/>
                TĂNG LỰC, BÙ KHOÁNG,<br/>
                BÙ ĐIỆN GIẢI
              </h2>
              <p className="text-sm md:text-base text-blue-100 mb-10 leading-relaxed max-w-xl">
                Sản phẩm 360 SPORT được nghiên cứu dựa trên thể trạng và nhu cầu của người Việt. Với các thành phần tối ưu 360 SPORT là sản phẩm tăng lực, bù khoáng, bù điện giải đầu tiên trên thị trường Việt Nam sử dụng LEVAGEN+ kết hợp với Hồng Sâm, Đường cỏ ngọt và các chất điện giải tạo nên công thức độc đáo có công dụng ngăn ngừa nguy cơ chuột rút, hỗ trợ phục hồi cơ bắp và giảm mệt mỏi sau tập luyện.
              </p>
              
              <Link href="/about" className="inline-flex items-center gap-3 text-white hover:text-blue-200 transition-colors group">
                <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center group-hover:border-white transition-colors">
                  <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="font-bold tracking-widest uppercase text-xs">XEM THÊM</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Cẩm Nang 360 Section */}
        <section className="py-20 bg-[#f4f7f8]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-400 mb-8 uppercase tracking-tight">CẨM NANG 360</h2>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button className="bg-gray-400 text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider">
                  NHỊP SỐNG 360 SPORT
                </button>
                <button className="border border-gray-300 text-gray-600 hover:border-gray-400 px-6 py-2.5 rounded-full text-sm transition-colors">
                  Sản phẩm mới
                </button>
                <button className="border border-gray-300 text-gray-600 hover:border-gray-400 px-6 py-2.5 rounded-full text-sm transition-colors">
                  Review sản phẩm
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Article 1 */}
              <Link href="/blog/1" className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image 
                    src="https://picsum.photos/seed/blog1/600/450" 
                    alt="Blog 1" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-gray-400 mb-3">11.09.2025</div>
                  <h3 className="font-bold text-lg text-gray-500 group-hover:text-[#f97316] transition-colors leading-snug">
                    360Sport đồng hành cùng những nhà vô địch Ultra Trail Yên Tử 2025: Tôn vinh sức mạnh bền bỉ
                  </h3>
                </div>
              </Link>

              {/* Article 2 */}
              <Link href="/blog/2" className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image 
                    src="https://picsum.photos/seed/blog2/600/450" 
                    alt="Blog 2" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-gray-400 mb-3">11.09.2025</div>
                  <h3 className="font-bold text-lg text-gray-500 group-hover:text-[#f97316] transition-colors leading-snug">
                    Tinh thần bền bỉ tại Ultra Trail Yên Tử 2025 – Khi 360Sport tiếp sức cho từng bước chạy
                  </h3>
                </div>
              </Link>

              {/* Article 3 */}
              <Link href="/blog/3" className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col h-full">
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image 
                    src="https://picsum.photos/seed/blog3/600/450" 
                    alt="Blog 3" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-xs text-gray-400 mb-3">11.09.2025</div>
                  <h3 className="font-bold text-lg text-gray-500 group-hover:text-[#f97316] transition-colors leading-snug">
                    360Sport đồng hành cùng Ultra Trail Yên Tử 2025: Tiếp sức hơn 1.000 vận động viên khám phá di sản
                  </h3>
                </div>
              </Link>
            </div>
            
            <div className="mt-12 text-center">
              <Link href="/blog" className="inline-flex items-center gap-3 text-gray-400 hover:text-[#f97316] transition-colors group">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center group-hover:border-[#f97316] transition-colors">
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
                  src="https://picsum.photos/seed/360sport-banner/1200/600" 
                  alt="Banner" 
                  fill 
                  className="object-cover opacity-50"
                />
              </div>
              <div className="relative z-10 p-8 md:p-16 flex flex-col items-center text-center max-w-2xl mx-auto">
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                  ĐỒNG HÀNH CÙNG MỌI <br/>
                  <span className="text-[#f97316]">GIẢI ĐẤU THỂ THAO</span>
                </h2>
                <p className="text-gray-300 mb-8 text-sm md:text-base">
                  360 SPORT tự hào là nhà tài trợ và đồng hành cùng nhiều giải chạy marathon, trail và các sự kiện thể thao lớn trên toàn quốc.
                </p>
                <Link 
                  href="/blog" 
                  className="bg-[#f97316] hover:bg-orange-600 text-white px-6 py-3 rounded-full font-bold text-base transition-all shadow-lg"
                >
                  Đọc Nhịp Sống 360
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
                    src="https://picsum.photos/seed/360sport-player/800/800" 
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
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-500 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <MapPin className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-gray-700 uppercase tracking-wide text-sm md:text-base">
                      SẢN XUẤT HOÀN TOÀN<br/>TẠI VIỆT NAM
                    </h3>
                  </div>

                  {/* Feature 2 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-500 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <Shield className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-gray-700 uppercase tracking-wide text-sm md:text-base">
                      KHÔNG ĐƯỜNG<br/>HOÁ HỌC
                    </h3>
                  </div>

                  {/* Feature 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-500 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <Activity className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-gray-700 uppercase tracking-wide text-sm md:text-base">
                      KHÔNG CÓ<br/>PHẨM MÀU
                    </h3>
                  </div>

                  {/* Feature 4 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-500 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                      <Award className="w-10 h-10" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-bold text-gray-700 uppercase tracking-wide text-sm md:text-base">
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
