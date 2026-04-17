"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Trophy } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Senior realization: Use a simple mock login for now as requested
    if (username === 'admin' && password === 'sportdress2026') {
      localStorage.setItem('isLoggedIn', 'true');
      router.push('/dashboard');
    } else {
      setError('Credenciales invalidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-max-md bg-[#111] border border-white/10 p-8 rounded-2xl shadow-2xl">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-neon p-4 rounded-full mb-4">
            <Trophy className="text-black w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">SPORT<span className="text-neon">DRESS</span> ADMIN</h1>
          <p className="text-white/50 mt-2">Panel de Control de Inventario</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-neon transition-colors"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-neon transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-neon text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            INICIAR SESIÓN
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-8">
          © 2026 SportDress Performance . All rights reserved.
        </p>
      </div>
    </div>
  );
}
