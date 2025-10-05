import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Select from 'react-select';

const days = [
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

function ProfileBarChart() {
  return (
    <div className="bg-white w-full p-4 rounded-3xl">
        <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col gap-1">
            <h1 className="text-base">Total Profiles</h1>
            <div className="flex items-center gap-2">
                <h2 className="text-4xl">21,350</h2>
                <div className="text-white bg-blue-400 rounded-2xl items-center px-4 py-1">+1640 increase</div>
            </div>
            </div>
            <div className="relative inline-block">
            {/* In react-select we get much control over customization than in html- 'select' tag. Here the 'control' is used to decorate the body of select when nothing is selected, the 'menu' is used to decorate the dropdown list and 'option' is used to decorate each option in the list. */}
            {/* ...base is used to override the default styles. */}
            <Select
                options={time}
                defaultValue={time[0]}
                isSearchable={false}
                styles={{
                control: (base, state) => ({
                    ...base,
                    border: "none",
                    borderRadius: "15px",
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
        <ResponsiveContainer width={"100%"} height={300}>
            <BarChart data={days}>
            {/* defs are useful in defining gradients */}
            <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#50E3C2" stopOpacity={0.9}/>
                </linearGradient>
            </defs>
            <XAxis dataKey={"abv"} axisLine={false} tickLine={false} tick={{fill:"#8b939c"}}/>
            <YAxis hide/>
            <Tooltip cursor={false} content={({ payload }) => {
                if (!payload || payload.length === 0) return null;
                const fullName = payload[0].payload.name;
                return (
                    <div style={{ background: "whitesmoke", padding: "10px", borderRadius: "6px" }}>
                    <h1 className="font-semibold text-[#31485f]">{fullName}</h1>
                    {payload.map((item) => (
                        <p className="text-black" key={item.dataKey} style={{ color: item.fill }}>
                        {item.dataKey.toUpperCase()}: {item.value}
                        </p>
                    ))}
                    </div>
                );
                }}
            />
            <Bar dataKey={"value"} fill={"url(#barGradient)"} radius={[20, 20, 20, 20]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  )
}

export default ProfileBarChart