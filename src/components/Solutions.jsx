
function Solutions({sol_heading, describe, className, isActive, onToggle}) {

  return (
    <div 
            className={`p-8 outfit-font hover:cursor-pointer transition-all duration-300 z-[99] ${className} ${isActive ? 'bg-gradient-to-br from-[#1e3a4f] via-[#1e3a4f]/30 to-transparent rounded-lg border border-[#1e3a4f]' : 'bg-transparent border-transparent'}`} onClick={onToggle}
        >
            <div className="flex items-center justify-between">
                <h1 className='text-4xl text-[#4f6dae]'>{sol_heading}</h1>
            </div>
            <p className={`text-[#A0AEC0] leading-relaxed transition-all overflow-hidden ease-in-out duration-300 ${isActive ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                {describe}
            </p>
        </div>
  )
}
export default Solutions