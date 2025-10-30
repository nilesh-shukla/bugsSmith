import React from 'react'

function Article({className, image, title, heading, description, link}) {
  return (
    <div className={`flex flex-col gap-6 group hover:cursor-pointer rounded-xl overflow-hidden ${className}`}>
      <a href={link} target='blank'>
        <div className='w-full rounded-xl border border-[#1e3a4f] overflow-hidden'>
            <img src={image} className='w-full scale-100 group-hover:scale-110 transition-transform duration-300 h-60 md:h-full xl:h-80' />
        </div>
        <div className='flex flex-col gap-1'>
            <h1 className='text-[#2f6893]'>{title}</h1>
            <h2 className='text-2xl text-[#728492] group-hover:underline'>{heading}</h2>
            <p className='text-sm text-[#b2cee4]'>{description}</p>
        </div>

      </a>
    </div>
  )
}

export default Article