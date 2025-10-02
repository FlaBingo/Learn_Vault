import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { db } from "@/drizzle/db"
import { accounts, sessions, UsersTable, verificationTokens } from "@/drizzle/schema"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: UsersTable,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [GitHub, Google],
  // still not understood, what's happening below
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    }
  }
})