import { useState } from 'react'

function Solutions({sol_heading, describe, }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(prev => !prev);
    }

  return (
    <div className='p-8 bg-gradient-to-br from-transparent via-[#1e3a4f]/30 to-[#1e3a4f]/40 rounded-lg border border-[#1e3a4f] outfit-font overflow-hidden' onClick={toggleOpen}>
        <h1 className='text-4xl text-[#4f6dae]'>{sol_heading}</h1>
        <p className={`text-[#A0AEC0] ${isOpen ? 'max-h-40 mt-1' : 'max-h-0'}`}>{describe}</p>
    </div>
  )
}

export default Solutions