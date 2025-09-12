import React from 'react'

function FeatureCard({className, image, heading, describe}) {
  return (
    <div className={`p-3 bg-gradient-to-bl from-[#fff] via-transparent to-[#fff] w-[60vh] h-[70vh] rounded-2xl ${className}`}>
        <div>
            <img src={image} alt="" />
        </div>
        <div>
            <h1>{heading}</h1>
            <p>{describe}</p>
        </div>
    </div>
  )
}

export default FeatureCard