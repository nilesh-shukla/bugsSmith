import React from 'react'

function FileFeatureCards({className, heading, children}) {
  return (
    <div className={`w-full bg-gray-100 rounded-2xl p-4 ${className}`}>
      <h1 className='text-2xl text-[#789] mb-2' style={{fontWeight: 500}}>{heading}</h1>
      <hr className='text-gray-400' />
      {children}
    </div>
  )
}

export default FileFeatureCards