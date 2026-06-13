import { query } from "@/lib/db";

export interface TrustedBrand {
  id: number;
  name: string;
  logo: string;
  createdAt?: string;
  updatedAt?: string;
}

// Get all trusted brands
export async function getAllBrands(): Promise<TrustedBrand[]> {
  const results = await query(
    `SELECT 
      id, 
      name, 
      logo, 
      created_at as createdAt,
      updated_at as updatedAt
    FROM trusted_brands 
    ORDER BY id DESC`
  );
  return results as TrustedBrand[];
}

// Get brand by ID
export async function getBrandById(id: number): Promise<TrustedBrand | null> {
  const results = await query(
    `SELECT 
      id, 
      name, 
      logo, 
      created_at as createdAt,
      updated_at as updatedAt
    FROM trusted_brands 
    WHERE id = ?`,
    [id]
  );
  const brands = results as TrustedBrand[];
  return brands.length > 0 ? brands[0] : null;
}

// Create new trusted brand
export async function createBrand(brand: { name: string; logo: string }): Promise<TrustedBrand> {
  const result: any = await query(
    `INSERT INTO trusted_brands (name, logo) VALUES (?, ?)`,
    [brand.name, brand.logo]
  );
  
  const newBrand = await getBrandById(result.insertId);
  if (!newBrand) throw new Error('Failed to create brand');
  return newBrand;
}

// Update trusted brand
export async function updateBrand(id: number, brand: { name?: string; logo?: string }): Promise<TrustedBrand | null> {
  const updates: string[] = [];
  const values: any[] = [];
  
  if (brand.name !== undefined) {
    updates.push('name = ?');
    values.push(brand.name);
  }
  if (brand.logo !== undefined) {
    updates.push('logo = ?');
    values.push(brand.logo);
  }
  
  if (updates.length === 0) return await getBrandById(id);
  
  values.push(id);
  
  await query(
    `UPDATE trusted_brands SET ${updates.join(', ')} WHERE id = ?`,
    values
  );
  
  return await getBrandById(id);
}

// Delete trusted brand
export async function deleteBrand(id: number): Promise<boolean> {
  const result: any = await query('DELETE FROM trusted_brands WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
