import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFileWaveform, faSitemap, faMicroscope, faChartSimple, faGears, faCodeCompare, faIdBadge, faMagnifyingGlassChart, faGear, faCodeMerge  } from '@fortawesome/free-solid-svg-icons';
import { button } from 'framer-motion/client';
import { Link } from 'react-router-dom';
import { icon } from '@fortawesome/fontawesome-svg-core';

function Sidebar({onSelect}) {

  const [active, setActive] = useState("dashboard")

  const options = [
    { id: "dashboard", label: "Dashboard", icon : faIdBadge  },
    { id: "analyze", label: "Analyze", icon : faMagnifyingGlassChart },
    { id: "visualise", label: "Visualise", icon : faChartSimple } ,
    { id: "integerations", label: "Integerations", icon : faCodeMerge }
  ];

  return (
    <div className='w-72 flex flex-col gap-10 rounded-l-3xl bg-[#3568b45d] px-4 py-8 sticky h-full'>
        {/* Title and History */}
        <div className="space-y-8">
            <div><Link to="/" ><h1 className="text-2xl text-gray-300">BugsSmith</h1></Link></div>
            <div className="cursor-pointer">
                <div className="w-full flex justify-between  items-center px-3 py-4 rounded-2xl bg-[#074f978e] hover:scale-105 transition-all duration-200">
                    <div className='text-lg text-white flex items-center'>
                        History
                    </div>
                    <FontAwesomeIcon icon={faChevronDown} className='text-[#63a9c5]'/>
                </div>
            </div>
        </div>
        {/* Dashboard Options */}
        <div> 
            <div className='flex flex-col gap-4 text-lg text-white'  style={{ fontWeight: 200}}>
                    {options.map((opt) => {
                        return(
                            <div key={opt.id} className={`items-center cursor-pointer ${active === opt.id ? "text-blue-400" : ""}`} onClick={() => {
                                onSelect(opt.id);
                                setActive(opt.id);
                            }}>
                                <FontAwesomeIcon icon={opt.icon} className='mr-2 text-lg' />
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