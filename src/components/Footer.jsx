import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter, faLinkedinIn, faInstagram, faGithub } from "@fortawesome/free-brands-svg-icons"

function Footer() {
  return (
    <div className="flex flex-col gap-20">
        <div className='relative px-16 py-12 bg-gradient-to-br from-[#0143757c] via-[#00376134] to-transparent rounded-xl outfit-font'>
            <div className='absolute bottom-0 right-0 w-full h-full bg-[url("/footer-bg.png")] bg-no-repeat bg-cover opacity-30 z-10'></div>
            <div className='flex gap-10 justify-between items-center'>
                <div className='flex flex-col gap-6 w-[49%]'>
                    <h1 className='text-[2.8rem] leading-tight font-bold text-[#a2baf4]'>Ready to protect your platform from fake profiles?</h1>
                    <p className='text-xl text-[#bcd9f3]'>Secure your community with BugsSmith. Contact us today and learn how our AI-driven technology can detect fakes and empower your platform’s growth</p>
                    <button className='bg-white hover:bg-gray-400 cursor-pointer transition-all duration-300 p-4 w-fit rounded-full z-50'>Contact Us</button>
                </div>
                <div className='z-20'>
                <img src="/web-logo.png" alt="" className='w-50' />
                </div>
            </div>        
        </div>

        <div className='flex flex-col gap-4'>

            <div className='flex gap-20 items-center'>
                {/* Left */}
                <div className='flex flex-col gap-10'>
                
                    <div className='flex gap-2 items-center'>
                        <img src="/web-logo.png" alt="" className='w-10'/>
                        <h1 className='text-2xl text-[#a2baf4] kode-font'>BugsSmith</h1>
                    </div>

                    <div className='flex flex-col outfit-font gap-3'>
                        <h1 className='text-lg text-[#a2baf4]'>Subscribe to get the latest updates and premium features</h1>
                        <div className='flex gap-4 items-center'>
                            <input type="email" name="email" id="email" placeholder='Email' className='w-1/2 border border-[#a2bcf731] rounded-full bg-[#a2bcf732] px-4 py-3 text-white focus:outline-0 focus:ring-' />
                            <button className='px-4 py-3 bg-[#a2baf4] hover:bg-[#4591dc]/25 hover:text-white transition-all duration-300 cursor-pointer rounded-full'>Subscribe</button>
                        </div>
                        <p className='text-sm text-[#bcd9f379]'>By subscribing you agree to with our Privacy Policy and provide consent to receive updates from our company</p>
                    </div>
                </div>

                {/* Right */}
                <div className='flex mx-auto gap-15'>
                    <div className='flex flex-col gap-6 text-[#bcd9f379]'>
                        <h1 className='text-lg text-[#a2baf4]' >Menu</h1>
                        <ul className='flex flex-col gap-3'>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/resources">Services</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                            <li><Link to="/solutions">Solution</Link></li>
                        </ul>
                    </div>
                    <div className='flex flex-col gap-6 text-[#bcd9f379]'>
                        <h1 className='text-lg text-[#a2baf4]'>Follow us</h1>
                        <ul className='flex flex-col gap-3 '>
                            <li>
                                <FontAwesomeIcon icon={faGithub} className="mr-2" />
                                <a href="https://github.com/nilesh-shukla">GitHub</a>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faTwitter} className="mr-2" />
                                <a href="https://x.com/NileshS32355762">X(Twitter)</a>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faLinkedinIn} className="mr-2" />
                                <a href="https://www.linkedin.com/in/nilesh-shukla21/">LinkedIn</a>
                            </li>
                            <li>
                                <FontAwesomeIcon icon={faInstagram} className="mr-2" />
                                <a href="https://www.instagram.com/nil_esh21">Instagram</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='flex mt-10 justify-between items-center text-[#bcd9f379]'>
                <p>&copy; 2025 BugsSmith. All rights reserved</p>
                <div className='flex gap-3 underline'>
                    <a href="">Terms of Service</a>
                    <a href="">Privacy Policy</a>
                    <a href="">Cookies Settings</a>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer