'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useState, useEffect, use } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogPostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const docRef = doc(db, 'blogPosts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Check hardcoded posts if not in DB (fallback)
          // For now just redirect if not found in DB
          router.push('/blog');
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <Loader2 className="animate-spin h-12 w-12 text-brand-blue" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-white">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[400px] md:h-[500px] w-full">
          <Image 
            src={post.image} 
            alt={post.title} 
            fill 
            className="object-cover" 
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/50 flex items-end">
            <div className="container mx-auto px-4 pb-12">
              <Link href="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại Blog
              </Link>
              <div className="max-w-4xl">
                <div className="inline-block bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
                  {post.category}
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    360 SPORT
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Excerpt */}
            <div className="text-xl text-gray-600 font-medium leading-relaxed mb-12 border-l-4 border-brand-blue pl-6 italic">
              {post.excerpt}
            </div>

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none prose-img:rounded-2xl prose-headings:text-brand-blue prose-a:text-brand-blue"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Footer Meta */}
            <div className="mt-16 pt-8 border-t flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Chuyên mục:</span>
                <span className="text-sm font-bold text-brand-blue uppercase tracking-wider">{post.category}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Chia sẻ:</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-80 transition">f</button>
                  <button className="w-8 h-8 rounded-full bg-sky-400 text-white flex items-center justify-center hover:opacity-80 transition">t</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
