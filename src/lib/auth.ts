import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Verify JWT token
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<{ user: User; token: string } | null> {
  try {
    const users = await query(
      `SELECT id, email, password, name, role, avatar FROM users WHERE email = ? AND status = 'active'`,
      [email]
    );

    if ((users as any[]).length === 0) {
      return null;
    }

    const user = (users as any[])[0];
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return null;
    }

    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    };

    const token = generateToken(userData);

    return { user: userData, token };
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

// Register user
export async function registerUser(
  email: string, 
  password: string, 
  name: string, 
  role: string = 'student'
): Promise<{ user: User; token: string } | null> {
  try {
    const hashedPassword = await hashPassword(password);

    const result = await query(
      `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
      [email, hashedPassword, name, role]
    );

    const userId = (result as any).insertId;

    const userData: User = {
      id: userId,
      email,
      name,
      role
    };

    const token = generateToken(userData);

    return { user: userData, token };
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Email already exists');
    }
    console.error("Registration error:", error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const users = await query(
      `SELECT id, email, name, role, avatar FROM users WHERE id = ? AND status = 'active'`,
      [id]
    );

    if ((users as any[]).length === 0) {
      return null;
    }

    return (users as any[])[0];
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
