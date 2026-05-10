import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import Select from 'react-select';
import axios from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext.jsx';

const timeOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
];

function zeroPad(n) {
    return String(n).padStart(2, '0');
}

function isoDateKey(d) {
    // yyyy-mm-dd
    return `${d.getFullYear()}-${zeroPad(d.getMonth() + 1)}-${zeroPad(d.getDate())}`;
}

function isoMonthKey(d) {
    // yyyy-mm
    return `${d.getFullYear()}-${zeroPad(d.getMonth() + 1)}`;
}

function yearKey(d) {
    return String(d.getFullYear());
}

function buildRange(range) {
    const now = new Date();
    if (range === 'monthly') {
        // last 12 months (oldest first)
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ key: isoMonthKey(d), name: d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }), abv: d.toLocaleDateString(undefined, { month: 'short' }) });
        }
        return months;
    }
    if (range === 'yearly') {
        // last 10 years
        const years = [];
        for (let i = 9; i >= 0; i--) {
            const d = new Date(now.getFullYear() - i, 0, 1);
            years.push({ key: yearKey(d), name: yearKey(d), abv: yearKey(d) });
        }
        return years;
    }
    // daily: last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        days.push({ key: isoDateKey(d), name: isoDateKey(d), abv: d.toLocaleDateString(undefined, { weekday: 'short' }) });
    }
    return days;
}

function keyFromPeriod(period, range) {
    const d = new Date(period + 'T00:00:00');
    if (Number.isNaN(d.getTime())) return null;
    if (range === 'monthly') return isoMonthKey(d);
    if (range === 'yearly') return yearKey(d);
    return isoDateKey(d);
}

function mapApiRows(rows = [], range) {
    const target = buildRange(range);
    const map = new Map();
    try {
        console.debug && console.debug('mapApiRows rows:', rows);
        console.debug && console.debug('mapApiRows target:', target);
    } catch (e) {
        // ignore logging errors
    }
    (rows || []).forEach((r) => {
        const k = keyFromPeriod(r.period, range);
        const v = Number(r.total) || 0;
        try { console.debug && console.debug('mapApiRows mapping', r.period, '->', k, 'value', v); } catch (e) {}
        if (!k) return;
        map.set(k, (map.get(k) || 0) + v);
    });
    return target.map((t) => ({ name: t.name, abv: t.abv, value: map.get(t.key) || 0 }));
}

function ProfileBarChart() {
    const { user } = useAuth();
    const [selectedRange, setSelectedRange] = useState('daily');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function fetchData() {
            setLoading(true);
            try {
                const params = {};
                if (user?.id) params.userId = user.id;
                const res = await axios.get('/api/analytics/scan-count', { params });
                const payload = res?.data || {};
                const rows = payload[selectedRange] || [];
                const mapped = mapApiRows(rows, selectedRange);
                if (!cancelled) setData(mapped);
            } catch (err) {
                console.error('Failed to fetch scan counts', err);
                if (!cancelled) setData(mapApiRows([], selectedRange));
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        fetchData();
        return () => { cancelled = true; };
    }, [selectedRange, user]);

    const total = data.reduce((s, d) => s + (d.value || 0), 0);

    return (
        <div className="bg-white w-full p-4 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col gap-1">
                        <h1 className="text-lg xl:text-base">Total Profiles</h1>
                        <div className="flex items-center gap-2">
                                <h2 className="text-2xl xl:text-4xl">{total.toLocaleString()}</h2>
                                <div className="text-white bg-blue-400 rounded-2xl items-center px-1 md:px-4 py-1 text-xs">{loading ? 'Loading...' : '+0 increase'}</div>
                        </div>
                        </div>
                        <div className="relative inline-block">
                        <Select
                                options={timeOptions}
                                defaultValue={timeOptions[0]}
                                value={timeOptions.find((o) => o.value === selectedRange)}
                                isSearchable={false}
                                onChange={(opt) => setSelectedRange(opt?.value)}
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
                        <BarChart data={data}>
                        <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.9}/>
                                <stop offset="95%" stopColor="#50E3C2" stopOpacity={0.9}/>
                                </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#e5e7eb" horizontal={true} vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey={"abv"} axisLine={false} tickLine={false} tick={{fill:"#8b939c"}}/>
                        <YAxis hide/>
                        <Tooltip cursor={false} content={({ payload }) => {
                            if (!payload || payload.length === 0) return null;
                            const p = payload[0].payload;
                            const fullName = p.name;
                            let displayName = fullName;
                            if (selectedRange === 'daily') {
                                const dt = new Date(fullName + 'T00:00:00');
                                if (!Number.isNaN(dt.getTime())) {
                                    displayName = dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                                }
                            }
                            return (
                                <div style={{ background: "whitesmoke", padding: "10px", borderRadius: "6px" }}>
                                <h1 className="font-semibold text-[#31485f]">{displayName}</h1>
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