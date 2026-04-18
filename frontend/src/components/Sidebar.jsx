import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faIdBadge, faMagnifyingGlassChart, faCodeMerge, faXmark, faRightFromBracket, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Sidebar({ onSelect, className, onClose }) {
    const [active, setActive] = useState('dashboard');
    const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const options = [
        { id: 'dashboard', label: 'Dashboard', icon: faIdBadge },
        { id: 'analyze', label: 'Analyze', icon: faMagnifyingGlassChart },
        { id: 'visualise', label: 'Visualise', icon: faChartSimple },
        { id: 'integerations', label: 'Integerations', icon: faCodeMerge }
    ];

    const { user, logout } = useAuth();

    const displayName = user ? (user.firstName && user.firstName.trim() ? user.firstName.trim() : (user.name && user.name.trim() ? user.name.trim().split(' ')[0] : 'User')) : '';

    useEffect(() => {
        function handleClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setMobileDropdownOpen(false);
            }
        }
        function handleKey(e) {
            if (e.key === 'Escape') setMobileDropdownOpen(false);
        }
        document.addEventListener('click', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, []);

    return (
        <div className={`w-full flex flex-col gap-20 xl:gap-0 justify-normal xl:justify-between xl:rounded-l-3xl bg-gradient-to-br from-[#021f3b] to-[#3167b9] xl:bg-[#3568b45d] px-4 py-8 h-full ${className || ''}`}>

            <div className="flex flex-col gap-8">
                {/* SignUp in Mobile View */}
                <div className="xl:hidden flex w-full justify-between items-center text-[#aeb4ba] text-lg relative">
                    <button onClick={() => onClose && onClose()} className="xl:hidden text-white p-1">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>

                    <div className="hidden xl:block" />

                    <div ref={dropdownRef}>
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMobileDropdownOpen((p) => !p)}
                                    aria-haspopup="true"
                                    aria-expanded={mobileDropdownOpen}
                                    className="flex items-center text-white p-1"
                                >
                                    <FontAwesomeIcon icon={faCircleUser} className="text-2xl" />
                                </button>

                                {mobileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white/5 backdrop-blur-sm rounded-md py-2 shadow-lg z-50 text-white">
                                        <div className="px-4 py-2">
                                            <div className="font-semibold text-sm truncate">{displayName || user.email}</div>
                                            <div className="text-xs text-gray-300 truncate">{user.email}</div>
                                            <div className="text-xs text-gray-400 mt-1">{user.role}</div>
                                        </div>
                                        <hr className="border-t border-white/10 my-1" />
                                        <div className="px-2">
                                            <button
                                                onClick={() => { setMobileDropdownOpen(false); onClose && onClose(); logout(); }}
                                                className="w-full text-left px-4 py-2 text-sm hover:bg-white/10 transition-colors flex items-center"
                                            >
                                                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                                                Log out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/auth/login" onClick={() => onClose && onClose()} className="flex gap-2 items-center">
                                <FontAwesomeIcon icon={faRightFromBracket} />
                                Login
                            </Link>
                        )}
                    </div>
                </div>

                {/* Title and History */}
                <Link to="/" className="flex flex-col justify-center items-center space-y-4 ">
                    <div className="w-1/2">
                        <img src={'/web-logo.png'} alt="" className="w-full h-full" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-300">BugsSmith</h1>
                    </div>
                </Link>
            </div>

            {/* Dashboard Options */}
            <div>
                <div className="flex flex-col gap-6 text-2xl xl:text-lg text-white" style={{ fontWeight: 200 }}>
                    {options.map((opt) => (
                        <div
                            key={opt.id}
                            className={`items-center cursor-pointer px-2 ${active === opt.id ? 'text-blue-400 bg-white/5 rounded-2xl py-4' : 'text-gray-400'}`}
                            onClick={() => {
                                onSelect(opt.id);
                                setActive(opt.id);
                            }}
                            style={{ fontWeight: 400 }}
                        >
                            <FontAwesomeIcon icon={opt.icon} className="mr-2" />
                            {opt.label}
                        </div>
                    ))}
                </div>
            </div>

            {/* SignUp in Desktop View */}
                <div className=" hidden xl:flex flex-col w-full items-center text-[#aeb4ba] text-xl">
                    {user ? (
                        <>
                            <div className='flex flex-col items-center'>
                                <FontAwesomeIcon icon={faCircleUser} className='text-4xl mb-2' />
                                <div className='text-white font-semibold'>{displayName}</div>
                                <div className='text-sm text-gray-300'>{user.role}</div>
                            </div>
                            <hr className="w-full border-t border-gray-600 my-4" />
                            <div>
                                <button onClick={() => logout()} className="flex gap-2 items-center text-red-400 hover:text-red-500 hover:cursor-pointer transition-all duration-300">
                                    <FontAwesomeIcon icon={faRightFromBracket} />
                                    Log out
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/auth/login" className='flex gap-2 items-center hover:text-gray-500 hover:cursor-pointer transition-all duration-300'>
                                <FontAwesomeIcon icon={faCircleUser} />
                                Login
                            </Link>
                        </>
                    )}
                </div>
        </div>
    );
}

export default Sidebar;