import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { ScatterChart, Scatter, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

const VIZ_URL = 'http://127.0.0.1:8000/viz-data';

function Visualise({vizData: initialVizData = null}) {

  const [vizData, setVizData] = useState(() => {
    try {
      if (initialVizData) return initialVizData;
      const stored = sessionStorage.getItem('viz_data');
      return stored ? JSON.parse(stored) : null;
    } 
    catch (e) {
      return null;
    }
  })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialVizData) return;
    let isMounted = true;
    setLoading(true);
    fetch(VIZ_URL)
      .then((r) => {
        if (!r.ok) throw new Error('No visual data yet');
        return r.json();
      }).then((json) => {
        if (isMounted) {
          setVizData(json);
          try { 
            sessionStorage.setItem('viz_data', JSON.stringify(json)); 
          }
          catch(e) {}
        }
      }).catch(() => {
        if (isMounted) setVizData(null);
      }).finally(() => {
        if (isMounted) setLoading(false);
        isMounted = false;
      })
  }, [initialVizData])

  // clear viz snapshot when the tab/window is closed
  useEffect(() => {
    const onBeforeUnload = () => {
      try { 
        sessionStorage.removeItem('viz_data'); 
      }
      catch (e) {}
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const data = {
    genuineData: (vizData && vizData.genuineData) ? vizData.genuineData : [],
    fakeData: (vizData && vizData.fakeData) ? vizData.fakeData : [],
    profilePicData: (vizData && vizData.profilePicData) ? vizData.profilePicData : [],
    activityData: (vizData && vizData.activityData) ? vizData.activityData : [],
    genuinePrivacy: (vizData && vizData.genuinePrivacy) ? vizData.genuinePrivacy : [],
    fakePrivacy: (vizData && vizData.fakePrivacy) ? vizData.fakePrivacy : [],
    featureImportance: (vizData && vizData.featureImportance) ? vizData.featureImportance : [],
  }

  const gPrivacyTotal = data.genuinePrivacy.reduce((s, e) => s+ (e.value || 0), 0) || 1;
  const fPrivacyTotal = data.fakePrivacy.reduce((s, e) => s+ (e.value || 0), 0) || 1;

  return (
    <div className="relative">

      <img src="/dashboard-bg/dashboard.png" className='absolute opacity-30 w-full h-full z-0 object-cover' />

      <div className="relative px-8 py-6">
        <div className='flex justify-between items-center mb-6 w-full'>
          <div>
            <h1 className="text-[3rem] text-white font-semibold">Visualise</h1>
            <p className="text-[#789]">A concise view of dataset distributions and relationships.</p>
          </div>
          <button
            className='flex gap-1 px-3 py-2 justify-between items-center bg-[#06539f] cursor-pointer hover:bg-blue-400 transition-all duration-150 text-white rounded-xl w-36 text-lg' onClick={() => {
              try { 
                sessionStorage.removeItem('viz_data');
              } 
              catch (e) {}
              setVizData(null);
            }}
          >
            Refresh
            <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Followers vs Following scatter */}
          <div className="bg-white w-full p-4 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Followers vs Following</h2>
                <div className="text-sm text-gray-500">Scatter plot showing relationship</div>
              </div>
            </div>

            { (data.genuineData.length === 0 && data.fakeData.length === 0) ? (
              <div className="h-72 flex items-center justify-center text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid stroke="#f3f4f6" />
                  <XAxis dataKey={"friends_count"} name="Following" tick={{ fill: '#8b939c' }} />
                  <YAxis dataKey={"followers_count"} name="Followers" tick={{ fill: '#8b939c' }} />
                  <Tooltip cursor={{ stroke: '#e6edf3' }} />
                  <Scatter name="Genuine" data={data.genuineData} fill="#06b6d4" />
                  <Scatter name="Fake" data={data.fakeData} fill="#ff6347" />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Profile picture distribution (stacked bars) */}
          <div className="bg-white w-full p-4 rounded-3xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-semibold">Profile Picture Distribution</h2>
                <div className="text-sm text-gray-500">Share of accounts with/without pictures</div>
              </div>
            </div>

            { data.profilePicData.length === 0 ? (
              <div className="h-72 flex items-center justify-center text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.profilePicData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            )}
          </div>

          <div></div>

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
                { data.genuinePrivacy.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-gray-400">No data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={data.genuinePrivacy} dataKey="value" cx="45%" cy="50%" outerRadius={70}>
                        {data.genuinePrivacy.map((entry, idx) => (
                          <Cell key={idx} fill={idx === 0 ? '#06b6d4' : '#0ea5a4'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {/* legend for genuine pie */}
                <div className="mt-3 flex flex-col items-center gap-2 w-full text-sm">
                  {data.genuinePrivacy.map((p, i) => (
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
                { data.fakePrivacy.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-gray-400">No data yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={data.fakePrivacy} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
                        {data.fakePrivacy.map((entry, idx) => (
                          <Cell key={idx} fill={idx === 0 ? '#fb923c' : '#f97316'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                )}

                {/* legend for fake pie */}
                <div className="mt-3 flex flex-col items-center gap-2 w-full text-sm">
                  {data.fakePrivacy.map((p, i) => (
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

            { data.featureImportance.length === 0 ? (
              <div className="h-80 flex items-center justify-center text-gray-400">No data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={340}>
                <BarChart layout="vertical" data={data.featureImportance} margin={{ left: 80 }}>
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
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Visualise