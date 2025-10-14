import React from 'react'

function SusProfileTable({className, status, id, platform, filename}) {
    const profilestatus = {
        CRITICAL : "text-red-800",
        BOT : "text-yellow-500",
        GENUINE : "text-green-500",
        PENDING : "text-gray-500"
    }
  return (
    <div className={`grid grid-cols-4 text-sm items-center ${className}`}>
        <h1 className={`${profilestatus[status]}`}>{status}</h1>
        <p className='font-semibold' style={{fontFamily: "monospace"}}>{id}</p>
        <p>{platform.toUpperCase()}</p>
        <p>{filename}</p>
    </div>
  )
}

export default SusProfileTable