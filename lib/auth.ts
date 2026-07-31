import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "./db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Block banned users from logging in
        if (user.status === "BANNED") {
          throw new Error("BANNED");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign-in: populate token from user object
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.banned = false;
      } else if (token.id) {
        // Subsequent requests: re-check ban status from database
        // This ensures banning a logged-in user takes effect immediately
        try {
          await connectToDatabase();
          const dbUser = await User.findById(token.id).select("status").lean();
          token.banned = dbUser?.status === "BANNED";
        } catch {
          // If DB check fails, keep the existing token state
          // Do NOT default to banned to prevent lockouts on DB errors
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as "ADMIN" | "CUSTOMER";
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.banned = token.banned as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
