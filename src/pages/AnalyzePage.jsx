import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

import Sidebar from '../components/Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import Visualise from '../Dashboard/Visualise';
import Analyze from '../Dashboard/Analyze';
import Integerate from '../Dashboard/Integerate';

function AnalyzePage() {

  const [activePage, setActivePage] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch(activePage){
        case "analyze":
            return <Analyze />;
        case "visualise":
            return <Visualise />;
        case "integerations":
            return <Integerate />;
        default:
            return <Dashboard />;
    }
  }

    return (
        <div className=' xl:p-4 h-full outfit-font'>
            <div className='relative xl:flex w-full h-full xl:overflow-hidden'>
                
                {/* Sidebar */}
                <div className={`absolute w-full md:w-1/2 xl:w-72 top-0 left-0 h-screen xl:h-full z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-300`}>
                    <Sidebar onSelect={setActivePage} onClose={() => setSidebarOpen(false)} />
                </div>

                <button className='fixed top-1/2 left-0 z-40 px-1 py-2 bg-[#163c7a] text-white rounded-r-full' onClick={() => setSidebarOpen(true)} aria-label='Open sidebar'>
                    <FontAwesomeIcon icon={faEllipsisVertical} className='text-2xl' />
                </button>

                {/* Content Area */}
                <div className='flex-1 w-full xl:w-auto h-full z-0 overflow-y-auto xl:rounded-r-3xl bg-[#243a4f] xl:bg-[#283a4d5b] scrollbar-hide'>
                    {renderPage()}
                </div>
            </div>
        </div>
    )
}

export default AnalyzePage