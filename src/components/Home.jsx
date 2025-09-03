import Solutions from './Solutions'
import Header from './Header'
import Cards from './Cards'
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faHeadSideVirus, faLockOpen } from '@fortawesome/free-solid-svg-icons'

function Home() {
  return (
    <div className='flex flex-col gap-y-32 px-12 py-35'>
        <Header />

        {/* Problem */}
        <div>
          <div className='w-fit p-2 bg-[#294281] rounded-full mb-3'>
            <h1 className='text-blue-300 text-sm outfit-font'>Problems</h1>
          </div>
          <div className='flex flex-col gap-20'>
            <div className='flex gap-24 justify-between items-center'>
              <h1 className='text-white text-[3.3em] w-1/2 outfit-font tracking-tight leading-14'>The Invisible Drain on Trust, Revenue, and Reputation</h1>
              <p className='w-1/3 text-[#A0AEC0]'>Organizations face mounting losses as fake accounts inflate numbers, skew analytics, and create blind spots in decision-making</p>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <Cards icon={faThumbsDown} iconHeading={"Trust Erosion"} figures={"1/5"} description={"active accounts on social media is likely fake or spam, undermining faith in platform authenticity and interaction"} />
              <Cards icon={faHeadSideVirus} iconHeading={"Platform Distortion"} figures={"39%"} description={"of discussions in a backlash campaign were driven by fake users"} />
              <Cards icon={faLockOpen} iconHeading={"Security Threats"} figures={"25,000"} description={"fraudulent login attempts every hour, highlighting the constant threat fake accounts pose to user security"} />
            </div>
          </div>
        </div>

        {/* Solution */}
        <div>
          {/* Top */}
          <div className='w-fit p-2 mb-4 bg-[#294281] rounded-full'>
            <h1 className='text-blue-300 text-sm outfit-font'>Solutions</h1>
          </div>
          
          <div className='grid grid-cols-2'>
            {/* Left */}
            <div className='flex flex-col gap-2'>
                <Solutions sol_heading={"AI Driven Detection System"} describe={"Uses machine learning algorithms to identify suspicious patterns, automated behavior, and anomalies in user profiles and activities"} />
                <Solutions sol_heading={"Report-Block-Remove Strategy"} describe={"Streamlined process where users report suspicious profiles, admins verify and block, followed by systematic removal of confirmed fakes"} />
                <Solutions sol_heading={"Two-factor Authentication"} describe={"Additional security layer requiring users to verify identity through multiple methods, significantly reducing fake account creation"}/>
                <Solutions sol_heading={"User Behavior Analytics"} describe={"Monitors and analyzes user activity patterns to detect suspicious behaviors and identify potentially fraudulent accounts"}/>
            </div>
            {/* Right */}
            <div></div>
          </div>
        </div>
    </div>
  )
}

export default Home