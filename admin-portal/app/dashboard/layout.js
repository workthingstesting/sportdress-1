"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Package, LogOut, Settings, BarChart3 } from 'lucide-react';

export default function DashboardLayout({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem('isLoggedIn');
    if (!auth) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  if (!isLoggedIn) return null;

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-neon text-black flex items-center justify-center rounded font-bold">S</div>
          <span className="font-bold tracking-tighter text-xl">SPORT<span className="text-neon">DRESS</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg bg-neon text-black font-bold transition-colors">
            <LayoutDashboard size={20} />
            Inventario
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <BarChart3 size={20} />
            Ventas
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Package size={20} />
            Productos
          </button>
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Settings size={20} />
            Ajustes
          </button>
          <button 
            onClick={() => { localStorage.removeItem('isLoggedIn'); router.push('/login'); }}
            className="flex items-center gap-3 w-full p-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
