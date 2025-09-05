import ImageStack from './ImageStack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCircleDot, faStar } from '@fortawesome/free-solid-svg-icons';


function Header() {
  return (
    <div className='w-screen z-0'>
      <img src="/header-background.png" alt="image#" className='animate-spin-slow absolute w-4xl bottom-1/4 left-1/2 blur-2xl' />
      <div className='grid xl:grid-cols-2 gap-2'>

        <div className='flex flex-col gap-6'>
          <div className='border items-center border-[#0095ba] w-fit rounded-full px-3 py-2'>
            <h1 className='text-[#0095ba] text-sm'>
              <FontAwesomeIcon icon={faCircleDot} className='mr-2 text-blue-300' />
              AI-Powered solution tools
            </h1>
          </div>
          <h1 className='text-white text-[4.7em] outfit-font leading-19'>Secure Your Space! Eliminate Imposters</h1>
          <p className='text-[#7cb2c0]'>Maximize security with AI that detects fake accounts, prevents fraud in real time, and ensures trusted user experience</p>
          <div className='flex gap-4 outfit-font'>
            <button className='bg-white p-4 rounded-full'>Join Waitlist</button>
            <button className='bg-transparent p-4 rounded-full border border-[#7cb2c0] text-white'>
              How we Work
              <FontAwesomeIcon icon={faBriefcase} className='ml-2'/>
            </button>
          </div>
          <div className='flex items-center gap-3'>
            <h1 className='text-xl text-[#9ebdc3] outfit-font'>Trustpilot:</h1>
            <div className='items-center mt-0.5'>
              <FontAwesomeIcon icon={faStar} className='text-blue-400' />
              <FontAwesomeIcon icon={faStar} className='text-blue-400' />
              <FontAwesomeIcon icon={faStar} className='text-blue-400' />
              <FontAwesomeIcon icon={faStar} className='text-blue-400' />
              <FontAwesomeIcon icon={faStar} className='text-white' />
            </div>
          </div>
        </div>

        <ImageStack />

      </div>
    </div>
  )
}

export default Header