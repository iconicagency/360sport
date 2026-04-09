'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { blogPosts as hardcodedPosts } from '@/data/blogPosts';

export default function BlogPage() {
  const [dbPosts, setDbPosts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogPosts'));
        const fetchedPosts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDbPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      }
    }
    fetchPosts();
  }, []);

  const allPosts = [...dbPosts, ...hardcodedPosts];

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-brand-blue">Nhịp sống 360 SPORT</h1>
          <div className="w-24 h-1 bg-brand-blue mt-4 mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Cập nhật những tin tức sự kiện mới nhất, kiến thức thể thao và hành trình đồng hành cùng cộng đồng của 360 SPORT.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
              <Link href={`/blog/${post.id}`} className="relative h-56 overflow-hidden group">
                <div className="absolute top-4 left-4 z-10 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </div>
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  referrerPolicy="no-referrer"
                />
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-gray-500 mb-3 font-medium">{post.date}</div>
                <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-brand-blue transition-colors leading-snug">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                <Link href={`/blog/${post.id}`} className="text-brand-blue font-bold text-sm uppercase tracking-wider hover:underline flex items-center gap-1 mt-auto">
                  Đọc tiếp &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
