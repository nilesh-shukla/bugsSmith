import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faEllipsisV, faTimes, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons';

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const menuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut" }
    },
    exit: { height: 0, opacity: 0, transition: { duration: 0.3 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className='fixed inset-0 w-screen py-4 h-fit z-[999]'>
      <div className="w-full px-4 xl:px-0 flex justify-center items-center">
        <nav className="flex w-full xl:w-auto justify-between items-center gap-8 px-4 xl:px-8 py-4 rounded-full backdrop-blur-xl bg-blue-400/15">

          {/* Logo */}
          <Link to={"/"} className='flex items-center gap-1'>
            <img src="/web-logo.png" alt="Logo" className="w-8 lg:w-10" />
            <h1 className='block xl:hidden text-2xl text-[#789] kode-font font-semibold'>Bugs<span className='text-[#6b90b4]'>Smith</span></h1>
          </Link>

          {/* Options */}
          <div className='hidden xl:flex items-center gap-6'>

            {/* Solution Links */}
            <div className="text-[#9ebedf] hover:text-white group transition-all duration-300 ease-in-out font-medium group-hover:cursor-pointer">
              Solutions
              <FontAwesomeIcon icon={faAngleDown} className='ml-1 text-[#0098cf] transform transition-transform duration-300 group-hover:rotate-180' />
              {/* Menu for Solutions */}
              <div className='opacity-0 absolute top-14 group-hover:opacity-100 duration-300 rounded-2xl p-6 bg-[#004c94] text-[#9ebedf]'>
                <ul className='space-y-4'>
                  <li className='hover:text-white hover:cursor-pointer'>
                    <Link to="/solutions">Solutions for Industries</Link>
                  </li>
                  <li className='hover:text-white hover:cursor-pointer'>
                    <Link to="/analyze">Analyze</Link>
                  </li>
                </ul>
              </div>
            </div>

            <Link to="/about" className="text-[#9ebedf] hover:text-white transition-all duration-300 ease-in-out font-medium">About Us</Link>
            <Link to="/resources" className="text-[#9ebedf] hover:text-white transition-all duration-500 ease-in-out font-medium">Resources</Link>
            <Link to="/contact" className="text-[#9ebedf] hover:text-white transition-all duration-300 ease-in-out font-medium">Contact Us</Link>
          </div>
          
          {/* MENU */}
          <div className="xl:hidden">
            <FontAwesomeIcon 
            icon={isOpen ? faTimes : faEllipsisV}
            className="text-xl text-gray-500 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
          </div>
        </nav>
      </div>

      {/* MENU FUNCTIONALITY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed px-5 py-4 top-24 left-0 w-full backdrop-blur-3xl rounded-2xl xl:hidden z-[9998] overflow-hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.ul 
              className="flex flex-col gap-2 outfit-font text-[#ace0f1] font-isans"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                }
              }}
            >
                {['Solutions', 'About', 'Resources', 'Contact'].map((item) => (
                <motion.li 
                  key={item}
                  variants={itemVariants}
                  className="w-full"
                >
                  <Link 
                    to={`/${item.toLowerCase()}`}
                    className="block w-full py-2 hover:text-blue-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
          </motion.ul>
          <Link to={'/analyze'}>
            <button className='w-full mt-4 bg-gradient-to-r from-[#047be3] via-[#7856e7] to-[#b514e1] hover:scale-110 transition-all duration-200 group py-2 cursor-pointer rounded-full text-white font-semibold'>
              Analyze
              <FontAwesomeIcon icon={faWandMagicSparkles} className='ml-2'/>
            </button>
          </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navigation