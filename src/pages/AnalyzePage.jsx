import { useState } from 'react';

import Sidebar from '../components/Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import Visualize from '../Dashboard/Visualise';
import Settings from '../Dashboard/Settings';
import Integrations from '../Dashboard/Integerate';
import Analyze from '../Dashboard/Analyze';

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
        case "integrations":
            return <Integrations />;
        default:
            return <Dashboard />;
    }
  }

  return (
    <div className='p-4 outfit-font'>
        <div className='flex h-screen'>
            <Sidebar onSelect={setActivePage} />
            {/* Content Area */}
            <div className='w-full rounded-r-3xl bg-[#283a4d5b] p-2'>{renderPage()}</div>
        </div>
    </div>
  )
}

export default AnalyzePage