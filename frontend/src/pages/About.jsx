import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faCrosshairs, faLink, faLightbulb, faRecycle, faStar } from '@fortawesome/free-solid-svg-icons'
import Image from "/aboutImg.png"

import Footer from '../components/Footer'
import AboutValues from '../components/AboutValues'
import SettingApart from '../components/SettingApart'

function About() {
  return (
    <div className='relative flex flex-col gap-y-14 lg:gap-y-20 xl:gap-y-32 px-4 lg:px-15 pt-[20vh] outfit-font overflow-hidden'>

        <img src={Image} alt="" className='absolute h-screen xl:w-auto xl:h-auto -z-10 opacity-20 top-0 left-1/3' />

        <div className='flex flex-col gap-y-10 xl:gap-y-20 z-10'>
            <div className='grid grid-cols-1 xl:grid-cols-2'>
                <div className='flex flex-col gap-2 xl:gap-4'>
                    <h1 className='text-[#0d84a8] text-xs lg:text-base'>About BugsSmith</h1>
                    <h1 className='text-[2.5em] lg:text-[3.6em] xl:text-[4.7em] font-semibold outfit-font text-white leading-10 lg:leading-17 xl:leading-19'>Your Partner in Securing Trust & Authentic Connection</h1>
                    <p className='text-[#86acb1] leading-tight'>BugsSmith is dedicated to safeguarding digital ecosystems by delivering intelligent solutions that prevent fake profiles and strengthen online trust. With a commitment to innovation and precision, we empower organizations and communities to thrive in a secure, authentic, and growth-oriented environment.</p>
                </div>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-y-10 xl:gap-x-16'>
                <div className='flex flex-col gap-3'>
                    <h1 className='text-[#0d84a8]'>Our Story</h1>
                    <h1 className='text-[2.5em] lg:text-[3.6em] xl:text-[4.7em] font-semibold outfit-font text-white leading-10 lg:leading-17 xl:leading-19'>From SIH Beginnings to Redefining Digital Relations</h1>
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

        {/* Values */}
        <div>
            <div className='flex flex-col gap-y-12 md:gap-y-20 bg-gradient-to-br from-[#0b2e66] to-[#011e3f] border-4 border-[#98e5ef30] shadow-2xl rounded-2xl p-4 md:p-10 xl:p-16'>

                <div className='flex flex-col gap-y-10 w-full justify-center items-center'>
                    <div className='bg-[#86acb1] px-2 py-1 rounded-full w-fit'>
                        <h1 className='text-xs lg:text-base text-[#1178b3] font-semibold'>Our Values</h1>
                    </div>
                    <div className='flex flex-col gap-2 xl:gap-0 items-center'>
                        <h1 className='text-[2.5rem] md:text-[3.2rem] xl:text-[4rem] leading-10 lg:leading-17 xl:leading-19 font-semibold bg-gradient-to-br from-[#0e3f8e] to-[#0289c2] bg-clip-text text-transparent text-center'>The Core Values of BugsSmith</h1>
                        <p className='text-[#86acb1] text-center'>Guiding principles driving our commitment to your success</p>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row md:justify-between gap-14'>
                    <AboutValues icon={faLink} heading={"Integrity"} describe={"Bring feedback from specific Slack channels into BugsSmith"} />
                    <AboutValues icon={faLightbulb} heading={"Innovation"} describe={"Leveraging the best tools and approaches to meet organizational needs"}/>
                    <AboutValues icon={faRecycle} heading={"Adaptibility"} describe={"Tailoring solutions to meet the evolving demands of the modern workplace"}/>
                    <AboutValues icon={faRecycle} heading={"Excellence"} describe={"Bring feedback from specific Slack channels into BugsSmith AI"}/>
                </div>
            </div>
        </div>

        {/* What Sets Us Apart */}
        <div className='flex flex-col gap-y-16'>

            <div className='flex flex-col gap-2 md:gap-6 w-full justify-center items-center'>
                <div className='bg-[#86acb1] px-2 py-1 rounded-full w-fit'>
                    <h1 className='text-[#1178b3] text-xs lg:text-base font-semibold'>What Sets Us Apart</h1>
                </div>
                <div className='flex flex-col items-center'>
                    <h1 className='text-[3.4rem] leading-13 font-semibold bg-gradient-to-br from-[#012a6d] to-[#01b0fa] bg-clip-text text-transparent'>Our Unmatched Approach to Updating Security</h1>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                <SettingApart heading={"Proven Expertise"} describe={"My combined efforts on ML and frontend experience drive successful outcomes"} className={"md:col-span-2"} bgImage={"/apartimg-1.png"}/>
                <SettingApart heading={"Innovative Tools"} describe={"Our proprietary software application simplifies goal management, streamlines processes, and drives performance"} className={"md:col-span-3"} bgImage={"/apartimg-2.png"}/>
                <SettingApart heading={"Client-Centric Approach"} describe={"We prioritize understanding and addressing the unique needs of every client"} className={"md:col-span-3"} bgImage={"/apartimg-3.png"}/>
                <SettingApart heading={"Proven Expertise"} describe={"Military discipline and technical know-how inform our structured, results-driven approach"} className={"md:col-span-2"} bgImage={"/apartimg-4.png"}/>
            </div>
        </div>

        <Footer />
    </div>
  )
}

export default About