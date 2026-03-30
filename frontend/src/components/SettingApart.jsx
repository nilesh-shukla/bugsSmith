
function SettingApart({className, width, heading, describe, bgImage}) {
  return (
    <div 
        className={`${width} ${className} relative h-100 bg-gradient-to-br from-transparent via-[#0476e84e] to-transparent border border-[#02468a5d] rounded-xl p-10 flex flex-col overflow-hidden`}>
        <div 
            className='absolute inset-0 bg-contain bg-no-repeat' 
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundPosition: 'right',
                opacity: 0.2
            }}/>
        <div className='absolute inset-0 bg-black/10'/>
        <div className='relative flex flex-col mt-auto'>
            <h1 className='text-3xl text-white'>{heading}</h1>
            <p className='text-[#86acb1]'>{describe}</p>
        </div>
    </div>
  )
}

export default SettingApart
