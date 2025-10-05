import { div } from 'framer-motion/client';
import Select from 'react-select';
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const time = [
  { label: "Weekly" },
  { label: "Monthly" },
  { label: "Yearly" }
];

const profile = [
    { name: "Suspicious", value: 3582 },
    { name: "Impersonator", value: 1648 },
    { name: "Bots", value: 698},
    { name: "Genuine", value: 33528}
];

// Defining Colors for pie charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function ProfilePieChart() {
  const total = profile.reduce((sum, item) => sum + item.value, 0)
  
  return (
    <div className="bg-white w-full p-4 rounded-3xl">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl">Profile Distributions</h1>
            <div className="relative inline-block">
            <Select
                options={time}
                defaultValue={time[0]}
                isSearchable={false}
                styles={{
                control: (base, state) => ({
                    ...base,
                    border: "none",
                    borderRadius: "15px",
                    cursor: "pointer",
                    backgroundColor: "#f1f4f9",
                    boxShadow: state.isFocused ? "none" : base.boxShadow,
                }),
                dropdownIndicator: (base) => ({
                    ...base,
                    color: "#1a2332",
                }),
                menu: (base) => ({
                    ...base,
                    backgroundColor: "#232e3c",
                }),
                option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#31485f" : "#232e3c",
                    color: "#e0e6ed",
                    cursor: "pointer",
                }),
                }}                  
            />
            </div>
        </div>
        <div className='grid grid-cols-3 gap-4 items-center'>
            <ResponsiveContainer width={"100%"} height={300} className={`col-span-2`}>
                <PieChart>
                    <Pie data={profile} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={2}>
                        {profile.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            {/* Legends */}
            <div className='flex flex-col gap-4'>
                {profile.map((entry, index) => {
                    const percent = Math.round((entry.value / total) * 100);
                    return(
                        <div key={index} className='flex items-center justify-between'>
                            <div className='flex gap-1 items-center'>
                                <div className='w-4 h-4 rounded-sm' style={{backgroundColor: COLORS[index % COLORS.length]}} />
                                <p className='text-gray-700'>{entry.name}</p>
                            </div>
                            <p className='text-gray-500 text-sm'>{percent}%</p>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default ProfilePieChart