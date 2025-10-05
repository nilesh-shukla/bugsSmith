import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Select from 'react-select';
import { faL } from "@fortawesome/free-solid-svg-icons";

const time = [
  { label: "Weekly" },
  { label: "Monthly" },
  { label: "Yearly" }
];

const month = [
    { mname: "January", gen: 13231, sus: 382 },
    { mname: "February", gen: 15847, sus: 2648 },
    { mname: "March", gen: 12321, sus: 987 },
    { mname: "April", gen: 17892, sus: 5204 },
    { mname: "May", gen: 13104, sus: 856 },
    { mname: "June", gen: 15923, sus: 1457 },
    { mname: "July", gen: 14218, sus: 1399 },
    { mname: "August", gen: 15531, sus: 1256 },
    { mname: "September", gen: 16812, sus: 732 },
    { mname: "October", gen: 12309, sus: 3048 },
    { mname: "November", gen: 14765, sus: 1915 },
    { mname: "December", gen: 11024, sus: 1203 }
]

function SuspicionVSGenuineGraph() {

  return (
    <div className="bg-white w-full p-4 rounded-3xl">
        <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
                <h1 className="text-2xl">Suspicion Analytics</h1>
                <h2 className="text-base">Compairing suspicious and real profiles</h2>
            </div>
            <button className="px-3 py-2 text-white bg-[#0d70d4] hover:bg-[#5580ab] cursor-pointer transition-all duration-200 rounded-2xl">View Report</button>
        </div>
        <ResponsiveContainer width={"100%"} height={300}>   
            <BarChart data={month}>
                <CartesianGrid vertical={false} horizontal={true} />
                <XAxis dataKey={"mname"} tickFormatter={(value) => value.slice(0,3)} tickLine={false} tick={{fill:"#8b939c"}}/>
                <YAxis dataKey={"gen"} tickLine={false} tick={{fill:"#8b939c"}} axisLine={false}/>
                <Tooltip content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const datum = payload[0].payload;
                    return (
                        <div style={{ background: "whitesmoke", padding: "10px", borderRadius: "6px" }}>
                          <h1 className="font-semibold text-[#31485f]">{datum.mname}</h1>
                          <p style={{ color: '#4A90E2', margin: 0 }}>Genuine: {datum.gen}</p>
                          <p style={{ color: '#d42b0d', margin: 0 }}>Suspicious: {datum.sus}</p>
                        </div>
                    );
                }}
                />
                <Bar dataKey={"gen"} radius={[20, 20, 0, 0]} fill={"#50E3C2"} />
                <Bar dataKey={"sus"} radius={[20, 20, 0, 0]} fill={"#4A90E2"} />
            </BarChart>        
        </ResponsiveContainer>
    </div>
  )
}

export default SuspicionVSGenuineGraph