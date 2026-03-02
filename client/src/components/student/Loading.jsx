import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center gap-5'>
      <div className='w-10 sm:w-16 aspect-square border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin' />

      <span className='text-blue-400/80 text-lg '>Please wait...</span>
    </div>
  )
}

export default Loading