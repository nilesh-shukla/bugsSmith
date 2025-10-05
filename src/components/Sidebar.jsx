import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faFileWaveform, faSitemap, faMicroscope, faChartSimple, faGears, faCodeCompare } from '@fortawesome/free-solid-svg-icons';

function Sidebar({onSelect}) {
  return (
    <div className='w-72 flex flex-col gap-10 rounded-l-3xl bg-[#3568b45d] px-4 py-8 sticky h-full'>
        {/* Title and History */}
        <div className="space-y-8">
            <h1 className="text-2xl text-gray-300">BugsSmith</h1>
            <div className="cursor-pointer">
                <div className="w-full flex justify-between  items-center px-3 py-4 rounded-2xl bg-[#074f978e] hover:scale-105 transition-all duration-200">
                    <div className='text-lg text-white flex items-center'>
                        <FontAwesomeIcon icon={faFileWaveform} className="mr-2 text-white" />
                        History
                    </div>
                    <FontAwesomeIcon icon={faChevronDown} className='text-[#63a9c5]'/>
                </div>
            </div>
        </div>
        {/* Dashboard Options */}
        <div> 
            <ul className='flex flex-col gap-4 text-lg text-white'  style={{ fontWeight: 200}}>
                <li className='items-center cursor-pointer' onClick={() => onSelect("dashboard")}>
                    <FontAwesomeIcon icon={faSitemap} className='mr-2 text-xl'/>
                    Dashboard
                </li>
                <li className='items-center cursor-pointer' onClick={() => onSelect("analyze")}>
                    <FontAwesomeIcon icon={faMicroscope} className='mr-2 text-xl'/>
                    Analyze
                </li>
                <li className='items-center cursor-pointer' onClick={() => onSelect("visualize")}>
                    <FontAwesomeIcon icon={faChartSimple} className='mr-2 text-xl'/>
                    Visualize
                </li>
                <li className='items-center cursor-pointer' onClick={() => onSelect("settings")}>
                    <FontAwesomeIcon icon={faGears} className='mr-2 text-xl'/>
                    Settings
                </li>
                <li className='items-center cursor-pointer' onClick={() => onSelect("integerations")}>
                    <FontAwesomeIcon icon={faCodeCompare} className='mr-2 text-xl'/>
                    Integerations
                </li>
            </ul>
        </div>
    </div>
  )
}

export default Sidebar