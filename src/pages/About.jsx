import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faCrosshairs, faLink, faLightbulb, faRecycle, faStar } from '@fortawesome/free-solid-svg-icons'
import Image from "/aboutImg.png"

import Footer from '../components/Footer'
import AboutValues from '../components/AboutValues'
import SettingApart from '../components/SettingApart'

function About() {
  return (
    <div className='flex flex-col gap-y-36 px-15 pt-[20vh] outfit-font'>

        <div className='flex flex-col gap-y-20'>
            <div className='grid grid-cols-2'>
                <div className='flex flex-col gap-4'>
                    <h1 className='text-[#0d84a8]'>About BugsSmith</h1>
                    <h1 className='text-[4rem] text-white tracking-tight leading-16 font-semibold'>Your Partner in Securing Trust & Authentic Connection</h1>
                    <p className='text-[#86acb1] leading-tight'>BugsSmith is dedicated to safeguarding digital ecosystems by delivering intelligent solutions that prevent fake profiles and strengthen online trust. With a commitment to innovation and precision, we empower organizations and communities to thrive in a secure, authentic, and growth-oriented environment.</p>
                </div>

                <div 
                    className='absolute h-[90vh] inset-0 bg-contain bg-no-repeat'
                    style={{
                        backgroundImage: `url(${Image})`,
                        backgroundPosition: "right",
                        opacity: 0.1
                    }}
                />
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

        <div>
            <div className='flex flex-col gap-y-10 bg-gradient-to-br from-transparent to-[#011e3f] border-4 border-[#98e5ef30] shadow-2xl rounded-2xl p-16'>
                <div className='flex flex-col gap-y-5 w-full justify-center items-center'>
                    <div className='bg-[#86acb1] px-2 py-1 rounded-full w-fit'>
                        <h1 className='text-[#1178b3] font-semibold'>Our Values</h1>
                    </div>
                    <div className='flex flex-col items-center'>
                        <h1 className='text-[3rem] font-semibold bg-gradient-to-br from-[#0e3f8e] to-[#0289c2] bg-clip-text text-transparent'>The Core Values of BugsSmith</h1>
                        <p className='text-[#86acb1]'>Guiding principles driving our commitment to your success</p>
                    </div>
                </div>
                <div className='flex justify-between gap-x-14'>
                    <AboutValues icon={faLink} heading={"Integrity"} describe={"Bring feedback from specific Slack channels into BugsSmith"} />
                    <AboutValues icon={faLightbulb} heading={"Innovation"} describe={"Leveraging the best tools and approaches to meet organizational needs"}/>
                    <AboutValues icon={faRecycle} heading={"Adaptibility"} describe={"Tailoring solutions to meet the evolving demands of the modern workplace"}/>
                    <AboutValues icon={faRecycle} heading={"Excellence"} describe={"Bring feedback from specific Slack channels into BugsSmith AI"}/>
                </div>
            </div>
        </div>

        <div className='flex flex-col gap-y-16'>
            <div className='flex flex-col w-full justify-center items-center'>
                <div className='bg-[#86acb1] px-2 py-1 rounded-full w-fit'>
                    <h1 className='text-[#1178b3] font-semibold'>What Sets Us Apart</h1>
                </div>
                <div className='flex flex-col items-center'>
                    <h1 className='text-[3rem] font-semibold bg-gradient-to-br from-[#012a6d] to-[#01b0fa] bg-clip-text text-transparent'>Our Unmatched Approach to Updating Security</h1>
                </div>
            </div>
            <div className='grid grid-cols-5 gap-4'>
                <SettingApart heading={"Proven Expertise"} describe={"My combined efforts on ML and frontend experience drive successful outcomes"} className={"col-span-2"} bgImage={"/apartimg-1.png"}/>
                <SettingApart heading={"Innovative Tools"} describe={"Our proprietary software application simplifies goal management, streamlines processes, and drives performance"} className={"col-span-3"} bgImage={"/apartimg-2.png"}/>
                <SettingApart heading={"Client-Centric Approach"} describe={"We prioritize understanding and addressing the unique needs of every client"} className={"col-span-3"} bgImage={"/apartimg-3.png"}/>
                <SettingApart heading={"Proven Expertise"} describe={"Military discipline and technical know-how inform our structured, results-driven approach"} className={"col-span-2"} bgImage={"/apartimg-4.png"}/>
            </div>
        </div>

        <Footer />
    </div>
  )
}

export default About