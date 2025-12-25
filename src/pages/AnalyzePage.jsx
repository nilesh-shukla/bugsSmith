import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api/api';

import Sidebar from '../components/Sidebar';
import Dashboard from '../Dashboard/Dashboard';
import Visualise from '../Dashboard/Visualise';
import Analyze from '../Dashboard/Analyze';
import Integerate from '../Dashboard/Integerate';

function AnalyzePage() {

  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  //Adding proper frontend route protection(Securing API calls)
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchData = async () => {
        try{
            //Before Calling token checking its existence
            //const token = localStorage.getItem('token');
            if(!token){
                navigate('/');
                return;
            }

            //Calling API
            // const response = await fetch('http://localhost:5000/analyze',{
            //     headers: {
            //         Authorization: `Bearer ${token}`
            //     }
            // });
            //Calling API using central JWT handling
            const result = await apiFetch('/analyze');

            // //JWT Expired or invalid
            // if(response.status === 401){
            //     logout();
            //     return;
            // }

            // const result = await response.json();
            // if(!response.ok){
            //     throw new Error(result.error || 'Unauthorized');
            // }

            setData(result);
        }
        catch(err){
            setError(err.message);

            //Remove Invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        }
    };
    fetchData();
  }, [token, logout]);

  if(error) return <div className='text-red-500'>{error}</div>
  if(!data) return <div>Loading...</div>

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
        <div className=' xl:p-4 h-full xl:h-screen outfit-font'>
            <div className='relative xl:flex w-full h-full xl:overflow-hidden'>
                
                {/* Sidebar */}
                <div className={`block xl:hidden fixed w-full md:w-1/2 xl:w-72 top-0 left-0 h-screen xl:h-full rounded-l-3xl z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transform transition-transform duration-300`}>
                    <Sidebar onSelect={setActivePage} onClose={() => setSidebarOpen(false)} />
                </div>

                <button className='block xl:hidden fixed top-1/2 left-0 z-40 pl-0 py-4 pr-3 bg-[#163c7a] text-white rounded-r-full' onClick={() => setSidebarOpen(true)} >
                    <FontAwesomeIcon icon={faEllipsisVertical} className='text-3xl' />
                </button>


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