import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Cards({className, icon, iconHeading, figures, description}) {
  return (
    <div className={`p-8 outfit-font bg-gradient-to-b from-transparent via-[#1e3a4f]/30 to-[#1e3a4f]/40 border border-[#3a5a7a] rounded-xl flex flex-col ${className}`}>
      <div className='flex gap-2 items-center'>
        <div className='bg-gradient-to-br from-black/40 to-[#116bd8] p-1 items-center rounded-full'>
          <FontAwesomeIcon icon={icon} className='text-2xl text-[#65a2ed]' />
        </div>
        <h1 className='text-white text-lg'>{iconHeading}</h1>
      </div>

      <h1 className='text-gray-100 text-[3rem] mb-2'>{figures}</h1>

      <p className='text-gray-100'>{description}</p>

    </div>
  )
}

export default Cards