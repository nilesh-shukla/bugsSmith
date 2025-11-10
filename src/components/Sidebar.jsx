import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFileWaveform, faSitemap, faMicroscope, faChartSimple, faGears, faCodeCompare, faIdBadge, faMagnifyingGlassChart, faGear, faCodeMerge, faCross, faXmark, faRightFromBracket  } from '@fortawesome/free-solid-svg-icons';
import { button } from 'framer-motion/client';
import { Link } from 'react-router-dom';
import { icon } from '@fortawesome/fontawesome-svg-core';

function Sidebar({onSelect, className}) {

  const [active, setActive] = useState("dashboard")

  const options = [
    { id: "dashboard", label: "Dashboard", icon : faIdBadge  },
    { id: "analyze", label: "Analyze", icon : faMagnifyingGlassChart },
    { id: "visualise", label: "Visualise", icon : faChartSimple } ,
    { id: "integerations", label: "Integerations", icon : faCodeMerge }
  ];

  return (
    <div className={`w-full flex flex-col xl:gap-10 justify-between xl:justify-normal xl:rounded-l-3xl bg-gradient-to-br from-[#021f3b] to-[#3167b9] xl:bg-[#3568b45d] px-4 py-8 sticky h-full ${className}`}>

        <div className='flex flex-col gap-8'>
            <div className='flex w-full justify-between items-center text-[#aeb4ba] text-lg'>
                <FontAwesomeIcon icon={faXmark} />
                <div>
                    <button className='flex gap-2 items-center'>
                        <FontAwesomeIcon icon={faRightFromBracket}/>
                        Log out
                    </button>
                </div>
            </div>
            {/* Title and History */}
            <div className="flex flex-col justify-center items-center space-y-8">
                <div className='w-1/2'>
                    <img src={"/web-logo.png"} alt="" className='w-full h-full' />
                </div>
                <div><Link to="/" ><h1 className="text-4xl font-bold text-gray-300">BugsSmith</h1></Link></div>
            </div>
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
  )
}

export default Sidebar