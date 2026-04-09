'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDoc, setDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FileText, Edit2, Save, Loader2, ArrowLeft, Globe, Layout, Trash2, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface PageContent {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function PagesManager() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'pages'), (snapshot) => {
      const pagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PageContent[];
      
      setPages(pagesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (page: PageContent) => {
    setEditingPage({ ...page });
  };

  const handleSave = async () => {
    if (!editingPage) return;
    setSaving(true);

    try {
      const pageRef = doc(db, 'pages', editingPage.id);
      await setDoc(pageRef, {
        title: editingPage.title,
        content: editingPage.content,
        seoTitle: editingPage.seoTitle || '',
        seoDescription: editingPage.seoDescription || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      setEditingPage(null);
      alert("Trang đã được lưu thành công!");
    } catch (error) {
      console.error("Error saving page:", error);
      alert("Lỗi khi lưu trang.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá trang này?')) {
      try {
        await deleteDoc(doc(db, 'pages', id));
      } catch (error) {
        console.error("Error deleting page:", error);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (window.confirm(`Bạn có chắc chắn muốn xoá ${selectedIds.length} trang đã chọn?`)) {
      setIsDeleting(true);
      try {
        const batch = writeBatch(db);
        selectedIds.forEach((id) => {
          batch.delete(doc(db, 'pages', id));
        });
        await batch.commit();
        setSelectedIds([]);
        alert('Đã xoá các trang thành công!');
      } catch (error) {
        console.error("Error bulk deleting pages:", error);
        alert('Lỗi khi xoá hàng loạt.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pages.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const initializeAllPages = async () => {
    setSaving(true);
    try {
      const batch = writeBatch(db);
      
      const pagesToInit = [
        { id: 'about', title: 'Giới thiệu', content: '<h3>Giới thiệu về 360 Sport</h3><p>360 Sport là thương hiệu hàng đầu về thức uống thể thao tại Việt Nam...</p>' },
        { id: 'contact', title: 'Liên hệ', content: '<h3>Thông tin liên hệ</h3><p>Địa chỉ: 123 Đường Thể Thao, Quận 1, TP. Hồ Chí Minh<br/>Email: contact@360sport.vn<br/>Điện thoại: 090 123 4567</p>' },
        { id: 'blog', title: 'Nhịp sống 360', content: '<h3>Nhịp sống 360</h3><p>Cập nhật tin tức, sự kiện và cẩm nang thể thao mới nhất từ 360 Sport.</p>' }
      ];

      pagesToInit.forEach(page => {
        batch.set(doc(db, 'pages', page.id), {
          title: page.title,
          content: page.content,
          updatedAt: new Date().toISOString()
        });
      });

      await batch.commit();
      alert("Đã khởi tạo các trang cơ bản.");
    } catch (error) {
      console.error("Error initializing pages:", error);
      alert("Lỗi khi khởi tạo trang.");
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

  if (editingPage) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button onClick={() => setEditingPage(null)} className="mr-4 text-gray-500 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Chỉnh sửa: {editingPage.title}</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 flex items-center shadow-sm"
          >
            {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Lưu trang
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề trang</label>
            <input
              type="text"
              value={editingPage.title}
              onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-md text-lg font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nội dung trang</label>
            <RichTextEditor
              value={editingPage.content}
              onChange={(content) => setEditingPage({ ...editingPage, content })}
              placeholder="Nhập nội dung trang..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Title</label>
              <input
                type="text"
                value={editingPage.seoTitle || ''}
                onChange={(e) => setEditingPage({ ...editingPage, seoTitle: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">SEO Description</label>
              <textarea
                value={editingPage.seoDescription || ''}
                onChange={(e) => setEditingPage({ ...editingPage, seoDescription: e.target.value })}
                className="w-full px-4 py-2 border rounded-md"
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý trang tĩnh</h1>
        <div className="flex gap-4">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700 transition disabled:opacity-50"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Xoá đã chọn ({selectedIds.length})
            </button>
          )}
          {pages.length === 0 && (
            <button
              onClick={initializeAllPages}
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Layout className="w-4 h-4" /> Khởi tạo các trang cơ bản
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {pages.length > 0 && (
          <div className="flex items-center px-6 py-2 bg-gray-50 rounded-lg border border-gray-100">
            <button onClick={toggleSelectAll} className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium">
              {selectedIds.length === pages.length ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
              Chọn tất cả
            </button>
          </div>
        )}

        {pages.map((page) => (
          <div key={page.id} className={`bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between hover:border-blue-300 transition-colors ${selectedIds.includes(page.id) ? 'border-blue-300 bg-blue-50/30' : ''}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => toggleSelect(page.id)} className="text-gray-400 hover:text-blue-600 transition-colors">
                {selectedIds.includes(page.id) ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5" />}
              </button>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">{page.title}</h3>
                <p className="text-sm text-gray-500">Cập nhật lần cuối: {new Date(page.updatedAt).toLocaleString('vi-VN')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                href={page.id === 'about' ? '/about' : '#'}
                target="_blank"
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Xem trang"
              >
                <Globe className="w-5 h-5" />
              </Link>
              <button
                onClick={() => handleEdit(page)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Chỉnh sửa"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(page.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Xoá trang"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {pages.length === 0 && !loading && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
            <Layout className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có trang nào được tạo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
