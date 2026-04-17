"use client";
import { useState } from 'react';
import { Edit2, Save, Trash2, X, ChevronDown, ChevronRight } from 'lucide-react';

export default function InventoryTable({ products, onUpdate }) {
  // Grouping products by ID to handle variants
  const groupedProducts = products.reduce((acc, current) => {
    if (!acc[current.id]) {
        acc[current.id] = {
            ...current,
            variants: []
        };
    }
    if (current.variante_id) {
        acc[current.id].variants.push({
            id: current.variante_id,
            talla: current.talla,
            color: current.color,
            cantidad: current.cantidad,
            sku: current.sku
        });
    }
    return acc;
  }, {});

  const productList = Object.values(groupedProducts);

  const [editingId, setEditingId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    const newSet = new Set(expandedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedIds(newSet);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setTempPrice(product.precio);
  };

  const handleSavePrice = async (id) => {
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, precio: parseFloat(tempPrice) })
      });
      if (res.ok) {
        setEditingId(null);
        onUpdate();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const DeactivateProduct = async (id) => {
    if (!confirm('¿Seguro que deseas desactivar este producto? Dejará de mostrarse en la tienda.')) return;
    try {
      const res = await fetch('/api/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, activo: false })
      });
      if (res.ok) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-white/50 text-xs uppercase tracking-widest font-bold">
          <tr>
            <th className="p-5 w-10"></th>
            <th className="p-5">Producto</th>
            <th className="p-5">Categoría</th>
            <th className="p-5 text-right">Precio</th>
            <th className="p-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productList.map(product => (
            <React.Fragment key={product.id}>
              <tr className="border-t border-white/5 hover:bg-white/[0.02] transition-colors group">
                <td className="p-5">
                   <button onClick={() => toggleExpand(product.id)} className="text-white/30 hover:text-neon">
                     {expandedIds.has(product.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                   </button>
                </td>
                <td className="p-5">
                  <div className="font-bold">{product.nombre}</div>
                  <div className="text-xs text-white/40 truncate max-w-[300px]">{product.descripcion}</div>
                </td>
                <td className="p-5">
                  <span className="px-3 py-1 bg-white/5 rounded-full text-xs border border-white/10 uppercase font-medium">
                    {product.categoria_nombre}
                  </span>
                </td>
                <td className="p-5 text-right">
                  {editingId === product.id ? (
                    <div className="flex items-center justify-end gap-2">
                       <span className="text-neon">$</span>
                       <input 
                        type="number" 
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        className="bg-black border border-neon w-20 text-right p-1 rounded focus:outline-none"
                        autoFocus
                       />
                    </div>
                  ) : (
                    <span className="font-mono text-xl font-bold">${parseFloat(product.precio).toFixed(2)}</span>
                  )}
                </td>
                <td className="p-5 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === product.id ? (
                        <>
                          <button onClick={() => handleSavePrice(product.id)} className="p-2 bg-neon rounded-lg text-black hover:scale-110 transition-transform">
                            <Save size={18} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors">
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEdit(product)} className="p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:border-neon/50 hover:text-neon transition-all">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={() => DeactivateProduct(product.id)} className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all">
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                </td>
              </tr>
              {/* Variants sub-table */}
              {expandedIds.has(product.id) && (
                <tr>
                   <td colSpan="5" className="px-5 pb-5 pt-0 bg-white/[0.01]">
                     <div className="border-x border-b border-white/5 rounded-b-xl overflow-hidden">
                       <table className="w-full bg-black/40 text-xs">
                         <thead className="bg-white/5 text-white/30 font-medium">
                           <tr>
                             <th className="p-3 text-center">Talla</th>
                             <th className="p-3 text-center">Color</th>
                             <th className="p-3 text-center">Stock</th>
                             <th className="p-3">SKU</th>
                           </tr>
                         </thead>
                         <tbody>
                           {product.variants.length > 0 ? product.variants.map((v, i) => (
                             <tr key={i} className="border-t border-white/5">
                               <td className="p-3 text-center font-bold">{v.talla}</td>
                               <td className="p-3 text-center">
                                 <div className="flex items-center justify-center gap-2">
                                    <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: v.color.toLowerCase() }}></div>
                                    {v.color}
                                 </div>
                               </td>
                               <td className="p-3 text-center">
                                 <span className={v.cantidad < 5 ? 'text-red-500 font-bold' : 'text-neon/70 font-bold'}>
                                   {v.cantidad}
                                 </span>
                               </td>
                               <td className="p-2 font-mono text-white/40">{v.sku}</td>
                             </tr>
                           )) : (
                             <tr><td colSpan="4" className="p-5 text-center text-white/20 italic">No hay variantes registradas</td></tr>
                           )}
                         </tbody>
                       </table>
                     </div>
                   </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Senior realization: Need to import React for Fragments in modern JS if used this way,
// although Next.js usually handles it.
import React from 'react';
