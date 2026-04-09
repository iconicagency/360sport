'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Plus, Edit, Trash2, FileText, CheckSquare, Square, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'blogPosts'), (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching blog posts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá bài viết này?')) {
      try {
        await deleteDoc(doc(db, 'blogPosts', id));
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (window.confirm(`Bạn có chắc chắn muốn xoá ${selectedIds.length} bài viết đã chọn?`)) {
      setIsDeleting(true);
      try {
        const batch = writeBatch(db);
        selectedIds.forEach((id) => {
          batch.delete(doc(db, 'blogPosts', id));
        });
        await batch.commit();
        setSelectedIds([]);
        alert('Đã xoá các bài viết thành công!');
      } catch (error) {
        console.error("Error bulk deleting posts:", error);
        alert('Lỗi khi xoá hàng loạt.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bài viết</h1>
        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 transition disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Trash2 className="w-5 h-5 mr-2" />}
              Xoá đã chọn ({selectedIds.length})
            </button>
          )}
          <Link href="/admin/blog/new" className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition">
            <Plus className="w-5 h-5 mr-2" />
            Thêm bài viết
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Không tìm thấy bài viết</h2>
          <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo bài viết đầu tiên của bạn.</p>
          <Link href="/admin/blog/new" className="bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center hover:bg-blue-700 transition">
            <Plus className="w-5 h-5 mr-2" />
            Thêm bài viết
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <button onClick={toggleSelectAll} className="text-gray-500 hover:text-blue-600 transition-colors">
                    {selectedIds.length === posts.length ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài viết</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Hành động</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className={selectedIds.includes(post.id) ? 'bg-blue-50/30' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => toggleSelect(post.id)} className="text-gray-400 hover:text-blue-600 transition-colors">
                      {selectedIds.includes(post.id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-16 relative rounded overflow-hidden">
                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 truncate max-w-xs">{post.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link href={`/blog/${post.id}`} target="_blank" className="text-gray-400 hover:text-gray-600 mr-4 inline-block" title="Xem trên trang web">
                      <FileText className="w-5 h-5" />
                    </Link>
                    <Link href={`/admin/blog/${post.id}`} className="text-blue-600 hover:text-blue-900 mr-4 inline-block">
                      <Edit className="w-5 h-5" />
                    </Link>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
