import React from 'react'
import { ModeToggle } from './theme-toggle'

export const Navbar = () => {
  return (
    <div className='container mx-auto px-5 py-3 shadow flex justify-between items-center'>
      <div>Logo</div>
      <ModeToggle />
    </div>
  )
}
