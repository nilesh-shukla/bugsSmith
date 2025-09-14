import React from 'react'

function FeatureCard({className, image, heading, describe}) {
  return (
    <div className={`p-8 flex flex-col gap-2 bg-gradient-to-bl from-[#5592cf79] via-[#1f8cf845] to-transparent w-[60vh] h-[70vh] rounded-2xl ${className}`}>
        <div>
            <img 
                src={image} 
                alt="" 
                className='w-full h-full object-cover' 
                style={{WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%), \
                linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)",
                        WebkitMaskComposite: "destination-in",
                        maskComposite: "intersect",
                        WebkitMaskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskSize: "cover"
                    }}
            />
        </div>
        <div className='mt-auto'>
            <h1 className='text-2xl text-white font-semibold'>{heading}</h1>
            <p className='text-[#9ebedf]'>{describe}</p>
        </div>
    </div>
  )
}

export default FeatureCard