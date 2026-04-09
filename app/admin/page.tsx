'use client';

import { useEffect, useState } from 'react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Package, FileText, ShoppingCart, Users, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    blogPosts: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [productsSnap, blogSnap, ordersSnap, usersSnap] = await Promise.all([
          getCountFromServer(collection(db, 'products')),
          getCountFromServer(collection(db, 'blogPosts')),
          getCountFromServer(collection(db, 'orders')),
          getCountFromServer(collection(db, 'users')),
        ]);

        setStats({
          products: productsSnap.data().count,
          blogPosts: blogSnap.data().count,
          orders: ordersSnap.data().count,
          users: usersSnap.data().count,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500', link: '/admin/products' },
    { name: 'Blog Posts', value: stats.blogPosts, icon: FileText, color: 'bg-green-500', link: '/admin/blog' },
    { name: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-purple-500', link: '/admin/orders' },
    { name: 'Site Settings', value: 'Configure', icon: Lock, color: 'bg-gray-700', link: '/admin/settings' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.name} href={stat.link} className="bg-white rounded-lg shadow-sm p-6 flex items-center hover:shadow-md transition">
                <div className={`p-4 rounded-full ${stat.color} text-white mr-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Welcome to 360 Sport Admin</h2>
        <p className="text-gray-600">
          This is your administrative dashboard. From here, you can manage your products, blog posts, and view customer orders.
          Use the sidebar navigation to access different sections of the admin panel.
        </p>
      </div>
    </div>
  );
}
