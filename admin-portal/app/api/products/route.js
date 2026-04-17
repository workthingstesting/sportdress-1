import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category');
  
  try {
    let query = `
      SELECT 
        p.id, p.nombre, p.descripcion, p.precio, p.activo,
        c.nombre as categoria_nombre,
        sv.id as variante_id, sv.talla, sv.color, sv.cantidad, sv.sku
      FROM productos p
      JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN stock_variantes sv ON p.id = sv.producto_id
      WHERE p.activo = true
    `;
    
    const params = [];
    if (categoryId) {
      query += ` AND p.categoria_id = $1`;
      params.push(categoryId);
    }
    
    query += ` ORDER BY p.id DESC`;
    
    const result = await sql(query, params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { id, precio, activo } = body;
    
    if (precio !== undefined) {
      // Update price for product and all variants inherit it visually in the table
      await sql(`UPDATE productos SET precio = $1 WHERE id = $2`, [precio, id]);
    }
    
    if (activo !== undefined) {
      await sql(`UPDATE productos SET activo = $1 WHERE id = $2`, [activo, id]);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}
