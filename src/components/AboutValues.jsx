import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AboutValues({className, icon, heading, describe}) {
  return (
    <div className='flex flex-col gap-2 items-center text-center'>
        <div className='bg-blue '>
            <FontAwesomeIcon icon={icon} className='text-[3rem] text-[#0f76a2]' />
        </div>
        <h1 className='text-2xl text-white'>{heading}</h1>
        <p className='text-[#86acb1]'>{describe}</p>
    </div>
  )
}

export default AboutValues