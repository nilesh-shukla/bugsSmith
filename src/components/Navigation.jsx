import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

function Navigation() {
  return (
    <div className='fixed w-full px-12 py-6'>
      <div className='flex justify-between items-center rounded-full w-full p-4 backdrop-blur-md backdrop-brightness-75 bg-blue-300/15'>
        <div className='flex items-center gap-5'>
          <img src="/web-logo.png" alt="logo" className='w-20' />
          <ul className='flex space-x-4 items-center text-[#afafaf]'>
            <li>
              <a href='#'>Solutions</a>
              <FontAwesomeIcon icon={faAngleDown} className='ml-1' />
            </li>
            <li><a href='#'>Services</a></li>
            <li><a href="#">Resource</a></li>
            <li><a href='#'>Contact</a></li>
            <li><a href='#'></a>About Us</li>
        </ul>
        </div>
        <div className='p-2 text-xl text-[#afafaf] bg-[#40 rounded-full cursor-pointer hover:scale-110 duration-300'>
          <FontAwesomeIcon icon={faRightToBracket} />
        </div>
    </div>
    </div>
  )
}

export default Navigation