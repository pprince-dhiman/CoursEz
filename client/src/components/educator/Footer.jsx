import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse
items-center justify-between text-left w-full px-8 border-t">
      <div className='flex items-center gap-4'>
        <div className='cursor-pointer flex items-center gap-2'>
          <img src="/favicon.webp" alt="nav-logo" className='lg:h-8 h-7' />
          <span className='text-2xl font-semibold text-white'>CoursEz</span>
        </div>
        <div className="hidden md:block h-7 w-px bg-gray-500/60"></div>

        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          Copyright ©2026 @coursEz. All rights reserved.
        </p>
      </div>

      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href="#">
          <img src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#">
          <img src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
          <img src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </footer >
  )
}

export default Footer;