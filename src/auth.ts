import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { query } from "@/lib/db";
import { generateToken } from "@/lib/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existing = await query(
            `SELECT id, email, name, role FROM users WHERE email = ?`,
            [user.email]
          );
          if ((existing as any[]).length === 0) {
            await query(
              `INSERT INTO users (email, name, password, role, avatar, status) VALUES (?, ?, '', 'student', ?, 'active')`,
              [user.email, user.name || "", user.image || ""]
            );
          } else {
            await query(
              `UPDATE users SET avatar = ? WHERE email = ?`,
              [user.image || "", user.email]
            );
          }
        } catch (err) {
          // Log but never block sign-in due to DB error
          console.error("Google sign-in DB upsert error:", err);
        }
      }
      return true;
    },

    async jwt({ token, account, user }) {
      if (account?.provider === "google" && user?.email) {
        try {
          const rows = await query(
            `SELECT id, email, name, role, avatar FROM users WHERE email = ?`,
            [user.email]
          );
          const dbUser = (rows as any[])[0];
          if (dbUser) {
            token.id = dbUser.id;
            token.role = dbUser.role;
            token.dbToken = generateToken(dbUser);
          }
        } catch {}
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role || "student";
        (session.user as any).dbToken = token.dbToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
