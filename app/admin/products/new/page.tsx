'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/admin/ImageUpload';

import RichTextEditor from '@/components/admin/RichTextEditor';

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    image: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (content: string) => {
    setFormData(prev => ({ ...prev, description: content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'products'), {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        category: formData.category,
        stock: Number(formData.stock),
        image: formData.image,
        createdAt: new Date().toISOString()
      });
      
      router.push('/admin/products');
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Link href="/admin/products" className="text-gray-500 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Thêm sản phẩm mới</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/products"
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
                  Đang lưu...
                </>
              ) : (
                'Lưu sản phẩm'
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Nhập tên sản phẩm"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mô tả sản phẩm</label>
                <RichTextEditor 
                  value={formData.description} 
                  onChange={handleDescriptionChange} 
                  placeholder="Nhập mô tả chi tiết sản phẩm..."
                />
              </div>
            </div>

            {/* Price and Inventory Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Giá và Kho hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VND) *</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (VND)</label>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    min="0"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Số lượng trong kho *</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Category Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Danh mục sản phẩm</h3>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Chọn danh mục</option>
                <option value="Máy chạy bộ">Máy chạy bộ</option>
                <option value="Xe đạp tập">Xe đạp tập</option>
                <option value="Giàn tạ đa năng">Giàn tạ đa năng</option>
                <option value="Phụ kiện thể thao">Phụ kiện thể thao</option>
              </select>
            </div>

            {/* Product Image Box */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b">Hình ảnh sản phẩm</h3>
              <ImageUpload 
                label=""
                currentImageUrl={formData.image}
                onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))}
                folder="products"
              />
              <div className="mt-4">
                <label htmlFor="image" className="block text-xs font-medium text-gray-500 mb-1">Hoặc URL ảnh:</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  placeholder="https://example.com/product.jpg"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
