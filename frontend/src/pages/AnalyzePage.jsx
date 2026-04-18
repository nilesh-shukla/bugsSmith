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
            return <Analyze openSidebar={() => setSidebarOpen(true)} />;
        case "visualise":
            return <Visualise openSidebar={() => setSidebarOpen(true)} />;
        case "integerations":
            return <Integerate openSidebar={() => setSidebarOpen(true)} />;
        default:
            return <Dashboard openSidebar={() => setSidebarOpen(true)} />;
    }
  }

    return (
        <div className=' xl:p-4 h-full xl:h-screen outfit-font'>
            <div className='relative xl:flex w-full h-full xl:overflow-hidden'>
                
                {/* Sidebar */}
                <div className={`block xl:hidden fixed w-full md:w-1/2 xl:w-72 top-0 left-0 h-screen xl:h-full rounded-l-3xl z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-300`}>
                    <Sidebar onSelect={setActivePage} onClose={() => setSidebarOpen(false)} />
                </div>

                {/* Mobile menu: moved inline into page headings; fixed button removed */}


                {/* Desktop Sidebar */}
                <div className='hidden xl:block w-72 h-full'>
                    <Sidebar onSelect={setActivePage} />
                </div>

                {/* Content Area */}
                <div className='flex-1 w-full xl:w-auto h-full z-0 overflow-y-auto xl:rounded-l-none xl:rounded-r-3xl bg-[#243a4f] xl:bg-[#283a4d5b] scrollbar-hide'>
                    {renderPage()}
                </div>
            </div>
        </div>
    )
}

export default AnalyzePage