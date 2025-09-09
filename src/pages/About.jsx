import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Footer from '../components/Footer'
import { faBullseye, faCrosshairs } from '@fortawesome/free-solid-svg-icons'

function About() {
  return (
    <div className='flex flex-col gap-y-10 px-15 pt-[20vh] outfit-font'>
        <div className='flex flex-col gap-y-20'>

            <div className='grid grid-cols-2'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-[#0d84a8]'>About BugsSmith</h1>
                    <h1 className='text-[4rem] text-white tracking-tight leading-16 font-semibold'>Your Partner in Securing Trust & Authentic Connection</h1>
                    <p className='text-[#86acb1] leading-tight'>BugsSmith is dedicated to safeguarding digital ecosystems by delivering intelligent solutions that prevent fake profiles and strengthen online trust. With a commitment to innovation and precision, we empower organizations and communities to thrive in a secure, authentic, and growth-oriented environment.</p>
                </div>

                <div></div>
            </div>

            <div className='grid grid-cols-2 gap-x-16'>
                <div className='flex flex-col gap-3'>
                    <h1 className='text-[#0d84a8]'>Our Story</h1>
                    <h1 className='text-[4rem] text-white tracking-tight leading-16 font-semibold'>From SIH Beginnings to Redefining Digital Relations</h1>
                    <p className='text-[#86acb1] leading-tight'>BugsSmith began its journey as a project for the Smart India Hackathon (SIH), but what started as a competition soon grew into a passion for solving real-world challenges in digital security. Founded by a group of curious innovators driven by a vision to combat the rising threat of fake profiles, BugsSmith blends technical expertise with a mission-focused mindset. Our commitment is to develop intelligent, reliable, and scalable solutions that empower individuals, communities, and organizations to build authentic and secure digital interactions.</p>
                </div>

                <div className='flex flex-col gap-3 justify-end'>
                    <div>
                        <div className='flex gap-3 text-2xl items-center text-white'>
                            <FontAwesomeIcon icon={faBullseye} className='text-[#0d84a8]' />
                            <h1 className='text-3xl font-semibold'>Our Vision</h1>
                        </div>
                        <p className='text-[#86acb1]'>To create a digital world where trust and authenticity thrive, empowering individuals and organizations to interact without fear of deception or fraud.</p>
                    </div>
                    <div>
                        <div className='flex gap-3 text-2xl items-center text-white'>
                            <FontAwesomeIcon icon={faCrosshairs} className='text-[#0d84a8]'/>
                            <h1 className='text-3xl font-semibold'>Our Mission</h1>
                        </div>
                        <p className='text-[#86acb1]'>At BugsSmith, our mission is to combat fake profiles and strengthen online security by delivering intelligent, scalable, and user-friendly solutions. We are committed to transforming innovation into impact, ensuring safe, transparent, and trustworthy digital communities.</p>
                    </div>
                </div>
            </div>

        </div>


        <Footer />
    </div>
  )
}

export default About