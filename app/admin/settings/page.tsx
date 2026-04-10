'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Save, Loader2, Image as ImageIcon, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Palette, Type, Layout, Globe } from 'lucide-react';
import ImageUpload from '@/components/admin/ImageUpload';
import { SiteSettings } from '@/components/SettingsProvider';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'home' | 'contact' | 'social' | 'seo'>('general');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'settings', 'site');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SiteSettings);
        } else {
          // Initialize with defaults if not exists
          const defaultSettings: SiteSettings = {
            brandBlue: '#004182',
            brandOrange: '#f58220',
            logoImage: '/logo.png',
            faviconImage: '/favicon.ico',
            seoTitle: '360 Sport - Thức uống tăng lực bù khoáng, bù điện giải',
            seoDescription: '360 SPORT - Thức uống tăng lực bù khoáng, bù điện giải hàng đầu Việt Nam. Hỗ trợ phục hồi năng lượng và cơ bắp sau tập luyện.',
            heroTitle: 'THỨC UỐNG TĂNG LỰC BÙ KHOÁNG BÙ ĐIỆN GIẢI',
            heroSubtitle: 'Sản phẩm 360 SPORT được nghiên cứu dựa trên thể trạng và nhu cầu của người Việt. Bổ sung năng lượng tức thì, hỗ trợ phục hồi cơ bắp sau tập luyện.',
            heroImage: 'https://picsum.photos/seed/360sport-hero/1920/800',
            heroButton1Text: 'Mua Ngay',
            heroButton1Link: '#products',
            heroButton2Text: 'Tìm Hiểu Thêm',
            heroButton2Link: '/about',
            aboutImage: 'https://picsum.photos/seed/soccer-kick/1000/1000',
            bannerImage: 'https://picsum.photos/seed/runner-blue/1920/800',
            bannerTitle: 'THỨC UỐNG BỔ SUNG NĂNG LƯỢNG TĂNG LỰC, BÙ KHOÁNG, BÙ ĐIỆN GIẢI',
            bannerDesc: 'Sản phẩm 360 SPORT được nghiên cứu dựa trên thể trạng và nhu cầu của người Việt. Với các thành phần tối ưu 360 SPORT là sản phẩm tăng lực, bù khoáng, bù điện giải đầu tiên trên thị trường Việt Nam sử dụng LEVAGEN+ kết hợp với Hồng Sâm, Đường cỏ ngọt và các chất điện giải tạo nên công thức độc đáo có công dụng ngăn ngừa nguy cơ chuột rút, hỗ trợ phục hồi cơ bắp và giảm mệt mỏi sau tập luyện.',
            bannerButtonText: 'XEM THÊM',
            partnerBannerImage: 'https://picsum.photos/seed/360sport-banner/1200/600',
            partnerBannerTitle: 'ĐỒNG HÀNH CÙNG MỌI GIẢI ĐẤU THỂ THAO',
            partnerBannerDesc: '360 SPORT tự hào là nhà tài trợ và đồng hành cùng nhiều giải chạy marathon, trail và các sự kiện thể thao lớn trên toàn quốc.',
            partnerBannerButtonText: 'Đọc Nhịp Sống 360',
            productHighlightImage: 'https://picsum.photos/seed/360sport-player/800/800',
            featuredProductIds: [],
            contactPhone: '090 123 4567',
            contactEmail: 'contact@360sport.vn',
            contactAddress: '123 Đường Thể Thao, Quận 1, TP. Hồ Chí Minh',
            facebookUrl: 'https://facebook.com/360sport',
            instagramUrl: 'https://instagram.com/360sport',
            youtubeUrl: 'https://youtube.com/360sport',
            footerDescription: '360 SPORT tự hào là thương hiệu thức uống thể thao hàng đầu Việt Nam, đồng hành cùng mọi giải đấu và tinh thần bền bỉ của người Việt.'
          };
          setSettings(defaultSettings);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleImageChange = (name: keyof SiteSettings, url: string) => {
    setSettings(prev => prev ? ({ ...prev, [name]: url }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);

    try {
      await setDoc(doc(db, 'settings', 'site'), settings);
      alert("Cài đặt đã được lưu thành công!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Lỗi khi lưu cài đặt.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cài đặt hệ thống</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center shadow-sm"
        >
          {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Lưu thay đổi
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'general' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Palette className="w-4 h-4" /> Chung & Màu sắc
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'home' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Layout className="w-4 h-4" /> Trang chủ
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'contact' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Phone className="w-4 h-4" /> Liên hệ
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'social' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Facebook className="w-4 h-4" /> Mạng xã hội
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-6 py-4 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'seo' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Globe className="w-4 h-4" /> SEO
          </button>
        </div>

        <div className="p-8">
          {settings && (
            <div className="space-y-8">
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Logo thương hiệu</label>
                    <ImageUpload
                      label=""
                      currentImageUrl={settings.logoImage}
                      onUploadComplete={(url) => handleImageChange('logoImage', url)}
                      folder="settings"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Favicon</label>
                    <ImageUpload
                      label=""
                      currentImageUrl={settings.faviconImage}
                      onUploadComplete={(url) => handleImageChange('faviconImage', url)}
                      folder="settings"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Màu thương hiệu (Xanh)</label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        name="brandBlue"
                        value={settings.brandBlue}
                        onChange={handleChange}
                        className="h-10 w-20 p-1 rounded border"
                      />
                      <input
                        type="text"
                        name="brandBlue"
                        value={settings.brandBlue}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Màu thương hiệu (Cam)</label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        name="brandOrange"
                        value={settings.brandOrange}
                        onChange={handleChange}
                        className="h-10 w-20 p-1 rounded border"
                      />
                      <input
                        type="text"
                        name="brandOrange"
                        value={settings.brandOrange}
                        onChange={handleChange}
                        className="flex-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả chân trang (Footer)</label>
                    <textarea
                      name="footerDescription"
                      rows={3}
                      value={settings.footerDescription}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    ></textarea>
                  </div>
                </div>
              )}

              {activeTab === 'home' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề Hero</label>
                        <input
                          type="text"
                          name="heroTitle"
                          value={settings.heroTitle}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Phụ đề Hero</label>
                        <textarea
                          name="heroSubtitle"
                          rows={3}
                          value={settings.heroSubtitle}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nút Hero 1</label>
                          <input type="text" name="heroButton1Text" value={settings.heroButton1Text} onChange={handleChange} className="w-full px-3 py-2 border rounded-md mb-2" placeholder="Text" />
                          <input type="text" name="heroButton1Link" value={settings.heroButton1Link} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="Link" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Nút Hero 2</label>
                          <input type="text" name="heroButton2Text" value={settings.heroButton2Text} onChange={handleChange} className="w-full px-3 py-2 border rounded-md mb-2" placeholder="Text" />
                          <input type="text" name="heroButton2Link" value={settings.heroButton2Link} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="Link" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh Hero</label>
                      <ImageUpload
                        label=""
                        currentImageUrl={settings.heroImage}
                        onUploadComplete={(url) => handleImageChange('heroImage', url)}
                        folder="settings"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh phần &quot;Về 360 Sport&quot;</label>
                      <ImageUpload
                        label=""
                        currentImageUrl={settings.aboutImage}
                        onUploadComplete={(url) => handleImageChange('aboutImage', url)}
                        folder="settings"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề Banner</label>
                      <input type="text" name="bannerTitle" value={settings.bannerTitle} onChange={handleChange} className="w-full px-3 py-2 border rounded-md mb-2" />
                      <textarea name="bannerDesc" rows={3} value={settings.bannerDesc} onChange={handleChange} className="w-full px-3 py-2 border rounded-md mb-2"></textarea>
                      <input type="text" name="bannerButtonText" value={settings.bannerButtonText} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh Banner</label>
                      <ImageUpload
                        label=""
                        currentImageUrl={settings.bannerImage}
                        onUploadComplete={(url) => handleImageChange('bannerImage', url)}
                        folder="settings"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề Banner Đối tác</label>
                      <input type="text" name="partnerBannerTitle" value={settings.partnerBannerTitle} onChange={handleChange} className="w-full px-3 py-2 border rounded-md mb-2" />
                      <textarea name="partnerBannerDesc" rows={3} value={settings.partnerBannerDesc} onChange={handleChange} className="w-full px-3 py-2 border rounded-md mb-2"></textarea>
                      <input type="text" name="partnerBannerButtonText" value={settings.partnerBannerButtonText} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh Banner Đối tác</label>
                      <ImageUpload
                        label=""
                        currentImageUrl={settings.partnerBannerImage}
                        onUploadComplete={(url) => handleImageChange('partnerBannerImage', url)}
                        folder="settings"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Sản phẩm nổi bật (ID, cách nhau bằng dấu phẩy)</label>
                      <input type="text" name="featuredProductIds" value={Array.isArray(settings.featuredProductIds) ? settings.featuredProductIds.join(',') : ''} onChange={(e) => setSettings({...settings, featuredProductIds: e.target.value.split(',')})} className="w-full px-3 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Ảnh Nổi bật Sản phẩm</label>
                      <ImageUpload
                        label=""
                        currentImageUrl={settings.productHighlightImage}
                        onUploadComplete={(url) => handleImageChange('productHighlightImage', url)}
                        folder="settings"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone className="w-4 h-4" /> Số điện thoại
                    </label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={settings.contactPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={settings.contactEmail}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="contactAddress"
                      value={settings.contactAddress}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'social' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Facebook className="w-4 h-4" /> Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebookUrl"
                      value={settings.facebookUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Instagram className="w-4 h-4" /> Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagramUrl"
                      value={settings.instagramUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Youtube className="w-4 h-4" /> Youtube URL
                    </label>
                    <input
                      type="url"
                      name="youtubeUrl"
                      value={settings.youtubeUrl}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="grid grid-cols-1 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề SEO</label>
                    <input
                      type="text"
                      name="seoTitle"
                      value={settings.seoTitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả SEO</label>
                    <textarea
                      name="seoDescription"
                      rows={3}
                      value={settings.seoDescription}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
