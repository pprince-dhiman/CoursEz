import React from 'react'
import Hero from './Hero'
import Companies from './Companies'

const Background = () => {
  return (
    <div className="bg-[url('/LMS-bg.png')] bg-cover bg-center bg-no-repeat w-full">
        <Hero />
        <Companies />
    </div>
  )
}

export default Background