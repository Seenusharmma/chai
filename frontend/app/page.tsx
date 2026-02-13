'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import HomeScreen from '@/components/home/HomeScreen';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen pb-20 md:pb-0 bg-[#1A1410]">
      <Header />
      <div className="pt-20">
        <HomeScreen
          onOrderNow={() => router.push('/menu')}
        />
      </div>
      <Footer />
    </main>
  );
}
