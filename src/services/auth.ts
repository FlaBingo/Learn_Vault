import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { db } from "@/drizzle/db"
import { accounts, UsersTable } from "@/drizzle/schema"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: UsersTable,
    accountsTable: accounts
  }),
  providers: [GitHub, Google],
})