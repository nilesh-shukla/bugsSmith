import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

function Navigation() {
  return (
    <div className='fixed inset-0 py-4 z-50'>
      <div className="w-full flex justify-center items-center">
      <nav className="flex items-center gap-8 px-8 py-4 rounded-full backdrop-blur-xl bg-blue-400/15">
        <img src="/web-logo.png" alt="Logo" className="w-10" />
        <a href="#" className="text-white font-medium">
          Solutions
          <FontAwesomeIcon icon={faAngleDown} className='ml-1 text-[#0098cf]' />
        </a>
        <a href="#" className="text-white font-medium">About Us</a>
        <a href="#" className="text-white font-medium">Resources</a>
        <a href="#" className="text-white font-medium">Integrations</a>
        <a href="#" className="text-white font-medium">Contact Us</a>
      </nav>
    </div>
    </div>
  )
}

export default Navigation