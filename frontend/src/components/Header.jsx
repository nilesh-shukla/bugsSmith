import ImageStack from './ImageStack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCircleDot, faStar, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <div className='w-auto'>

      <img src="/header-background.png" alt="logoimage" className='animate-spin-slow absolute w-72 xl:w-4xl top-1/4 xl:bottom-1/4 xl:top-auto md:left-1/4 xl:left-1/2 blur-2xl overflow-hidden -z-10' />

      <div className='grid grid-rows-1 grid-cols-1 md:grid-cols-1 md:grid-rows-2 xl:grid-rows-1 xl:grid-cols-2 gap-y-8 xl:gap-2 z-10'>

        <div className='flex flex-col gap-4 xl:gap-6'>
          <div className='border items-center border-[#0095ba] w-fit rounded-full px-3 py-2'>
            <h1 className='text-[#0095ba] lg:text-sm text-xs'>
              <FontAwesomeIcon icon={faCircleDot} className='mr-2 text-blue-300' />
              AI-Powered solution tools
            </h1>
          </div>
          <h1 className='text-white text-[3em] lg:text-[3.6em] xl:text-[4.7em] outfit-font leading-15 lg:leading-17 xl:leading-19'>Secure Your Space! Eliminate Imposters</h1>
          <p className='text-[#7cb2c0]'>Maximize security with AI that detects fake accounts, prevents fraud in real time, and ensures trusted user experience</p>
          <div className='flex gap-4 outfit-font'>
            <Link to={'/analyze'}>
              <button className='bg-gradient-to-r from-[#047be3] via-[#7856e7] to-[#b514e1] hover:scale-110 transition-all duration-200 group px-5 py-4 cursor-pointer rounded-full text-white font-semibold'>
                Analyze
                <FontAwesomeIcon icon={faWandMagicSparkles} className='ml-2'/>
              </button>
            </Link>
            <Link to={'/about'}>
              <button className='bg-transparent cursor-pointer p-4 rounded-full border border-[#7cb2c0] text-white hover:bg-white hover:border-white hover:text-[#35a0bb] transition-all duration-200'>
                How we Work
                <FontAwesomeIcon icon={faBriefcase} className='ml-2'/>
              </button>
            </Link>
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

        <ImageStack className={"hidden md:block"} />

      </div>
    </div>
  )
}

export default Header