import React from 'react'
import { ScatterChart, Scatter, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';


function Visualise() {
  const genuineData = [
    { followers: 150, following: 130 },
    { followers: 420, following: 400 },
    { followers: 860, following: 870 },
    { followers: 230, following: 200 },
    { followers: 720, following: 690 },
  ];

  const fakeData = [
    { followers: 10, following: 800 },
    { followers: 20, following: 900 },
    { followers: 5, following: 600 },
    { followers: 50, following: 700 },
    { followers: 15, following: 1000 },
  ];

  const profilePicData = [
    { label: "Has Picture", Genuine: 88, Fake: 22 },
    { label: "No Picture", Genuine: 12, Fake: 78 },
  ];

  const activityData = [
    { range: "0-10", Genuine: 5, Fake: 60 },
    { range: "10-50", Genuine: 20, Fake: 25 },
    { range: "50-200", Genuine: 40, Fake: 10 },
    { range: "200-1000", Genuine: 25, Fake: 4 },
    { range: "1000+", Genuine: 10, Fake: 1 },
  ];

  const freshnessData = [
    { month: "Jan 2024", Genuine: 20, Fake: 10 },
    { month: "Feb 2024", Genuine: 25, Fake: 15 },
    { month: "Mar 2024", Genuine: 18, Fake: 150 },
    { month: "Apr 2024", Genuine: 22, Fake: 200 },
    { month: "May 2024", Genuine: 28, Fake: 80 },
    { month: "Jun 2024", Genuine: 30, Fake: 40 },
  ];

  const genuinePrivacy = [
    { name: "Protected", value: 15 },
    { name: "Public", value: 85 },
  ];

  const fakePrivacy = [
    { name: "Protected", value: 65 },
    { name: "Public", value: 35 },
  ];
  const gPrivacyTotal = genuinePrivacy.reduce((s, e) => s + (e.value || 0), 0) || 1;
  const fPrivacyTotal = fakePrivacy.reduce((s, e) => s + (e.value || 0), 0) || 1;
  
  const featureImportance = [
    { feature: "Follower_Ratio", importance: 0.38 },
    { feature: "statuses_count", importance: 0.25 },
    { feature: "following_count", importance: 0.15 },
    { feature: "default_profile_image", importance: 0.10 },
    { feature: "protected", importance: 0.07 },
    { feature: "verified", importance: 0.03 },
    { feature: "account_age_days", importance: 0.02 },
  ];


  return (
    <div className="relative">
      <img src="/dashboard-bg/visual.png" className='absolute opacity-15 w-full h-full z-0 object-cover' />
      <div className="relative px-8 py-6">
        <h1 className="text-[3rem] text-white font-semibold">Visualise</h1>
        <p className="text-[#789] mb-6">A concise view of dataset distributions and relationships.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Followers vs Following scatter */}
          <div className="bg-white w-full p-4 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Followers vs Following</h2>
                <div className="text-sm text-gray-500">Scatter plot showing relationship</div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid stroke="#f3f4f6" />
                <XAxis dataKey={"following"} name="Following" tick={{ fill: '#8b939c' }} />
                <YAxis dataKey={"followers"} name="Followers" tick={{ fill: '#8b939c' }} />
                <Tooltip cursor={{ stroke: '#e6edf3' }} />
                <Scatter name="Genuine" data={genuineData} fill="#06b6d4" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Profile picture distribution (stacked bars) */}
          <div className="bg-white w-full p-4 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Profile Picture Distribution</h2>
                <div className="text-sm text-gray-500">Share of accounts with/without pictures</div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profilePicData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="genuineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#50E3C2" stopOpacity={0.9} />
                  </linearGradient>
                  <linearGradient id="fakeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6347" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#FF4500" stopOpacity={0.9} />
                  </linearGradient>
                </defs>

                <XAxis dataKey={"label"} tickLine={false} tick={{ fill: '#8b939c' }} />
                <YAxis />
                <Tooltip content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  return (
                    <div style={{ background: 'whitesmoke', padding: 8, borderRadius: 6 }}>
                      {payload.map((p) => (
                        <div key={p.dataKey} style={{ color: p.fill }}>{p.dataKey}: {p.value}</div>
                      ))}
                    </div>
                  )
                }} />
                <Legend />
                <Bar dataKey={"Genuine"} stackId={"a"} fill="url(#genuineGrad)" />
                <Bar dataKey={"Fake"} stackId={"a"} fill="url(#fakeGrad)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Freshness over time */}
          <div className="bg-white w-full p-4 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Account Freshness</h2>
                <div className="text-sm text-gray-500">New accounts over time by type</div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={freshnessData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f6" />
                <XAxis dataKey={"month"} tick={{ fill: '#8b939c' }} />
                <YAxis />
                <Tooltip content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: 'whitesmoke', padding: 8, borderRadius: 6 }}>
                      <div className="font-semibold text-[#31485f]">{d.month}</div>
                      <div style={{ color: '#1E90FF' }}>Genuine: {d.Genuine}</div>
                      <div style={{ color: '#FF6347' }}>Fake: {d.Fake}</div>
                    </div>
                  )
                }} />
                <Legend />
                <Bar dataKey={"Genuine"} fill="#1E90FF" />
                <Bar dataKey={"Fake"} fill="#FF6347" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Privacy pie charts */}
          <div className="bg-white w-full p-4 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Privacy (Genuine / Fake)</h2>
                <div className="text-sm text-gray-500">Protected vs Public accounts</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center">
                <h3 className="text-center text-sm font-semibold">Genuine — Privacy Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={genuinePrivacy} dataKey="value" cx="45%" cy="50%" outerRadius={70}>
                      {genuinePrivacy.map((entry, idx) => (
                        <Cell key={idx} fill={idx === 0 ? '#06b6d4' : '#0ea5a4'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* legend for genuine pie */}
                <div className="mt-3 flex flex-col items-center gap-2 w-full text-sm">
                  {genuinePrivacy.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span style={{ background: i === 0 ? '#06b6d4' : '#0ea5a4' }} className="w-3 h-3 rounded-sm inline-block" />
                      <span className="text-gray-700 w-24">{p.name}</span>
                      <span className="text-gray-500">{p.value}{gPrivacyTotal !== 100 ? ` (${Math.round((p.value / gPrivacyTotal) * 100)}%)` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h3 className="text-center text-sm font-semibold">Fake — Privacy Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={fakePrivacy} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
                      {fakePrivacy.map((entry, idx) => (
                        <Cell key={idx} fill={idx === 0 ? '#fb923c' : '#f97316'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* legend for fake pie */}
                <div className="mt-3 flex flex-col items-center gap-2 w-full text-sm">
                  {fakePrivacy.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span style={{ background: i === 0 ? '#fb923c' : '#f97316' }} className="w-3 h-3 rounded-sm inline-block" />
                      <span className="text-gray-700 w-24">{p.name}</span>
                      <span className="text-gray-500">{p.value}{fPrivacyTotal !== 100 ? ` (${Math.round((p.value / fPrivacyTotal) * 100)}%)` : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feature importance (vertical bars) full width */}
          <div className="md:col-span-2 bg-white w-full p-4 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Feature Importance</h2>
                <div className="text-sm text-gray-500">Model feature importances (normalized)</div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={340}>
              <BarChart layout="vertical" data={featureImportance} margin={{ left: 80 }}>
                <XAxis type="number" tick={{ fill: '#8b939c' }} />
                <YAxis type="category" dataKey="feature" tick={{ fill: '#374151' }} width={180} />
                <Tooltip content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  return (
                    <div style={{ background: 'whitesmoke', padding: 8, borderRadius: 6 }}>
                      <div>{payload[0].payload.feature}: {payload[0].value}</div>
                    </div>
                  )
                }} />
                <Bar dataKey={"importance"} fill="#4682B4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Visualise