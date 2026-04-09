'use client';

import { useState, useEffect, use } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

import RichTextEditor from '@/components/admin/RichTextEditor';

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    date: '',
    category: '',
  });

  useEffect(() => {
    async function fetchPost() {
      try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            image: data.image || '',
            date: data.date || '',
            category: data.category || '',
          });
        } else {
          router.push('/admin/blog');
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateDoc(doc(db, 'blogPosts', id), {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        date: formData.date,
        category: formData.category,
      });
      
      router.push('/admin/blog');
    } catch (error) {
      console.error("Error updating blog post:", error);
      alert("Failed to update blog post. See console for details.");
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
    <div className="max-w-[1400px] mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Link href="/admin/blog" className="text-gray-500 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa bài viết</h1>
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
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật bài viết'
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
                <option value="NHỊP SỐNG 360 SPORT">NHỊP SỐNG 360 SPORT</option>
                <option value="Sản phẩm mới">Sản phẩm mới</option>
                <option value="Review sản phẩm">Review sản phẩm</option>
              </select>
            </div>

            {/* Date Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Ngày hiển thị</h3>
              <input
                type="text"
                id="date"
                name="date"
                required
                placeholder="11.09.2025"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
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
