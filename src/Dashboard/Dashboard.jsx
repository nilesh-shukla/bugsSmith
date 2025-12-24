import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAsia, faPeopleLine, faRobot, faSkull, faPlus } from '@fortawesome/free-solid-svg-icons';

import Features from './dashboard-Component/Features';
import ProfileBarChart from './dashboard-Component/ProfileBarChart';
import ProfilePieChart from './dashboard-Component/ProfilePieChart';
import ProfileActivity from './dashboard-Component/ProfileActivity';
import SuspicionVSGenuineGraph from './dashboard-Component/SuspicionVSGenuineGraph';
import { div, label, option, p, rect } from "framer-motion/client";

function Dashboard() {

  const [vizEnabled, setVizEnabled] = useState(false);
  useEffect(() => {
    try {
      setVizEnabled(sessionStorage.getItem('viz_enabled') === 'true');
    }
    catch (e) {}
    const onStorage = (e) => {
      if (e.key === 'viz_enabled') setVizEnabled(e.newValue === 'true');
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const data = [
    { name: "Monday", abv: "Mon", value: 400},
    { name: "Tuesday", abv: "Tue", value: 700},
    { name: "Wednesday", abv: "Wed", value: 1100},
    { name: "Thursday", abv: "Thu", value: 2000},
    { name: "Friday", abv: "Fri", value: 800},
    { name: "Saturday", abv: "Sat", value: 1200},
    { name: "Sunday", abv: "Sun", value: 239},
  ];

  const time = [
    { label: "Weekly" },
    { label: "Monthly" },
    { label: "Yearly" }
  ];

  return (
    <div className='relative' >
      <img src="/dashboard-bg/dashboard.png" alt="" className='absolute opacity-30 w-full h-full z-0' />
      <div className='relative p-2 py-8 xl:pl-14 xl:pr-4 xl:py-4'>
        {/* Heading Section */}
        <div className='w-full flex justify-between items-center mb-10'>
          <h1 className='text-4xl md:text-[2.8rem] text-white font-semibold' style={{fontWeight: 400}}>Dashboard</h1>
          <button className='w-auto xl:w-1/8 px-3 py-2 flex justify-between text-lg text-white bg-blue-600 rounded-xl items-center cursor-pointer hover:bg-blue-400 transition-all duration-150'>
            <span className='hidden md:block'>Add File</span>
            <FontAwesomeIcon icon={faPlus} className='md:mr-2 text-base'/>
          </button>
        </div>

        {/* Content */}
        <div className='grid grid-cols-1 xl:grid-cols-2 grid-rows-[auto_auto] gap-4'>

          {/* Top-Left */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Img-Visualise */}
            <div className='relative flex bg-gradient-to-br from-[#2f8fee] via-[#135597] to-[#032f5b] p-4 rounded-3xl overflow-hidden'>
              <img src="/dashboard-card.png" className='absolute -rotate-24 -inset-6 opacity-30 md:opacity-70 z-10' />
              <div className='mt-auto space-y-2'>
                <h1 className='text-2xl text-white leading-tight'>Visualise your dataset for more precise and easy understanding</h1>
                <p className='leading-tight text-[#9dd5e3]'>Things like graphical representation using bars, pie-charts and distplots can help in better understanding of dataset</p>
                <button
                  disabled={!vizEnabled}
                  className={`p-2 w-full text-lg ${vizEnabled ? 'bg-[#76b4f1] hover:bg-blue-500 hover:scale-105 transition-all duration-200 cursor-pointer' : 'bg-gray-300 cursor-not-allowed'} rounded-xl hover:text-gray-300`} style={{fontWeight: 300}}
                  onClick={() => { if(!vizEnabled) return; }}>
                    Visualise
                </button>
              </div>
            </div>
            {/* Feature Section */}
            <div className='grid grid-rows-4 gap-2'>
              <Features icon={faEarthAsia} iconBgColor={"bg-violet-500"} title="Overall Profiles" numbers="21,350" changingRate="5%" rateColor={"text-purple-500"}/>
              <Features icon={faSkull} iconBgColor={"bg-blue-500"} title="Suspicious" numbers="8681" changingRate="10%" rateColor={"text-blue-500"}/>
              <Features icon={faRobot} iconBgColor={"bg-gray-500"} title="Bots" numbers="324" changingRate="15%" rateColor={"text-blue-400"}/>
              <Features icon={faPeopleLine} iconBgColor={"bg-green-500"} title="Clean" numbers="12,345" changingRate="20%" rateColor={"text-green-900"}/>
            </div>
          </div>

          {/* Bottom-Left */}
          {/* Suspicion V/S Genuine */}
          <SuspicionVSGenuineGraph />

          {/* Top-Right Side */}
          <div className='flex flex-col gap-4'>
            {/* Total Profile Chart */}
            <ProfileBarChart />
            {/* Profile Pie-Chart */}
            <ProfilePieChart />
          </div>

          {/* Bottom-Right */}
          {/* Profile Activity */}
          <ProfileActivity />

        </div>
      </div>
    </div>
    
  );
}

export default Dashboard