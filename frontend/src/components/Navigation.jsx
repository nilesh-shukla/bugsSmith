import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faEllipsisV, faTimes, faPuzzlePiece, faCircleInfo, faBook, faEnvelope, faUserCircle, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import LogIn from './LogIn';
import CreateAccount from './CreateAccount';

function Navigation() {

  const [isOpen, setIsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const avatarRef = useRef(null);
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

            {/* SignUp */}
            {!isAuthenticated && (
              <button onClick={() => setSignupOpen(true)} title='SignUp' className='text-[#9ebedf] hover:text-white hover:bg-[#03418087] rounded-full hover:px-4 hover:py-2 transition-all duration-300 cursor-pointer'>Sign Up</button>
            )}

            {/* Login */}
              {isAuthenticated ? (
                <div className="relative" ref={avatarRef}>
                  <button onClick={() => setAvatarOpen(v => !v)} title='Account' aria-haspopup="true" aria-expanded={avatarOpen} className='flex items-center justify-center w-9 h-9 rounded-full bg-[#1f6fb3] text-white uppercase font-semibold'>
                    {(user?.firstName?.[0] || user?.username?.[0] || 'U')}
                  </button>
                  {avatarOpen && (
                    <div className='absolute right-0 mt-12 w-40 bg-white/5 rounded-md shadow-lg p-2 z-50'>
                      <Link to="/profile" onClick={() => setAvatarOpen(false)} className='block px-3 py-2 hover:bg-white/5 rounded'>Profile</Link>
                      <button onClick={() => { setAvatarOpen(false); logout(); }} className='w-full text-left px-3 py-2 hover:bg-white/5 rounded'>Logout</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className='relative'>
                  <button onClick={() => setLoginOpen(true)} title="Account" className='text-[#9ebedf] hover:text-blue-950 rounded-full transition-all duration-300 cursor-pointer items-center'>
                    <FontAwesomeIcon icon={faUserCircle} className="text-3xl" /> 
                  </button>
                </div>
              )}

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
                {[
                  { label: 'Solutions', to: '/solutions', icon: faPuzzlePiece },
                  { label: 'About', to: '/about', icon: faCircleInfo },
                  { label: 'Resources', to: '/resources', icon: faBook },
                  { label: 'Contact', to: '/contact', icon: faEnvelope },
                ].map((item) => (
                <motion.li 
                  key={item.label}
                  variants={itemVariants}
                  className="w-full"
                >
                  <Link 
                    to={item.to}
                    className="flex items-center gap-3 w-full py-2 hover:text-blue-500 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="w-6 flex justify-center">
                      <FontAwesomeIcon icon={item.icon} className="text-lg text-[#9edff6]" />
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            {/* Mobile: show Sign Up when not authenticated */}
            {!isAuthenticated && (
              <button onClick={() => { setIsOpen(false); setSignupOpen(true); }} aria-label="Sign up" title="Sign up" className='w-full bg-white/5 text-white rounded-full py-3 transition-all duration-300 cursor-pointer mt-2 flex items-center justify-center gap-2'>
                <span>Sign Up</span>
              </button>
            )}

            {/* Mobile login/account action */}
            {isAuthenticated ? (
              <button onClick={() => { setIsOpen(false); /* navigate to profile perhaps */ }} className='w-full bg-blue-500 text-white rounded-full py-3 transition-all duration-300 cursor-pointer mt-2 flex items-center justify-center gap-2'>
                <span className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center uppercase font-semibold">{(user?.firstName?.[0] || user?.username?.[0] || 'U')}</span>
                <span>Account</span>
              </button>
            ) : (
              <button onClick={() => { setIsOpen(false); setLoginOpen(true); }} aria-label="Sign in" title="Sign in" className='w-full bg-blue-500 text-white rounded-full py-3 transition-all duration-300 cursor-pointer mt-2 flex items-center justify-center gap-2'>
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Sign In</span>
              </button>
            )}
            {/* <Link to={'/analyze'}>
              <button className='w-full mt-4 bg-gradient-to-r from-[#047be3] via-[#7856e7] to-[#b514e1] hover:scale-110 transition-all duration-200 group py-2 cursor-pointer rounded-full text-white font-semibold'>
                Analyze
                <FontAwesomeIcon icon={faWandMagicSparkles} className='ml-2'/>
              </button>
            </Link> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setLoginOpen(false)} />
          <div className="relative z-10">
            <LogIn asModal onClose={() => setLoginOpen(false)} />
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {signupOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSignupOpen(false)} />
          <div className="relative z-10">
            <CreateAccount asModal onClose={() => setSignupOpen(false)} />
          </div>
        </div>
      )}

      {/* Mobile floating avatar with dropdown */}
      {isAuthenticated && (
        <div className="fixed bottom-4 right-4 z-[10001] xl:hidden">
          <div className="relative">
            <button onClick={() => setAvatarOpen(v => !v)} className="w-12 h-12 rounded-full bg-[#1f6fb3] text-white uppercase font-semibold shadow-lg">
              {(user?.firstName?.[0] || user?.username?.[0] || 'U')}
            </button>
            {avatarOpen && (
              <div className="absolute right-0 mb-16 w-44 bg-blue-700/50 rounded-md shadow-lg p-2">
                <Link to="/profile" onClick={() => setAvatarOpen(false)} className='block px-3 py-2 hover:bg-white/5 rounded'>Profile</Link>
                <button onClick={() => { setAvatarOpen(false); logout(); }} className='w-full text-left px-3 py-2 hover:bg-white/5 rounded'>Logout</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Navigation