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
          <h2 className="text-sm text-gray-600">Comparing suspicious and genuine profiles</h2>
        </div>

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

      <ResponsiveContainer width={"100%"} height={300}>
        <BarChart data={month} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#50E3C2" stopOpacity={0.95} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.95} />
            </linearGradient>
            <linearGradient id="susGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.95} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.95} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey={"mname"} tickFormatter={(v) => v.slice(0, 3)} tickLine={false} tick={{ fill: "#8b939c" }} />
          <YAxis hide />
          <Tooltip
            cursor={false}
            content={({ payload }) => {
              if (!payload || payload.length === 0) return null;
              const datum = payload[0].payload;
              return (
                <div style={{ background: "whitesmoke", padding: "10px", borderRadius: 6 }}>
                  <div className="font-semibold text-[#31485f]">{datum.mname}</div>
                  <div style={{ color: '#50E3C2' }}>Genuine: {datum.gen}</div>
                  <div style={{ color: '#4A90E2' }}>Suspicious: {datum.sus}</div>
                </div>
              );
            }}
          />

          <Bar dataKey={"gen"} fill={"url(#genGrad)"} radius={[12, 12, 0, 0]} />
          <Bar dataKey={"sus"} fill={"url(#susGrad)"} radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SuspicionVSGenuineGraph