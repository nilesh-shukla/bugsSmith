import React, { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from '../../api/axios';

function SuspicionVSGenuineGraph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/analytics/scan-count');
        if (res?.data?.success) {
          // backend returns monthlyBreakdown with { period: 'YYYY-MM-01', suspicious, genuine }
          const rows = res.data.monthlyBreakdown || [];
          const monthNames = [
            'January','February','March','April','May','June',
            'July','August','September','October','November','December'
          ];

          // aggregate by month index/name
          const agg = {};
          rows.forEach(r => {
            let monthName = r.period;
            try {
              const d = new Date(r.period);
              if (!isNaN(d)) monthName = monthNames[d.getMonth()];
            } catch (e) {}
            if (!agg[monthName]) agg[monthName] = { mname: monthName, gen: 0, sus: 0 };
            agg[monthName].gen += Number(r.genuine) || 0;
            agg[monthName].sus += Number(r.suspicious) || 0;
          });

          // ensure all months present in order
          const mapped = monthNames.map(name => agg[name] || { mname: name, gen: 0, sus: 0 });
          setData(mapped);
        } else {
          setError('Invalid response from server');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white w-full p-4 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex flex-col">
          <h1 className="text-xl xl:text-2xl">Suspicion Analytics</h1>
          <h2 className="text-xs xl:text-sm text-gray-600">Comparing suspicious and genuine profiles</h2>
        </div>

        {/* selector removed - showing all months */}
      </div>

      {loading ? (
        <div className="h-72 flex items-center justify-center">Loading...</div>
      ) : error ? (
        <div className="h-72 flex items-center justify-center text-red-500">{error}</div>
      ) : (
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            <XAxis dataKey={"mname"} tickFormatter={(v) => (v && v.slice ? v.slice(0, 3) : v)} tickLine={false} tick={{ fill: "#8b939c" }} />
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
      )}
    </div>
  );
}

export default SuspicionVSGenuineGraph;