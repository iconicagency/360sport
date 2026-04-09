'use client';

import { useState } from 'react';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, Search, Type } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import ImageUpload from '@/components/admin/ImageUpload';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface Category {
  id: string;
  name: string;
}

export default function AddBlogPost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    image: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const q = query(collection(db, 'categories'), where('type', '==', 'post'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const cats = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      setCategories(cats);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const date = new Date();
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      
      await addDoc(collection(db, 'blogPosts'), {
        ...formData,
        date: formattedDate,
        createdAt: date.toISOString(),
        authorId: auth.currentUser?.uid || 'unknown'
      });
      
      router.push('/admin/blog');
    } catch (error) {
      console.error("Error adding blog post:", error);
      alert("Failed to add blog post. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Link href="/admin/blog" className="text-gray-500 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Thêm bài viết mới</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/blog"
              className="bg-white text-gray-700 px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center shadow-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Đang đăng...
                </>
              ) : (
                'Đăng bài viết'
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề bài viết</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  placeholder="Nhập tiêu đề tại đây"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung bài viết</label>
                <RichTextEditor 
                  value={formData.content} 
                  onChange={handleContentChange} 
                  placeholder="Bắt đầu viết nội dung tuyệt vời của bạn..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Category Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Chuyên mục</h3>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Chọn chuyên mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
                {categories.length === 0 && (
                  <>
                    <option value="NHỊP SỐNG 360 SPORT">NHỊP SỐNG 360 SPORT</option>
                    <option value="Sản phẩm mới">Sản phẩm mới</option>
                    <option value="Review sản phẩm">Review sản phẩm</option>
                  </>
                )}
              </select>
            </div>

            {/* SEO Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" /> Tối ưu SEO
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="seoTitle" className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Type className="w-3 h-3" /> SEO Title
                  </label>
                  <input
                    type="text"
                    id="seoTitle"
                    name="seoTitle"
                    value={formData.seoTitle}
                    onChange={handleChange}
                    placeholder="Tiêu đề hiển thị trên Google"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="seoDescription" className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                    <Search className="w-3 h-3" /> SEO Description
                  </label>
                  <textarea
                    id="seoDescription"
                    name="seoDescription"
                    rows={3}
                    value={formData.seoDescription}
                    onChange={handleChange}
                    placeholder="Mô tả ngắn hiển thị trên Google"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="seoKeywords" className="block text-xs font-medium text-gray-500 mb-1">
                    Từ khóa (cách nhau bởi dấu phẩy)
                  </label>
                  <input
                    type="text"
                    id="seoKeywords"
                    name="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={handleChange}
                    placeholder="sport, drink, health"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Featured Image Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Ảnh đại diện</h3>
              <ImageUpload 
                label=""
                currentImageUrl={formData.image}
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))}
                folder="blog"
              />
              <div className="mt-4">
                <label htmlFor="image" className="block text-xs font-medium text-gray-500 mb-1">Hoặc URL ảnh:</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs"
                />
              </div>
            </div>

            {/* Excerpt Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Tóm tắt bài viết</h3>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                rows={4}
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="Nhập đoạn tóm tắt ngắn..."
              ></textarea>
              <p className="text-[10px] text-gray-400 mt-2 italic">
                Đoạn tóm tắt này sẽ hiển thị ngoài danh sách bài viết.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
