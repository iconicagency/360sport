'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useSettings } from "@/components/SettingsProvider";

export default function ContactPage() {
  const { settings } = useSettings();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPage() {
      try {
        const docRef = doc(db, 'pages', 'contact');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPageData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching contact page:", error);
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

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-brand-blue text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 uppercase tracking-tight">Liên hệ</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với 360 SPORT qua các kênh thông tin dưới đây.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Thông tin liên hệ</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-brand-blue rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 uppercase text-sm mb-1">Địa chỉ</h3>
                      <p className="text-gray-600">{settings.contactAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-brand-blue rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 uppercase text-sm mb-1">Điện thoại</h3>
                      <p className="text-gray-600">{settings.contactPhone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 text-brand-blue rounded-xl flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 uppercase text-sm mb-1">Email</h3>
                      <p className="text-gray-600">{settings.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {pageData && pageData.content && (
                <div className="prose prose-blue max-w-none pt-8 border-t" dangerouslySetInnerHTML={{ __html: pageData.content }}></div>
              )}
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-tight">Gửi tin nhắn cho chúng tôi</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none" placeholder="Nguyễn Văn A" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none" placeholder="0901234567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none" placeholder="Tôi muốn tư vấn về sản phẩm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                  <textarea rows={4} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none" placeholder="Nhập nội dung tin nhắn..."></textarea>
                </div>
                <button type="button" className="w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-dark-blue transition shadow-lg flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" /> Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
