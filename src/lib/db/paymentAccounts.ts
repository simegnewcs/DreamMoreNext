import { query } from "@/lib/db";

export interface PaymentAccount {
  id: number;
  method: string;
  accountNumber: string;
  accountHolder: string;
  bankName?: string;
  instructions?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAccountInput {
  method: string;
  accountNumber: string;
  accountHolder: string;
  bankName?: string;
  instructions?: string;
  isActive?: boolean;
  displayOrder?: number;
}

// Get all payment accounts
export async function getAllPaymentAccounts(): Promise<PaymentAccount[]> {
  const results = await query(
    `SELECT 
      id,
      method,
      account_number as accountNumber,
      account_holder as accountHolder,
      bank_name as bankName,
      instructions,
      is_active as isActive,
      display_order as displayOrder,
      created_at as createdAt,
      updated_at as updatedAt
    FROM payment_accounts 
    ORDER BY display_order ASC, id ASC`
  );
  return results as PaymentAccount[];
}

// Get active payment accounts only (for public display)
export async function getActivePaymentAccounts(): Promise<PaymentAccount[]> {
  const results = await query(
    `SELECT 
      id,
      method,
      account_number as accountNumber,
      account_holder as accountHolder,
      bank_name as bankName,
      instructions,
      is_active as isActive,
      display_order as displayOrder,
      created_at as createdAt,
      updated_at as updatedAt
    FROM payment_accounts 
    WHERE is_active = TRUE
    ORDER BY display_order ASC, id ASC`
  );
  return results as PaymentAccount[];
}

// Get payment account by ID
export async function getPaymentAccountById(id: number): Promise<PaymentAccount | null> {
  const results = await query(
    `SELECT 
      id,
      method,
      account_number as accountNumber,
      account_holder as accountHolder,
      bank_name as bankName,
      instructions,
      is_active as isActive,
      display_order as displayOrder,
      created_at as createdAt,
      updated_at as updatedAt
    FROM payment_accounts 
    WHERE id = ?`,
    [id]
  );
  return (results as PaymentAccount[])[0] || null;
}

// Create new payment account
export async function createPaymentAccount(data: PaymentAccountInput): Promise<PaymentAccount> {
  const result: any = await query(
    `INSERT INTO payment_accounts (
      method, account_number, account_holder, bank_name, 
      instructions, is_active, display_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.method,
      data.accountNumber,
      data.accountHolder,
      data.bankName || null,
      data.instructions || null,
      data.isActive !== false, // default true
      data.displayOrder || 0
    ]
  );
  
  const newAccount = await getPaymentAccountById(result.insertId);
  if (!newAccount) {
    throw new Error("Failed to create payment account");
  }
  return newAccount;
}

// Update payment account
export async function updatePaymentAccount(
  id: number, 
  data: Partial<PaymentAccountInput>
): Promise<PaymentAccount | null> {
  const fields: string[] = [];
  const values: any[] = [];
  
  if (data.method !== undefined) {
    fields.push("method = ?");
    values.push(data.method);
  }
  if (data.accountNumber !== undefined) {
    fields.push("account_number = ?");
    values.push(data.accountNumber);
  }
  if (data.accountHolder !== undefined) {
    fields.push("account_holder = ?");
    values.push(data.accountHolder);
  }
  if (data.bankName !== undefined) {
    fields.push("bank_name = ?");
    values.push(data.bankName);
  }
  if (data.instructions !== undefined) {
    fields.push("instructions = ?");
    values.push(data.instructions);
  }
  if (data.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(data.isActive);
  }
  if (data.displayOrder !== undefined) {
    fields.push("display_order = ?");
    values.push(data.displayOrder);
  }
  
  if (fields.length === 0) {
    return getPaymentAccountById(id);
  }
  
  values.push(id);
  
  await query(
    `UPDATE payment_accounts SET ${fields.join(", ")} WHERE id = ?`,
    values
  );
  
  return getPaymentAccountById(id);
}

// Delete payment account
export async function deletePaymentAccount(id: number): Promise<boolean> {
  const result: any = await query(
    "DELETE FROM payment_accounts WHERE id = ?",
    [id]
  );
  return result.affectedRows > 0;
}

// Toggle account active status
export async function togglePaymentAccountStatus(id: number, isActive: boolean): Promise<boolean> {
  const result: any = await query(
    "UPDATE payment_accounts SET is_active = ? WHERE id = ?",
    [isActive, id]
  );
  return result.affectedRows > 0;
}
