import React, { useMemo, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext.jsx';

// Defining Colors for pie charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const OTHER_COLOR = "#d1d5db";

function ProfilePieChart() {
    const { user } = useAuth();
    const [rawCounts, setRawCounts] = useState({ genuine: 0, suspicious: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
    let cancelled = false;

    async function fetchData() {
        setLoading(true);
        setError(null);

        try {
            const params = {};
            if (user?.id) params.userId = user.id;

            const res = await axios.get('/api/analytics/scan-count', { params });

            const payload = res?.data || {};

            const rows = payload.monthlyBreakdown || [];

            let gen = 0;
            let sus = 0;

            rows.forEach((r) => {
                gen += Number(r.genuine || 0);
                sus += Number(r.suspicious || 0);
            });

            if (!cancelled) {
                setRawCounts({
                    genuine: gen,
                    suspicious: sus,
                });
            }
        } catch (err) {
            console.error('Failed to fetch profile distribution', err);

            if (!cancelled) {
                setError(err?.message || 'Failed to fetch');
            }
        } finally {
            if (!cancelled) {
                setLoading(false);
            }
        }
    }

    fetchData();

    return () => {
        cancelled = true;
    };
}, [user]);

    const data = useMemo(() => {
        const items = [
            { name: 'Genuine', value: rawCounts.genuine },
            { name: 'Suspicious', value: rawCounts.suspicious }
        ];
        const total = items.reduce((s, i) => s + (i.value || 0), 0) || 0;
        const withPercent = items.map(d => ({ ...d, percent: total ? Math.round((d.value / total) * 100) : 0 }));
        return { total, items: withPercent };
    }, [rawCounts]);

    return (
        <div className="bg-white w-full p-4 rounded-3xl">
        <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl md:text-2xl">Monthly Profile Distributions</h1>
        </div>
        {loading ? (
            <div className="h-72 flex items-center justify-center">Loading...</div>
        ) : error ? (
            <div className="h-72 flex items-center justify-center text-red-500">{error}</div>
        ) : (
        <div className='grid grid-cols-3 gap-4 items-center'>
            <div className='col-span-2 relative'>
                <ResponsiveContainer width={"100%"} height={300}>
                    <PieChart>
                        <Pie data={data.items} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={2} className='hidden md:block'>
                            {data.items.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'Genuine' ? COLORS[1] : COLORS[0]} />
                            ))}
                        </Pie>
                        <Pie data={data.items} dataKey="value" cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} className='block md:hidden'>
                            {data.items.map((entry, index) => (
                                <Cell key={`cell-sm-${index}`} fill={entry.name === 'Genuine' ? COLORS[1] : COLORS[0]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, name, props) => {
                            const percent = data.items.find(i => i.name === props.payload?.name)?.percent;
                            return [`${value.toLocaleString()} (${percent ?? Math.round((value / (data.total || 1)) * 100)}%)`, name];
                        }} />
                    </PieChart>
                </ResponsiveContainer>

                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                    <div className='text-center'>
                        <p className='text-gray-700 text-sm md:text-base font-semibold'>{data.total.toLocaleString()}</p>
                        <p className='text-gray-400 text-xs md:text-sm'>Total Profiles</p>
                    </div>
                </div>
            </div>
            {/* Legends */}
            <div className='flex flex-col gap-4'>
                {data.items.map((entry, index) => {
                    const percent = entry.percent;
                    const color = entry.name === 'Genuine' ? COLORS[1] : COLORS[0];
                    return (
                        <div key={index} className='flex items-center justify-between'>
                            <div className='flex gap-1 items-center'>
                                <div className='w-4 h-4 rounded-sm' style={{backgroundColor: color}} />
                                <p className='text-gray-700 text-xs md:text-base'>{entry.name}</p>
                            </div>
                            <p className='text-gray-500 text-xs md:text-sm'>{percent}% • {entry.value.toLocaleString()}</p>
                        </div>
                    )
                })}
            </div>
        </div>
        )}
    </div>
  )
}

export default ProfilePieChart