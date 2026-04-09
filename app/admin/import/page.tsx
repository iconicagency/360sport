'use client';

import { useState } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { XMLParser } from 'fast-xml-parser';
import { Upload, FileCode, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ImportPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error' | 'processing';
    message: string;
    details?: { posts: number; products: number; errors: number };
  }>({ type: 'idle', message: '' });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus({ type: 'processing', message: 'Đang đọc tệp XML...' });

    try {
      const text = await file.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        textNodeName: "#text",
      });
      const jsonObj = parser.parse(text);

      const items = jsonObj.rss?.channel?.item;
      if (!items) {
        throw new Error('Không tìm thấy dữ liệu bài viết hoặc sản phẩm trong tệp XML này.');
      }

      const itemsArray = Array.isArray(items) ? items : [items];
      
      // 1. First pass: Collect all attachments (images)
      const attachments = new Map<string, string>();
      itemsArray.forEach((item: any) => {
        if (item['wp:post_type'] === 'attachment') {
          const id = item['wp:post_id'];
          const url = item['wp:attachment_url'] || (typeof item['guid'] === 'object' ? item['guid']?.['#text'] : item['guid']);
          if (id && url) attachments.set(String(id), url);
        }
      });

      let postsCount = 0;
      let productsCount = 0;
      let errorsCount = 0;

      setStatus({ type: 'processing', message: `Đang xử lý ${itemsArray.length} mục...` });

      // 2. Second pass: Process posts and products
      for (const item of itemsArray) {
        try {
          const postType = item['wp:post_type'];
          if (postType !== 'post' && postType !== 'product') continue;

          // Helper to get meta value
          const getMeta = (key: string) => {
            const meta = item['wp:postmeta'];
            if (!meta) return null;
            const metaArray = Array.isArray(meta) ? meta : [meta];
            const found = metaArray.find((m: any) => m['wp:meta_key'] === key);
            return found ? found['wp:meta_value'] : null;
          };

          // Helper to get category
          const getCategory = (domain: string) => {
            const cats = item['category'];
            if (!cats) return 'Chưa phân loại';
            const catsArray = Array.isArray(cats) ? cats : [cats];
            const found = catsArray.find((c: any) => c['@_domain'] === domain);
            if (!found) return 'Chưa phân loại';
            return typeof found === 'string' ? found : (found['#text'] || found['@_nicename'] || 'Chưa phân loại');
          };

          // Get thumbnail URL
          const thumbId = getMeta('_thumbnail_id');
          const imageUrl = thumbId ? attachments.get(String(thumbId)) : null;

          // Get SEO fields
          const seoTitle = getMeta('rank_math_title') || getMeta('_yoast_wpseo_title') || '';
          const seoDescription = getMeta('rank_math_description') || getMeta('_yoast_wpseo_metadesc') || '';
          const seoKeywords = getMeta('rank_math_focus_keyword') || getMeta('_yoast_wpseo_focuskw') || '';

          // Get Category
          const categoryName = getCategory(postType === 'post' ? 'category' : 'product_cat');

          // Ensure category exists in categories collection
          if (categoryName && categoryName !== 'Chưa phân loại') {
            const catQuery = query(
              collection(db, 'categories'), 
              where('name', '==', categoryName),
              where('type', '==', postType)
            );
            const catSnap = await getDocs(catQuery);
            if (catSnap.empty) {
              await addDoc(collection(db, 'categories'), {
                name: categoryName,
                slug: categoryName.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
                type: postType,
                createdAt: new Date().toISOString()
              });
            }
          }

          if (postType === 'post') {
            const postDate = item['wp:post_date'] ? new Date(item['wp:post_date']) : new Date();
            const validDate = isNaN(postDate.getTime()) ? new Date() : postDate;
            
            await addDoc(collection(db, 'blogPosts'), {
              title: (item['title'] || 'Không tiêu đề').toString().substring(0, 490),
              content: item['content:encoded'] || '',
              excerpt: (item['excerpt:encoded'] || (item['content:encoded'] ? item['content:encoded'].substring(0, 150) + '...' : '')).toString().substring(0, 1900),
              category: categoryName.toString().substring(0, 190),
              image: (imageUrl || 'https://picsum.photos/seed/blog/800/600').toString().substring(0, 990),
              date: validDate.toLocaleDateString('vi-VN'),
              createdAt: validDate.toISOString(),
              authorId: auth.currentUser?.uid || 'imported',
              seoTitle: seoTitle.toString().substring(0, 500),
              seoDescription: seoDescription.toString().substring(0, 1000),
              seoKeywords: seoKeywords.toString().substring(0, 500)
            });
            postsCount++;
          } else if (postType === 'product') {
            const rawPrice = getMeta('_price') || getMeta('_regular_price') || 0;
            const price = isNaN(Number(rawPrice)) ? 0 : Number(rawPrice);
            const rawSalePrice = getMeta('_sale_price');
            const salePrice = rawSalePrice && !isNaN(Number(rawSalePrice)) ? Number(rawSalePrice) : null;
            
            const postDate = item['wp:post_date'] ? new Date(item['wp:post_date']) : new Date();
            const validDate = isNaN(postDate.getTime()) ? new Date() : postDate;

            await addDoc(collection(db, 'products'), {
              name: (item['title'] || 'Sản phẩm không tiêu đề').toString().substring(0, 490),
              description: item['content:encoded'] || '',
              price: price,
              originalPrice: salePrice,
              category: categoryName.toString().substring(0, 190),
              stock: 10, // Default stock
              image: (imageUrl || 'https://picsum.photos/seed/product/800/600').toString().substring(0, 990),
              createdAt: validDate.toISOString(),
              seoTitle: seoTitle.toString().substring(0, 500),
              seoDescription: seoDescription.toString().substring(0, 1000),
              seoKeywords: seoKeywords.toString().substring(0, 500)
            });
            productsCount++;
          }
        } catch (e) {
          console.error("Error importing item:", e, item);
          errorsCount++;
        }
      }

      setStatus({ 
        type: 'success', 
        message: `Nhập dữ liệu thành công!`, 
        details: { posts: postsCount, products: productsCount, errors: errorsCount } 
      });
    } catch (error: any) {
      console.error('Import error:', error);
      setStatus({ type: 'error', message: error.message || 'Đã xảy ra lỗi khi nhập dữ liệu.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href="/admin" className="text-gray-500 hover:text-gray-900 mr-4">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Nhập dữ liệu từ WordPress</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Hướng dẫn nhập dữ liệu</h2>
          <p className="text-gray-600 mb-4">
            Bạn có thể nhập bài viết và sản phẩm từ WordPress bằng cách sử dụng tệp xuất XML (WXR).
          </p>
          <ul className="list-disc list-inside text-sm text-gray-500 space-y-2">
            <li>Vào trang quản trị WordPress của bạn.</li>
            <li>Chọn <strong>Công cụ (Tools)</strong> &gt; <strong>Xuất (Export)</strong>.</li>
            <li>Chọn <strong>Tất cả nội dung</strong> hoặc riêng <strong>Bài viết</strong> / <strong>Sản phẩm</strong>.</li>
            <li>Tải tệp XML về và tải lên tại đây.</li>
          </ul>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center hover:border-blue-400 transition-colors bg-gray-50">
          <input
            type="file"
            id="xml-upload"
            accept=".xml"
            className="hidden"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <label htmlFor="xml-upload" className="cursor-pointer flex flex-col items-center">
            {loading ? (
              <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-4" />
            ) : (
              <Upload className="w-16 h-16 text-gray-400 mb-4" />
            )}
            <span className="text-lg font-medium text-gray-900">
              {loading ? 'Đang xử lý...' : 'Chọn tệp XML để tải lên'}
            </span>
            <span className="text-sm text-gray-500 mt-2">Hỗ trợ định dạng .xml (WordPress WXR)</span>
          </label>
        </div>

        {status.type !== 'idle' && (
          <div className={`mt-8 p-6 rounded-lg flex items-start gap-4 ${
            status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' :
            status.type === 'error' ? 'bg-red-50 text-red-800 border border-red-100' :
            'bg-blue-50 text-blue-800 border border-blue-100'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> :
             status.type === 'error' ? <AlertCircle className="w-6 h-6 shrink-0" /> :
             <Loader2 className="w-6 h-6 shrink-0 animate-spin" />}
            
            <div>
              <p className="font-bold">{status.message}</p>
              {status.details && (
                <div className="mt-2 text-sm opacity-90">
                  <p>- Đã nhập {status.details.posts} bài viết.</p>
                  <p>- Đã nhập {status.details.products} sản phẩm.</p>
                  {status.details.errors > 0 && <p className="text-red-600 font-bold">- Có {status.details.errors} mục bị lỗi (xem console).</p>}
                </div>
              )}
              {status.type === 'success' && (
                <div className="mt-4 flex gap-4">
                  <Link href="/admin/blog" className="text-sm font-bold underline">Xem bài viết</Link>
                  <Link href="/admin/products" className="text-sm font-bold underline">Xem sản phẩm</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
