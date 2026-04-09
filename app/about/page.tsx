'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, Zap, Droplets, HeartPulse, Activity, Target, Loader2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AboutPage() {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const docRef = doc(db, 'pages', 'about');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPageData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching about page:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  // If dynamic content exists, render it. Otherwise render the default static content.
  if (pageData && pageData.content) {
    return (
      <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
        <Header />
        <main className="flex-grow">
          <div className="relative bg-brand-blue text-white py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <Image 
                src="https://picsum.photos/seed/360about-hero/1920/800" 
                alt="About Hero" 
                fill 
                className="object-cover opacity-20 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue to-transparent"></div>
            </div>
            <div className="container mx-auto px-4 relative z-10 text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 uppercase tracking-tight">{pageData.title}</h1>
              <div className="w-24 h-1.5 bg-brand-blue mx-auto rounded-full mb-6"></div>
            </div>
          </div>

          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="prose prose-lg max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: pageData.content }}></div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Hero About */}
        <div className="relative bg-brand-blue text-white py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://picsum.photos/seed/360about-hero/1920/800" 
              alt="About Hero" 
              fill 
              className="object-cover opacity-20 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-blue to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 uppercase tracking-tight">Giới thiệu</h1>
            <div className="w-24 h-1.5 bg-brand-blue mx-auto rounded-full mb-6"></div>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium">
              Về 360 Sport
            </p>
          </div>
        </div>

        {/* Ingredients Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">LEVAGEN +</h3>
                <p className="text-gray-600 leading-relaxed">
                  LEVAGEN+ giúp giảm đau và chống viêm tự nhiên, giúp giảm đau cơ và viêm nhanh chóng, hỗ trợ quá trình phục hồi sau tập luyện.
                </p>
              </div>

              <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Droplets className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">Các khoáng chất Na+, K+, Mg, Cl-, Ca,…</h3>
                <p className="text-gray-600 leading-relaxed">
                  Bổ sung các khoáng chất như Na+, K+, Mg, Cl-, Ca,… hỗ trợ phục hồi nhanh chóng sau khi tập luyện, ngăn chặn mất nước và mất cân bằng điện giải, tối ưu hóa hiệu suất.
                </p>
              </div>

              <div className="bg-blue-50/50 p-8 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <HeartPulse className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 uppercase">Hồng Sâm</h3>
                <p className="text-gray-600 leading-relaxed">
                  Hồng sâm thường được biết đến với nhiều lợi ích sức khỏe như tăng cường hệ miễn dịch cũng như sức đề kháng để cải thiện khả năng tập trung và giảm mệt mỏi, hỗ trợ quản lý đường huyết, cũng như cải thiện sức khỏe tim mạch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold text-brand-blue tracking-widest uppercase mb-2">Câu chuyện thương hiệu</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase">360 SPORT THỨC UỐNG BỔ SUNG NĂNG LƯỢNG MỚI</h3>
            </div>
            
            <div className="prose prose-lg mx-auto text-gray-700">
              <h4 className="text-xl font-bold text-gray-900 mb-4 uppercase">Nghiên cứu và phát triển</h4>
              <p className="mb-6 leading-relaxed">
                Sản phẩm 360 SPORT được nghiên cứu dựa trên thể trạng và nhu cầu của người Việt. Với các thành phần tối ưu 360 SPORT là sản phẩm tăng lực, bù khoáng, bù điện giải đầu tiên trên thị trường Việt Nam sử dụng LEVAGEN+ kết hợp với Hồng Sâm, Đường cỏ ngọt và các chất điện giải tạo nên công thức độc đáo có công dụng ngăn ngừa nguy cơ chuột rút, hỗ trợ phục hồi cơ bắp và giảm mệt mỏi sau tập luyện.
              </p>
              <p className="mb-6 leading-relaxed">
                Chúng tôi với mong muốn thay đổi thói quen sử dụng nước của người Việt và mang đến giải pháp an toàn nhất cho việc uống nước và bổ sung khoáng chất thường xuyên. Thành Quân Healthcare mong muốn truyền tải những giá trị tích cực đến cộng đồng người Việt, nâng cao chất lượng chăm sóc sức khỏe và từ đó nâng cao chất lượng cuộc sống.
              </p>
              <p className="mb-6 leading-relaxed">
                Vì lẽ đó sản phẩm 360 SPORT ra đời nhằm đem tới giải pháp bổ sung nước hiệu quả cho cộng đồng Việt. Cải thiện sức khoẻ nhờ việc bổ sung nước có chứa các hoạt chất, khoáng chất cần thiết và ưu việt giúp cơ thể có thêm nhiều năng lượng phục vụ cho mọi hoạt động đời thường cũng như trong luyện tập thể thao.
              </p>
              <p className="mb-6 leading-relaxed font-medium text-brand-blue text-xl border-l-4 border-brand-blue pl-6 py-2 bg-white rounded-r-lg shadow-sm">
                360 SPORT ra đời với phương châm đồng hành cùng cộng đồng Việt để hướng tới một tương lai tốt đẹp hơn.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Value & Features */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Brand Value */}
              <div>
                <h2 className="text-sm font-bold text-brand-blue tracking-widest uppercase mb-2">Giá trị thương hiệu</h2>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase mb-6">Hàng Việt Nam chất lượng cao</h3>
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 leading-relaxed">
                    Sản phẩm 360 SPORT được sản xuất tại Công ty cổ phần Dược phẩm Fresh Life, có quy trình và quy chuẩn rõ ràng theo yêu cầu tiêu chuẩn của Bộ Y tế, hệ thống máy móc hiện đại cùng các Dược sĩ đầu ngành trực tiếp chỉ đạo sản xuất và đội ngũ nhân sự dày dặn kinh nghiệm được trang bị những bộ đồ bảo hộ tiệt trùng sát khuẩn quy chuẩn theo đúng quy định đảm bảo an toàn và vệ sinh.
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <ShieldCheck className="w-12 h-12 text-brand-blue" />
                    <span className="font-bold text-gray-900 uppercase">Thương hiệu sản xuất hoàn toàn tại Việt Nam</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-sm font-bold text-brand-blue tracking-widest uppercase mb-2">Đặc điểm nổi bật</h2>
                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 uppercase mb-6">Tại sao chọn 360 SPORT?</h3>
                
                <ul className="space-y-4 mb-12">
                  <li className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-blue shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-800 uppercase">Không phẩm màu</span>
                  </li>
                  <li className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-blue shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-800 uppercase">Không đường hoá học</span>
                  </li>
                  <li className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-blue shadow-sm">
                      <Zap className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-gray-800 uppercase">Bổ sung năng lượng tức thì</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Target Audience */}
        <section className="py-16 md:py-24 bg-brand-blue text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold uppercase mb-4">Đối tượng sử dụng</h2>
              <div className="w-24 h-1 bg-white mx-auto rounded-full mb-6"></div>
              <p className="text-blue-100 text-lg">360 SPORT phù hợp cho nhiều đối tượng:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                <Target className="w-10 h-10 text-white mb-6" />
                <h3 className="text-xl font-bold mb-3">Người luyện tập thể thao</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Giúp tăng cường hiệu suất hỗ trợ phục hồi sau luyện tập.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                <Activity className="w-10 h-10 text-white mb-6" />
                <h3 className="text-xl font-bold mb-3">Người vận động thể chất nhiều</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Cung cấp năng lượng và duy trì tỉnh táo.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                <Droplets className="w-10 h-10 text-white mb-6" />
                <h3 className="text-xl font-bold mb-3">Người di chuyển thường xuyên</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Bổ sung khoáng chất và điện giải chống mệt mỏi.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                <Zap className="w-10 h-10 text-white mb-6" />
                <h3 className="text-xl font-bold mb-3">Nhân viên văn phòng, học sinh, sinh viên</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Giúp tập trung học và làm việc hiệu quả.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
