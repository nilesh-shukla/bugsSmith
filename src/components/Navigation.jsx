import React from 'react'

function Navigation() {
  return (
    <div className='fixed rounded-xl backdrop-blur-md '>
        <ul className='flex space-x-4 p-4'>
            <li><a href='#'>Home</a></li>
            <li><a href='#'>About</a></li>
            <li><a href='#'>Services</a></li>
            <li><a href='#'>Contact</a></li>
        </ul>
    </div>
  )
}

export default Navigation