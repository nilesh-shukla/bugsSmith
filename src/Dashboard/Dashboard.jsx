import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarthAsia, faPeopleLine, faRobot, faSkull, faPlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import Features from './dashboard-Component/Features';
import ProfileBarChart from '../components/ProfileBarChart';
import ProfilePieChart from '../components/ProfilePieChart';
import { div, label, option, p, rect } from "framer-motion/client";

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

function Dashboard() {
  return (
    <div className='pl-14 pr-4 py-4'>
      {/* Heading Section */}
      <div className='w-full flex justify-between items-center mb-10'>
        <h1 className='text-[2.8rem] text-white font-semibold' style={{fontWeight: 400}}>Dashboard</h1>
        <button className='w-1/8 px-3 py-2 flex justify-between text-lg text-white bg-blue-600 rounded-xl items-center cursor-pointer hover:bg-blue-400 transition-all duration-150'>
          Add File
          <FontAwesomeIcon icon={faPlus} className='mr-2 text-base'/>
        </button>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        {/* Left */}
        <div className='flex flex-col gap-4'>
          {/* Feature Section */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='relative flex bg-gradient-to-br from-[#2f8fee] via-[#135597] to-[#032f5b] p-4 rounded-3xl overflow-hidden h-[40vh]'>
              <img src="/dashboard-card.png" className='absolute -rotate-24 -inset-6 opacity-70' />
              <div className='mt-auto space-y-2'>
                <h1 className='text-2xl text-white leading-tight'>Visualise your dataset for more precise and easy understanding</h1>
                <p className='leading-tight text-[#9dd5e3]'>Things like graphical representation using bars, pie-charts and distplots can help in better understanding of dataset</p>
                <button className='p-2 w-full text-lg bg-[#76b4f1] hover:bg-blue-500 hover:scale-105 transition-all duration-200  rounded-xl cursor-pointer hover:text-gray-300' style={{fontWeight: 300}}>Visualise</button>
              </div>
            </div>
            <div className='grid grid-rows-4 gap-2'>
              <Features icon={faEarthAsia} iconBgColor={"bg-violet-500"} title="Overall Profiles" numbers="21,350" changingRate="5%" rateColor={"text-purple-500"}/>
              <Features icon={faSkull} iconBgColor={"bg-blue-500"} title="Suspicious" numbers="8681" changingRate="10%" rateColor={"text-blue-500"}/>
              <Features icon={faRobot} iconBgColor={"bg-blue-200"} title="Bots" numbers="324" changingRate="15%" rateColor={"text-blue-400"}/>
              <Features icon={faPeopleLine} iconBgColor={"bg-green-500"} title="Clean" numbers="12345" changingRate="20%" rateColor={"text-green-500"}/>
            </div>
          </div>

          {/* Total Profile Chart */}
          <ProfileBarChart />

          {/* Profile Pie-Chart */}
          <ProfilePieChart />
          
        </div>
        {/* Right */}
        <div></div>
      </div>
    </div>
  );
}

export default Dashboard