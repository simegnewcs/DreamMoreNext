import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { query } from "./db";
import { sendVerificationEmail } from "./email";

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
      `SELECT id, email, password, name, role, avatar, email_verified FROM users WHERE email = ? AND status = 'active'`,
      [email]
    );

    if ((users as any[]).length === 0) {
      return null;
    }

    const user = (users as any[])[0];
    const isValid = await verifyPassword(password, user.password);

    if (!isValid || user.email_verified !== true && user.email_verified !== 1) {
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
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const result = await query(
      `INSERT INTO users (email, password, name, role, email_verified, verification_token, verification_expires_at) VALUES (?, ?, ?, ?, 0, ?, ?)`,
      [email, hashedPassword, name, role, verificationToken, verificationExpiresAt]
    );

    const userId = (result as any).insertId;

    const userData: User = {
      id: userId,
      email,
      name,
      role
    };

    const emailSent = await sendVerificationEmail(email, name, verificationToken);
    if (!emailSent) {
      throw new Error("Failed to send verification email");
    }

    const token = generateToken(userData);

    return { user: userData, token };
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Email already exists') {
      throw error;
    }
    if (error instanceof Error && error.message === 'Failed to send verification email') {
      throw error;
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

// Change password
export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  try {
    // Get user's current password
    const users = await query(
      `SELECT password FROM users WHERE id = ? AND status = 'active'`,
      [userId]
    );

    if ((users as any[]).length === 0) {
      return false;
    }

    const user = (users as any[])[0];
    const isValid = await verifyPassword(currentPassword, user.password);

    if (!isValid) {
      return false;
    }

    // Hash new password and update
    const hashedPassword = await hashPassword(newPassword);
    await query(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, userId]
    );

    return true;
  } catch (error) {
    console.error("Change password error:", error);
    return false;
  }
}
