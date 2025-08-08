"use client"
import React from 'react'
import { ModeToggle } from './theme-toggle'
import SignIn from './sign-in'
import { Button } from './ui/button'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

export const Navbar = () => {
  const {data} = useSession();
  return (
    <div className='container mx-auto px-5 py-3 shadow flex justify-between items-center'>
      <div>Logo</div>
      <div className='flex gap-3'>
        <ModeToggle />
        {data ? (
          <Button onClick={() => signOut()}>
            Logout
          </Button>
        ) : (
          <Link href={"/login"}>
            <Button>
              Login
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
