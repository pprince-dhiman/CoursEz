import React from 'react';
import { assets, dummyEducatorData } from '../../assets/assets';
import { UserButton, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const {user} = useUser();
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <div className='cursor-pointer flex items-center gap-2' onClick={() => navigate('/')}>
        <img src="/favicon.webp" alt="nav-logo" className='lg:h-8 h-7' />
        <span className='text-2xl font-semibold text-blue-600'>CoursEz</span>
      </div>

      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi! {user ? user.fullName : 'Developers'}</p>
        {
          user? <UserButton/> : <img src={assets.profile_img} className='max-w-8' />
        }
      </div>
    </div>
  )
}

export default Navbar;