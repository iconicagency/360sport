'use client';

import { useState } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { products } from '@/data/products';
import { blogPosts } from '@/data/blogPosts';
import { Database, Loader2, CheckCircle2 } from 'lucide-react';

export default function BootstrapButton() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleBootstrap = async () => {
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const batch = writeBatch(db);
      let count = 0;

      // Bootstrap Products
      const productsSnap = await getDocs(collection(db, 'products'));
      if (productsSnap.empty) {
        products.forEach((product) => {
          const newDocRef = doc(collection(db, 'products'));
          batch.set(newDocRef, {
            ...product,
            id: newDocRef.id,
            description: product.name, // Fallback description
            stock: 100,
            createdAt: new Date().toISOString()
          });
          count++;
        });
      }

      // Bootstrap Blog Posts
      const blogSnap = await getDocs(collection(db, 'blogPosts'));
      if (blogSnap.empty) {
        blogPosts.forEach((post) => {
          const newDocRef = doc(collection(db, 'blogPosts'));
          batch.set(newDocRef, {
            ...post,
            id: newDocRef.id,
            content: post.content || post.excerpt,
            createdAt: new Date().toISOString(),
            authorId: 'system'
          });
          count++;
        });
      }

      if (count > 0) {
        await batch.commit();
        setStatus('success');
        setMessage(`Successfully added ${count} items to the database.`);
      } else {
        setStatus('idle');
        setMessage('Database already has data. No changes made.');
      }
    } catch (error: any) {
      console.error('Bootstrap error:', error);
      setStatus('error');
      setMessage(error.message || 'An error occurred during bootstrap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 border border-blue-100 bg-blue-50 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Khởi tạo dữ liệu mẫu
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Nếu bạn thấy danh sách Sản phẩm hoặc Blog trống, hãy nhấn nút này để nạp dữ liệu mẫu vào Firestore.
          </p>
        </div>
        <button
          onClick={handleBootstrap}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : status === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <Database className="w-5 h-5" />
          )}
          {loading ? 'Đang nạp...' : status === 'success' ? 'Đã nạp xong' : 'Nạp dữ liệu'}
        </button>
      </div>
      {message && (
        <p className={`mt-3 text-sm font-medium ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-blue-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
}
