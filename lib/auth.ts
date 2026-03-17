import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
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
          console.log("[Auth] Missing email or password in credentials");
          return null;
        }

        console.log("[Auth] Login attempt:", credentials.email);

        try {
          await connectDB();
        } catch (err: any) {
          console.error("[Auth] MongoDB connection failed:", err.message);
          throw new Error("Database connection failed. Is MongoDB running?");
        }

        // Find user by email
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          console.log("[Auth] User not found:", credentials.email);
          throw new Error("User not found");
        }

        console.log("[Auth] User found:", {
          id: user._id,
          email: user.email,
          role: user.role,
          hasPassword: !!user.password,
        });

        // Compare password with bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log("[Auth] Password match:", isValid);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        console.log("[Auth] Login successful for:", user.email);

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          city: user.city,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.city = (user as any).city;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).city = token.city;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
