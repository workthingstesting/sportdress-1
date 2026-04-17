"use client";
import { useEffect, useState } from 'react';
import { Search, Filter, RefreshCcw } from 'lucide-react';
import InventoryTable from '@/components/InventoryTable';

export default function DashboardPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async (category = '') => {
    setLoading(true);
    try {
      const url = category ? `/api/products?category=${category}` : '/api/products';
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    fetchProducts(val);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter">Control de <span className="text-neon">Inventario</span></h1>
          <p className="text-white/50 mt-1">Gestiona el stock y precios de SportDress</p>
        </div>
        
        <button 
          onClick={() => fetchProducts(selectedCategory)}
          className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-neon"
        >
          <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-4 p-6 bg-[#111] border border-white/10 rounded-2xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <input 
            type="text" 
            placeholder="Buscar productos por nombre, SKU..."
            className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-neon/50 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-2">
          <Filter size={18} className="text-white/30" />
          <select 
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="bg-transparent border-none focus:outline-none text-sm min-w-[150px]"
          >
            <option value="">Todas las Categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex justify-center italic text-white/40">Cargando existencias...</div>
        ) : (
          <InventoryTable products={products} onUpdate={fetchProducts} />
        )}
      </div>
    </div>
  );
}
