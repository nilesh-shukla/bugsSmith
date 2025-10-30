import React from 'react'
import Footer from '../components/Footer'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons'

function Contact() {
  return (
    <div className='pt-[20vh] pb-10 md:pt-[15vh] xl:pt-[20vh] px-4 md:px-8 xl:px-15 flex flex-col gap-y-20 outfit-font'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-y-14 justify-between'>

            {/* Contact Information */}
            <div className='space-y-5 w-full'>
                <h1 className='text-[#0d84a8] text-lg'>Your Problems</h1>
                <h1 className='text-white text-[3.8rem] font-semibold leading-tight'>Contact Us</h1>
                <p className='text-[#86acb1]'>Have a question, seek for support? Just send us an email, and we'll be sure to respond promptly.</p>
                <div className='text-[#a4c1c5] text-lg space-y-3'>
                    <div className='flex items-center space-x-3'>
                        <FontAwesomeIcon icon={faEnvelope}/>
                        <p>shuklanilesh810@gmail.com</p>
                    </div>
                    <div className='flex items-center space-x-3'>
                        <FontAwesomeIcon icon={faPhone}/>
                        <p>+91 90050 82611</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="text-xl">
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <p>ABES Engineering College, Crossing Republik, Chipiyana, Ghaziabad-201009</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className='px-2 py-6 md:p-6 flex flex-col gap-4 text-[#86acb1] w-full rounded-2xl bg-[#153955]'>
                <div className='grid grid-cols-1 md:grid-rows-2 md:grid-cols-2 gap-x-2 gap-y-4'>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="fname">First Name</label>
                        <input type="text" placeholder='First Name' className='p-3 rounded-full focus:outline-none focus:ring-0 text-white bg-[#a2bcf732] placeholder:text-[#86acb1]'/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="lname">Last Name</label>
                        <input type="text" placeholder='Last Name' className='p-3 rounded-full focus:outline-none focus:ring-0 text-white bg-[#a2bcf732] placeholder:text-[#86acb1]'/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder='Email' className='p-3 rounded-full focus:outline-none focus:ring-0 text-white bg-[#a2bcf732] placeholder:text-[#86acb1]'/>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label htmlFor="comapny">Company</label>
                        <input type="text" placeholder='Company' className='p-3 rounded-full focus:outline-none focus:ring-0 text-white bg-[#a2bcf732] placeholder:text-[#86acb1]'/>
                    </div>  
                </div>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="">Message</label>
                    <textarea name="" id="" placeholder='Message' className='p-3 rounded-xl focus:outline-none focus:ring-0 bg-[#a2bcf732] h-40 resize-none placeholder:text-[#86acb1] text-white'></textarea>
                </div>

                <div className='flex gap-2 items-center'>
                    <input type="checkbox" className='focus:outline-none focus:ring-0 h-10'/>
                    <p>I agree to receive further communications from BugsSmith</p>
                </div>
                <button className='bg-white p-4 rounded-full w-full xl:w-fit font-semibold text-[#052553]'>Submit</button>
            </div>

        </div>

        <Footer />
    </div>
  )
}

export default Contact