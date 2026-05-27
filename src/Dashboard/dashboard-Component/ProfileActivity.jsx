import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faEye } from "@fortawesome/free-solid-svg-icons";
import axios from '../../api/axios';

const riskColor = (cat) => {
  if (!cat) return 'text-gray-400';
  if (cat === 'Genuine') return 'text-green-500';
  if (cat === 'Monitor') return 'text-yellow-400';
  if (cat === 'Suspicious') return 'text-red-500';
  return 'text-gray-400';
};

function ProfileActivity() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [total, setTotal] = useState(0);

  // filters
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [risk, setRisk] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sort, setSort] = useState('date:desc');

  // detail panel
  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit };
        if (search) params.search = search;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (sort) params.sort = sort;
        // risk filter map to min/max
        if (risk === 'Genuine') { params.riskMin = 0; params.riskMax = 30; }
        else if (risk === 'Monitor') { params.riskMin = 31; params.riskMax = 60; }
        else if (risk === 'Suspicious') { params.riskMin = 61; params.riskMax = 100; }

        const res = await axios.get('/api/profiles', { params });
        if (res?.data?.success) {
          let rows = res.data.data || [];
          // Normalize backend variations into UI-friendly shape
          const normalize = (raw) => {
            const input = raw.input || raw;
            const src = input || {};
            const rawMeta = raw.raw || {};
            const id = raw.id || raw.entryId || src.id || raw.entryId || raw.input?.id;
            const username = src.userName || src.username || raw.userName || raw.username || src.user || '-';
            const displayName = src.displayName || src.display_name || src.display || raw.displayName || username;
            let riskScore = raw.riskScore ?? raw.risk_score ?? raw.risk ?? rawMeta.risk_score ?? 0;
            riskScore = Number.isFinite(+riskScore) ? +riskScore : 0;
            let confidence = raw.confidence ?? raw.confidence_percent ?? rawMeta.confidence ?? 0;
            if (confidence && confidence <= 1) confidence = Math.round(confidence * 100);
            confidence = Number.isFinite(+confidence) ? +confidence : 0;
            const featureContributions = raw.featureContributions ?? raw.feature_contributions ?? rawMeta.feature_contributions ?? rawMeta.featureContributions ?? {};
            const anomalies = raw.anomalies ?? rawMeta.anomalies ?? [];
            const followers = src.followers ?? src.num_followers ?? raw.followers ?? 0;
            const following = src.following ?? src.num_follows ?? raw.following ?? 0;
            const posts = src.posts ?? src.num_posts ?? raw.posts ?? 0;
            const profilePicture = src.profilePicture ?? src.profile_pic ?? raw.profilePicture ?? raw.profile_pic ?? null;
            const accountPrivacy = src.accountPrivacy ?? raw.accountPrivacy ?? raw.account_privacy ?? null;
            const missingFeatures = src.missingFeatures ?? raw.missingFeatures ?? raw.missing_features ?? null;
            const platformVal = src.platform ?? raw.platform ?? '-';
            // Map numeric score to simple categories used by UI
            const scoreToCategory = (s) => {
              const n = Number.isFinite(+s) ? +s : 0;
              if (n <= 30) return 'Genuine';
              if (n <= 60) return 'Monitor';
              return 'Suspicious';
            };

            return {
              id,
              username,
              displayName,
              riskScore,
              riskCategory: raw.riskCategory || raw.status || scoreToCategory(riskScore),
              confidence,
              featureContributions,
              anomalies,
              followers,
              following,
              posts,
              profilePicture,
              accountPrivacy,
              missingFeatures,
              platform: platformVal,
              analysisType: raw.analysis?.type || raw.type || src.analysisType || null,
              scanDate: raw.scanDate || raw.createdAt || src.createdAt || raw.input?.createdAt || null,
            };
          };

          rows = rows.map(r => normalize(r));
          // client-side platform filter (backend doesn't accept platform in current API)
          if (platform && platform !== 'All') rows = rows.filter(r => String(r.platform || '').toLowerCase() === platform.toLowerCase());
          setProfiles(rows);
          setTotal(res.data.meta?.total || rows.length);
        } else {
          setError('Failed to load profiles');
        }
      } catch (err) {
        setError(err.message || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [page, limit, search, platform, risk, startDate, endDate, sort]);

  const openDetail = async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const res = await axios.get(`/api/profiles/${id}`);
      if (res?.data?.success) {
        const d = res.data.detail || res.data;
        // normalize single detail shape (reuse normalization logic)
        const normalizeOne = (raw) => {
          const input = raw.input || raw;
          const src = input || {};
          const rawMeta = raw.raw || {};
          const id = raw.id || raw.entryId || src.id || raw.input?.id;
          const username = src.userName || src.username || raw.userName || raw.username || src.user || '-';
          const displayName = src.displayName || src.display_name || raw.displayName || username;
          let riskScore = raw.riskScore ?? raw.risk_score ?? raw.risk ?? rawMeta.risk_score ?? 0;
          riskScore = Number.isFinite(+riskScore) ? +riskScore : 0;
          let confidence = raw.confidence ?? raw.confidence_percent ?? rawMeta.confidence ?? 0;
          if (confidence && confidence <= 1) confidence = Math.round(confidence * 100);
          confidence = Number.isFinite(+confidence) ? +confidence : 0;
          const featureContributions = raw.featureContributions ?? raw.feature_contributions ?? rawMeta.feature_contributions ?? rawMeta.featureContributions ?? {};
          const anomalies = raw.anomalies ?? rawMeta.anomalies ?? [];
          const followers = src.followers ?? src.num_followers ?? raw.followers ?? 0;
          const following = src.following ?? src.num_follows ?? raw.following ?? 0;
          const posts = src.posts ?? src.num_posts ?? raw.posts ?? 0;
          const profilePicture = src.profilePicture ?? src.profile_pic ?? raw.profilePicture ?? raw.profile_pic ?? null;
          const accountPrivacy = src.accountPrivacy ?? raw.accountPrivacy ?? raw.account_privacy ?? null;
          const missingFeatures = src.missingFeatures ?? raw.missingFeatures ?? raw.missing_features ?? null;
          const platformVal = src.platform ?? raw.platform ?? '-';
          const scoreToCategory = (s) => {
            const n = Number.isFinite(+s) ? +s : 0;
            if (n <= 30) return 'Genuine';
            if (n <= 60) return 'Monitor';
            return 'Suspicious';
          };
          return {
            id,
            username,
            displayName,
            riskScore,
            riskCategory: raw.riskCategory || raw.status || scoreToCategory(riskScore),
            confidence,
            featureContributions,
            anomalies,
            followers,
            following,
            posts,
            profilePicture,
            accountPrivacy,
            missingFeatures,
            platform: platformVal,
            analysis: raw.analysis || src.analysis || null,
            scanDate: raw.scanDate || raw.createdAt || src.createdAt || raw.input?.createdAt || null,
            history: raw.history || rawMeta.history || []
          };
        };

        setDetail(normalizeOne(d));
      } else setDetail({ error: 'Detail not available' });
    } catch (err) {
      setDetail({ error: err.message });
    } finally {
      setDetailLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '-';
    try { return new Date(iso).toLocaleDateString(); } catch (e) { return iso; }
  };

  return (
    <div className="bg-white w-full p-4 rounded-3xl relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Profile Activity</h1>
        {/* Filter button */}
        <div className="relative">
          <button onClick={() => setShowFilters(s => !s)} className="bg-gray-200 hover:bg-gray-400 text-sm cursor-pointer px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2">
            <FontAwesomeIcon icon={faEllipsis} />
            <span>Filters</span>
          </button>
          {showFilters && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white border rounded shadow-lg z-50 p-4">
                <div className="flex flex-col gap-2">
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search username" className="px-3 py-2 border rounded-md" />
                  <select value={platform} onChange={e => setPlatform(e.target.value)} className="px-3 py-2 border rounded-md">
                    <option>All</option>
                    <option>Instagram</option>
                    <option>LinkedIn</option>
                    <option>Twitter</option>
                    <option>Threads</option>
                  </select>
                  <select value={risk} onChange={e => setRisk(e.target.value)} className="px-3 py-2 border rounded-md">
                    <option>All</option>
                    <option>Genuine</option>
                    <option>Monitor</option>
                    <option>Suspicious</option>
                  </select>
                  <div className="flex gap-2">
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-3 py-2 border rounded-md w-1/2" />
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-3 py-2 border rounded-md w-1/2" />
                  </div>
                  <select value={sort} onChange={e => setSort(e.target.value)} className="px-3 py-2 border rounded-md">
                    <option value="date:desc">Newest</option>
                    <option value="date:asc">Oldest</option>
                    <option value="score:desc">Score High→Low</option>
                    <option value="score:asc">Score Low→High</option>
                    <option value="followers:desc">Followers</option>
                  </select>
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => { setSearch(''); setPlatform('All'); setRisk('All'); setStartDate(''); setEndDate(''); setSort('date:desc'); }} className="px-3 py-1 border rounded text-sm">Clear</button>
                    <button onClick={() => setShowFilters(false)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Apply</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[60vh] pr-2">

      {/* Table */}
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Platform</th>
              <th className="px-4 py-2 text-left">Scan Date</th>
              <th className="px-4 py-2 text-left">Suspicion Score</th>
              <th className="px-4 py-2 text-left">Risk</th>
              <th className="px-4 py-2 text-left">Confidence</th>
              <th className="px-4 py-2 text-left">Followers</th>
              <th className="px-4 py-2 text-left">Following</th>
              <th className="px-4 py-2 text-left">Posts</th>
              <th className="px-4 py-2 text-left">Pic</th>
              <th className="px-4 py-2 text-left">Privacy</th>
              <th className="px-4 py-2 text-left">Missing</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {loading ? (
              <tr><td colSpan={15} className="p-6 text-center">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan={15} className="p-6 text-center text-red-500">{error}</td></tr>
            ) : profiles.length === 0 ? (
              <tr><td colSpan={15} className="p-6 text-center">No profiles found</td></tr>
            ) : profiles.map(p => (
              <tr key={p.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => openDetail(p.id)}>
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3">{p.username || p.displayName || '-'}</td>
                <td className="px-4 py-3">{p.platform || '-'}</td>
                <td className="px-4 py-3">{formatDate(p.scanDate)}</td>
                <td className="px-4 py-3">{p.riskScore}%</td>
                <td className={`px-4 py-3 ${riskColor(p.riskCategory)}`}>{p.riskCategory || '-'}</td>
                <td className="px-4 py-3 w-36">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${Math.min(100, (p.confidence ?? 0) * (p.confidence <= 1 ? 100 : 1))}%` }} />
                  </div>
                </td>
                <td className="px-4 py-3">{p.followers}</td>
                <td className="px-4 py-3">{p.following}</td>
                <td className="px-4 py-3">{p.posts}</td>
                <td className="px-4 py-3">{p.profilePicture ? '✓' : '✕'}</td>
                <td className="px-4 py-3">{p.accountPrivacy || '-'}</td>
                <td className="px-4 py-3">{p.missingFeatures ? (Array.isArray(p.missingFeatures) ? p.missingFeatures.join(', ') : String(p.missingFeatures)) : '-'}</td>
                <td className="px-4 py-3">{p.analysisType || '-'}</td>
                <td className="px-4 py-3"><button onClick={(e)=>{ e.stopPropagation(); openDetail(p.id); }} className="text-blue-600 hover:underline"><FontAwesomeIcon icon={faEye} /> View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">Showing {profiles.length} of {total}</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} className="px-3 py-1 border rounded">Prev</button>
          <div className="px-3">{page}</div>
          <button onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded">Next</button>
        </div>
        </div>
      </div>

      {/* Detail side panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform ${detailOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg">Profile Details</h2>
          <button onClick={()=>{ setDetailOpen(false); setDetail(null); }} className="px-2 py-1">Close</button>
        </div>
        <div className="p-4 overflow-auto h-full">
          {detailLoading ? <div>Loading...</div> : detail ? (
            detail.error ? <div className="text-red-500">{detail.error}</div> : (
              <div>
                <div className="mb-3 font-semibold">{detail.username || detail.displayName}</div>
                <div className="text-sm text-gray-600 mb-2">{detail.platform} • Scanned {formatDate(detail.scanDate)}</div>
                <div className="mb-2">Score: <span className={riskColor(detail.riskCategory)}>{detail.riskScore}%</span></div>
                <div className="mb-2">Category: <strong>{detail.riskCategory}</strong></div>
                <div className="mb-2">Confidence: {detail.confidence ?? '-'}</div>
                <div className="mb-2">Followers: {detail.followers}</div>
                <div className="mb-2">Following: {detail.following}</div>
                <div className="mb-2">Posts: {detail.posts}</div>
                <div className="mb-2">Privacy: {detail.accountPrivacy}</div>
                <div className="mb-2">Missing: {detail.missingFeatures ? (Array.isArray(detail.missingFeatures) ? detail.missingFeatures.join(', ') : String(detail.missingFeatures)) : '-'}</div>
                <div className="mb-2">Analysis: {detail.analysis?.type} ({formatDate(detail.analysis?.createdAt)})</div>
                <div className="mt-4">
                  <h3 className="font-semibold">Historical Scans</h3>
                  <ul className="list-disc ml-5">
                    {detail.history?.map(h => (
                      <li key={h.id}>{formatDate(h.createdAt)} — {h.riskScore}%</li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Feature Contributions</h3>
                  <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(detail.featureContributions || {}, null, 2)}</pre>
                </div>
                <div className="mt-4">
                  <h3 className="font-semibold">Anomalies</h3>
                  <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(detail.anomalies || {}, null, 2)}</pre>
                </div>
              </div>
            )
          ) : (
            <div className="text-gray-500">Select a profile to view details</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileActivity;