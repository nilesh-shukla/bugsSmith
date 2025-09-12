import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faEllipsisV, faTimes } from '@fortawesome/free-solid-svg-icons';

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
    <div className='fixed inset-0 w-full py-4 h-fit z-[999]'>
      <div className="w-full flex justify-center items-center">
        <nav className="flex items-center gap-8 px-8 py-4 rounded-full backdrop-blur-xl bg-blue-400/15">

          {/* Logo */}
          <Link to={"/"}>
          <img src="/web-logo.png" alt="Logo" className="w-10" />
          </Link>

          {/* Options */}
          <div className='hidden xl:flex items-center gap-6'>

            {/* Solution Links */}
            <div className="text-[#9ebedf] hover:text-white group transition-all duration-300 ease-in-out font-medium group-hover:cursor-pointer">
              Solutions
              <FontAwesomeIcon icon={faAngleDown} className='ml-1 text-[#0098cf] transform transition-transform duration-300 group-hover:rotate-180' />
              {/* Menu for Solutions */}
              <div className='opacity-0 absolute top-14 group-hover:opacity-100 duration-300 rounded-2xl p-6 bg-[#004c94d0] text-[#9ebedf]'>
                <ul>
                  <li className='hover:text-white hover:cursor-pointer'>
                    <Link to="/solutions">Solutions for Industries</Link>
                  </li>
                </ul>
              </div>
            </div>

            <Link to="/about" className="text-[#9ebedf] hover:text-white transition-all duration-300 ease-in-out font-medium">About Us</Link>
            <Link to="/resources" className="text-[#9ebedf] hover:text-white transition-all duration-500 ease-in-out font-medium">Resources</Link>
            <a href="#" className="text-[#9ebedf] hover:text-white transition-all duration-300 ease-in-out font-medium">Integrations</a>
            <a href="#" className="text-[#9ebedf] hover:text-white transition-all duration-300 ease-in-out font-medium">Contact Us</a>
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
            className="fixed top-[60px] left-0 w-full bg-white xl:hidden z-[9998] overflow-hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.ul 
              className="flex flex-col items-start px-5 gap-6 py-6 text-black font-isans"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                }
              }}
            >
                  {['Solutions', 'About Us', 'Resources', 'Integrations', 'Contact Us'].map((item) => (
                <motion.li 
                  key={item}
                  variants={itemVariants}
                  className="w-full"
                >
                  <Link 
                    to={`/${item.toLowerCase().replace(' ', '-')}`}
                    className="block w-full py-2 hover:text-blue-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.li>
              ))}
          </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navigation