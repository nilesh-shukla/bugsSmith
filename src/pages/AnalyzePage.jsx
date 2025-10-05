import { useState } from 'react';

import Sidebar from '../components/Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import Visualize from '../Dashboard/Visualise';
import Settings from '../Dashboard/Settings';
import Analyze from '../Dashboard/Analyze';
import Integerate from '../Dashboard/Integerate';

function AnalyzePage() {
  const [activePage, setActivePage] = useState("dashboard");
  const renderPage = () => {
    switch(activePage){
        case "analyze":
            return <Analyze />;
        case "visualize":
            return <Visualize />;
        case "settings":
            return <Settings />;
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
                <div className='flex-1 h-full overflow-y-auto rounded-r-3xl bg-[#283a4d5b] p-2 scrollbar-hide'>
                    {renderPage()}
                </div>
            </div>
        </div>
    )
}

export default AnalyzePage