import { useState } from 'react';

import Sidebar from '../components/Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import Visualise from '../Dashboard/Visualise';
import Analyze from '../Dashboard/Analyze';
import Integerate from '../Dashboard/Integerate';

function AnalyzePage() {
  const [activePage, setActivePage] = useState("dashboard");

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
        <div className=' xl:p-4 h-screen outfit-font'>
            <div className='relative xl:flex w-full h-full xl:overflow-hidden'>
                {/* Sidebar */}
                {/* Sidebar: absolute overlay on mobile (high z), static on xl */}
                <div className='absolute w-full md:w-1/2 xl:w-72 h-screen xl:h-full z-50 xl:static'>
                    <Sidebar onSelect={setActivePage} />
                </div>

                {/* Content Area */}
                <div className='flex-1 w-full xl:w-auto h-full z-0 overflow-y-auto xl:rounded-r-3xl bg-[#243a4f] xl:bg-[#283a4d5b] scrollbar-hide'>
                    {renderPage()}
                </div>
            </div>
        </div>
    )
}

export default AnalyzePage