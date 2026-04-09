'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Shield, ShieldAlert, Trash2, Mail, Calendar, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/FirebaseProvider';

interface UserData {
  id: string;
  uid: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserData[];
      
      // Sort: Admins first, then by email
      usersData.sort((a, b) => {
        if (a.role === b.role) return a.email.localeCompare(b.email);
        return a.role === 'admin' ? -1 : 1;
      });
      
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: string) => {
    if (userId === currentUser?.uid) {
      alert("Bạn không thể tự thay đổi quyền của chính mình.");
      return;
    }

    const newRole = currentRole === 'admin' ? 'customer' : 'admin';
    const confirmMsg = `Bạn có chắc chắn muốn thay đổi quyền của người dùng này thành ${newRole.toUpperCase()}?`;
    
    if (window.confirm(confirmMsg)) {
      setUpdatingId(userId);
      try {
        await updateDoc(doc(db, 'users', userId), {
          role: newRole
        });
      } catch (error) {
        console.error("Error updating user role:", error);
        alert("Không thể cập nhật quyền người dùng. Vui lòng kiểm tra lại.");
      } finally {
        setUpdatingId(null);
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.uid) {
      alert("Bạn không thể xóa chính mình.");
      return;
    }

    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Không thể xóa người dùng.");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Người dùng</h1>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
          <Users className="w-4 h-4" />
          Tổng cộng: {users.length} người dùng
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Chưa có người dùng nào</h2>
          <p className="text-gray-500">Danh sách người dùng sẽ xuất hiện tại đây.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Người dùng</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vai trò</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <UserIcon className="w-6 h-6" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">{u.email}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {u.uid.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        u.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}>
                        {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleRoleChange(u.id, u.role)}
                          disabled={updatingId === u.id || u.id === currentUser?.uid}
                          title={u.role === 'admin' ? "Hạ cấp xuống Customer" : "Nâng cấp lên Admin"}
                          className={`p-2 rounded-lg transition-colors ${
                            u.id === currentUser?.uid 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : u.role === 'admin'
                                ? 'text-orange-600 hover:bg-orange-50'
                                : 'text-purple-600 hover:bg-purple-50'
                          }`}
                        >
                          {updatingId === u.id ? (
                            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                          ) : u.role === 'admin' ? (
                            <ShieldAlert className="w-5 h-5" />
                          ) : (
                            <Shield className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === currentUser?.uid}
                          className={`p-2 rounded-lg transition-colors ${
                            u.id === currentUser?.uid 
                              ? 'text-gray-300 cursor-not-allowed' 
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 flex gap-4">
        <div className="bg-amber-100 p-2 rounded-lg h-fit">
          <ShieldAlert className="w-6 h-6 text-amber-700" />
        </div>
        <div>
          <h3 className="text-amber-900 font-bold mb-1">Lưu ý về bảo mật</h3>
          <p className="text-amber-800 text-sm leading-relaxed">
            Việc cấp quyền Admin cho phép người dùng có toàn quyền quản lý sản phẩm, đơn hàng và bài viết. 
            Hãy cẩn trọng khi nâng cấp tài khoản và không bao giờ chia sẻ tài khoản Admin của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}
