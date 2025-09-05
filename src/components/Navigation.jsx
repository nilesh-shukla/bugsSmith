import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

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
    <div className='fixed inset-0 py-4 h-fit z-[999]'>
      <div className="w-full flex justify-center items-center">
        <nav className="flex items-center gap-8 px-8 py-4 rounded-full backdrop-blur-xl bg-blue-400/15">
          <img src="/web-logo.png" alt="Logo" className="w-10" />
          <a href="#" className="text-white font-medium">
            Solutions
            <FontAwesomeIcon icon={faAngleDown} className='ml-1 text-[#0098cf]' />
          </a>
          <a href="#" className="text-white font-medium">About Us</a>
          <a href="#" className="text-white font-medium">Resources</a>
          <a href="#" className="text-white font-medium">Integrations</a>
          <a href="#" className="text-white font-medium">Contact Us</a>
        </nav>

        {/* MENU */}
        <div className="xl:hidden">
          <FontAwesomeIcon 
          icon={isOpen ? faTimes : faEllipsisV}
          className="text-xl text-gray-500 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
         />
        </div>
      </div>

      {/* MENU FUNCTIONALITY */}
        {isOpen && (
          <div
            className="fixed top-[60px] left-0 w-full bg-white xl:hidden z-[9998] overflow-hidden"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul 
              className="flex flex-col items-start px-5 gap-6 py-6 text-black font-isans"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                }
              }}
            >
              <li><Link onClick={() => setIsOpen(false)} to="/Work">Work</Link></li>
              <li><Link onClick={() => setIsOpen(false)} to="/About">About</Link></li>
              <li><Link onClick={() => setIsOpen(false)} to="/Contact">Contact</Link></li>
            </ul>
          </div>
        )}
    </div>
  )
}

export default Navigation