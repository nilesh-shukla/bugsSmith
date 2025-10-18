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
        <div className='p-4 h-screen outfit-font'>
            <div className='flex h-full overflow-hidden'>
                {/* Sidebar */}
                <div className='h-full'>
                    <Sidebar onSelect={setActivePage} />
                </div>

                {/* Content Area */}
                <div className='flex-1 h-full overflow-y-auto rounded-r-3xl bg-[#283a4d5b] scrollbar-hide'>
                    {renderPage()}
                </div>
            </div>
        </div>
    )
}

export default AnalyzePage