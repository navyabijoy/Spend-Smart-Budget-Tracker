"use client"

import React from 'react'
import { useUser } from '@clerk/nextjs';
import LoadingSpinner from '@/loading/page';
import { Button } from '@/components/ui/button';

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded) return <LoadingSpinner />

  if (!isSignedIn) return <div>Please sign in</div>
  
  const checkWorking = () => {
    console.log('working')
  }
  return (
    
    <main className='container mx-auto p-4'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-xl font-semibold'>Your Dashboard</h1>
        <Button onClick={checkWorking} className='cursor-pointer'>Add Expense</Button>
      </div>
    </main>
  )
}

