import React from 'react'

function IntegerateCard({className, image, heading, describe, tag}) {
  return (
    <div className={`bg-[#6d8bab] p-4 border-2 border-transparent hover:border-blue-100 cursor-pointer transition-all duration-300 flex flex-col gap-4 justify-center items-center rounded-3xl ${className}`}>
        <img src={image} className='w-20 h-20 bg-white border-2 border-gray-400 p-3 rounded-4xl'/>
        <div className='flex flex-col justify-center items-center'>
            <h1 className='text-center text-xl font-semibold text-[#b2c8d2]'>{heading}</h1>
            <p className='text-center text-sm text-white leading-tight'>{describe}</p>
        </div>
    </div>
  )
}

export default IntegerateCard