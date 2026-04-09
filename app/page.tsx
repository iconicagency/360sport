import { Metadata } from 'next';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import HomePage from './HomePage';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const docRef = doc(db, 'settings', 'site');
    const docSnap = await getDoc(docRef);
    const settings = docSnap.exists() ? docSnap.data() : null;
    
    return {
      title: settings?.seoTitle || '360 Sport - Thức uống tăng lực bù khoáng, bù điện giải',
      description: settings?.seoDescription || '360 SPORT - Thức uống tăng lực bù khoáng, bù điện giải hàng đầu Việt Nam. Hỗ trợ phục hồi năng lượng và cơ bắp sau tập luyện.',
    };
  } catch (error) {
    return {
      title: '360 Sport - Thức uống tăng lực bù khoáng, bù điện giải',
      description: '360 SPORT - Thức uống tăng lực bù khoáng, bù điện giải hàng đầu Việt Nam. Hỗ trợ phục hồi năng lượng và cơ bắp sau tập luyện.',
    };
  }
}

export default function Home() {
  return <HomePage />;
}
