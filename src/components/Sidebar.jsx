import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faIdBadge, faMagnifyingGlassChart, faCodeMerge, faXmark, faRightFromBracket, faCaretRight, faEllipsisVertical  } from '@fortawesome/free-solid-svg-icons';
import { button } from 'framer-motion/client';
import { Link } from 'react-router-dom';
import { icon } from '@fortawesome/fontawesome-svg-core';

function Sidebar({onSelect, className}) {

    const [active, setActive] = useState("dashboard")
    const [isOpen, setIsOpen] = useState(true);

  const options = [
    { id: "dashboard", label: "Dashboard", icon : faIdBadge  },
    { id: "analyze", label: "Analyze", icon : faMagnifyingGlassChart },
    { id: "visualise", label: "Visualise", icon : faChartSimple } ,
    { id: "integerations", label: "Integerations", icon : faCodeMerge }
  ];

  return (
        <>
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className='xl:hidden fixed top-1/2 left-0 z-[60] bg-[#163c7a] text-white px-0 py-4 rounded-r-full'
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} className="text-3xl" />
                </button>
            )}
            <div className={`transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} xl:translate-x-0 w-full flex flex-col xl:gap-10 gap-20 xl:justify-normal xl:rounded-l-3xl bg-gradient-to-br from-[#021f3b] to-[#3167b9] xl:bg-[#3568b45d] px-4 py-8 sticky h-full ${className}`}>

                <div className='flex flex-col gap-8'>
                    <div className='flex w-full justify-between items-center text-[#aeb4ba] text-lg'>
                        {/* Close Button*/}
                        <button aria-label='Close sidebar' onClick={() => setIsOpen(false)} className='xl:hidden text-white p-1'>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>

                        <div>
                            <button className='flex gap-2 items-center'>
                                <FontAwesomeIcon icon={faRightFromBracket}/>
                                Log out
                            </button>
                        </div>
                    </div>
                    {/* Title and History */}
                    <Link to={"/"} className='flex flex-col justify-center items-center space-y-4 '>
                        <div className='w-1/2'>
                            <img src={"/web-logo.png"} alt="" className='w-full h-full' />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-300">BugsSmith</h1>
                        </div>
                    </Link>
                    {/* <div className="cursor-pointer">
                        <div className="w-full flex justify-between  items-center px-3 py-4 rounded-2xl bg-[#074f978e] hover:scale-105 transition-all duration-200">
                            <div className='text-lg text-white flex items-center'>
                                History
                            </div>
                            <FontAwesomeIcon icon={faChevronDown} className='text-[#63a9c5]'/>
                        </div>
                    </div> */}
                </div>

                {/* Dashboard Options */}
                <div> 
                    <div className='flex flex-col gap-6 text-2xl xl:text-lg text-white'  style={{ fontWeight: 200}}>
                            {options.map((opt) => {
                                return(
                                    <div key={opt.id} className={`items-center cursor-pointer px-2 ${active === opt.id ? "text-blue-400 bg-white/5 rounded-2xl py-4" : "text-gray-400"}`} onClick={() => {
                                        onSelect(opt.id);
                                        setActive(opt.id);
                                    }} style={{fontWeight: 400}} >
                                        <FontAwesomeIcon icon={opt.icon} className='mr-2' />
                                        {opt.label}
                                    </div>
                                )
                        })}
                    </div>
                </div>
        </div>
        </>
    )
}

export default Sidebar