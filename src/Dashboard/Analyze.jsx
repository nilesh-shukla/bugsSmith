import { useState, useMemo, useCallback, useEffect } from "react"
import Select from 'react-select'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faGavel, faL, faArrowsRotate } from "@fortawesome/free-solid-svg-icons"
import FileReaderSimulator from "./dashboard-Component/FileReaderSimulator"
import FileFeatureCards from "./dashboard-Component/FileFeatureCards"
import StraightLineMeter from "./dashboard-Component/StraightLineMeter"
import { p, title } from "framer-motion/client"

const API_URL = 'http://127.0.0.1:8000/batch-predict';

function Analyze() {

  const [fileName, setFileName] = useState("Smith Here");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // initialize results from sessionStorage so a refresh/tab switch does not clear them
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('analyze_results');
      if (stored) {
        setResults(JSON.parse(stored));
      }
    } 
    catch (e) {}
  }, []);

  // clear analyze results when the tab/window is closed
  useEffect(() => {
    const onBeforeUnload = () => {
      try { 
        sessionStorage.removeItem('analyze_results');
      }
      catch (e) {}
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const defaultResults = {
    profiles: [],
    completness_score: 0,
    completness_total: 7,
    suspicion_score_average: 0
  }

  const currentResults = results || defaultResults;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      setError(null);
      setResults(null); 
    } 
    else {
      setFileName("Smith Here");
      setSelectedFile(null);
    }
  };

  const social = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "threads", label: "Threads" },
    { value: "linkedin", label: "LinkedIn" },
  ];

  const getCompletnessMessage = useCallback((score, total) => {
  const missing = total - score;

    if (missing >= 3) {
      return{
        title: 'CRITICAL FAILURE',
        description: `IMPACTED PREDICTION: Very few features were found that could make the Suspicion Score highly unreliable due to severe data gaps hence manual review is mandatory`,
        text: 'text-red-700'
      }
    }
    if (missing === 2) {
      return{
        title: 'PARTIAL COVERAGE',
        description: `BELOW EXPECTATIONS: Not all features were found leading to missing features forced the model to impute a safe default value. Confidence may be slightly suppressed.`,
        text: 'text-amber-700'
      }
    }
    if (missing === 1) {
      return{
        title: 'NEAR OPTIMAL',
        description: `NEAR OPTIMAL: One feature was imputed, resulting in very high, but not perfect, reliability.`,
        text: 'text-yellow-100'
      }
    }
    return {
      title: 'OPTIMAL COVERAGE',
      description: `HIGHLY RELIABLE: The prediction utilized a robust, complete feature set, providing the highest confidence in the risk category.`,
      text: 'text-green-500'
    }
  });

  const completnessData = useMemo(() => {
    return getCompletnessMessage(currentResults.completness_score, currentResults.completness_total);
  }, [currentResults.completness_score, currentResults.completness_total, getCompletnessMessage]);

  const handleScan = async () => {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = (event) => { setFileContent(event.target.result) };
    reader.readAsText(selectedFile);

    setLoading(true);
    setError(null);
    setResults(null);

    // quick health check before uploading
    try {
      const healthUrl = API_URL.replace('/batch-predict', '/health');
      const healthResp = await fetch(healthUrl, { method: 'GET' });
      if (!healthResp.ok) {
        throw new Error(`Backend responded with status ${healthResp.status}`);
      }
    } 
    catch (e) {
      console.error('Backend health check failed:', e);
      setError(`Cannot reach backend at http://127.0.0.1:8000. Start the Flask server and try again.`);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try{
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });

      // parse JSON safely
      let data = null;
      try {
        data = await response.json();
      } catch (parseErr) {
        throw new Error(`Server returned non-JSON response (status ${response.status})`);
      }
      if(!response.ok){
        const errorMsg = data?.details || data?.error || `Server Error (${response.status}).`;
        throw new Error(errorMsg);
      }

      const totalScore = (data.profiles || []).reduce((sum, p) => sum + (p.Suspicoin_Score || p.Suspicion_Score || 0), 0);
      const averageScore = data.profiles && data.profiles.length > 0 ? Math.round(totalScore / data.profiles.length) : 0;

      setResults({
        profiles: data.profiles || [],
        completness_score: data.completness_score,
        completness_total: data.completness_total,
        suspicion_score_average: averageScore
      });
      try { 
        sessionStorage.setItem('analyze_results', JSON.stringify(
          {
            profiles: data.profiles || [],
            completness_score: data.completness_score,
            completness_total: data.completness_total,
            suspicion_score_average: averageScore
          }
        )); 
        sessionStorage.setItem('viz_enabled', 'true');
        // notify same-tab listeners that viz_enabled changed
        try { window.dispatchEvent(new Event('viz_enabled_changed')); } catch (e) {}
      } 
      catch (e) {}
    }
    catch(err) {
      console.error("Batch analysis failed:", err);
      setError(`Analysis Failed: ${err.message}. Ensure the Flask Server is running on port 8000.`);
    }
    finally {
      setLoading(false);
    }
  };

  const totalProfilesFound = currentResults.profiles.length;
  const averageSuspicion = currentResults.suspicion_score_average;
  const suspicionCountMessage = totalProfilesFound === 0 ? "No profiles exceeded the 30% risk threshold in this batch." : `Found ${totalProfilesFound} profiles requiring immediate action or monitoring.`;

  // allow explicit refresh/clear from UI to unmount current results
  const handleRefresh = () => {
    try { 
      sessionStorage.removeItem('analyze_results'); 
      sessionStorage.removeItem('viz_enabled');
      try { window.dispatchEvent(new Event('viz_enabled_changed')); } catch (e) {}
    }
    catch (e) {}
    setResults(null);
    setError(null);
    setFileContent("");
    setFileName('Smith Here');
    setSelectedFile(null);
  }

  return (
    <div className="relative">
      <img src="/dashboard-bg/dashboard.png" className='absolute opacity-30 w-full h-full z-0 object-cover' />
      <div className='relative p-2 py-8 xl:px-12 xl:py-4 space-y-4 z-20'>
        <div className='flex justify-between items-center mb-6 w-full'>
          <div className="space-y-2 md:space-y-0 w-52 md:w-auto">
            <h1 className="text-4xl md:text-[3rem] text-white font-semibold">Analyze</h1>
            <p className="text-xs md:text-sm xl:text-base text-[#789]">We analyze digital footprints to separate genuine users from imposters.</p>
          </div>
          <button className='flex gap-1 px-3 py-2 justify-between items-center bg-[#06539f] cursor-pointer hover:bg-blue-400 transition-all duration-150 text-white rounded-xl w-auto xl:w-36 text-lg' onClick={handleRefresh}>
            <span className="hidden md:block">Refresh</span>
            <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
        </div>

        {/* Error message for backend being offline */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-semibold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className='grid grid-cols-1 xl:grid-cols-5 gap-4'>

          {/* Input Form Field */}
          <div className='flex flex-col xl:col-span-2 rounded-4xl p-6 bg-white' id='input-field'>
            <div className='flex justify-between items-center mb-3'>
              <img src="/web-logo.png" className='w-8 h-8' />
                <h1 className='audiowide-font text-3xl text-[#789]'>
                <span className='bg-gradient-to-r from-[#2d92f7] via-[#47729d] to-[#65819d] bg-clip-text text-transparent'>Bugs</span>Smith</h1>
            </div>
            <hr className='text-gray-300 rounded-2xl mb-8' />
            <div className='flex flex-col gap-2'>

              {/* File Format Input */}
              <div className='space-y-2'>
                <h1 className='text-sm text-[#789] leading-tight mb-4'>Smith your file here to decrease the risk of coming across to any digital impersonators</h1>
                <form action="" className='flex gap-1 '>
                  <label className="flex w-full items-center justify-between border-2 border-gray-400 rounded-lg px-4 py-1 cursor-pointer hover:border-blue-500 transition-colors duration-200">
                    <input type="file" className="hidden" onChange={handleFileChange} accept=".csv" />
                    <span className="text-gray-500">{fileName}</span>
                    <div className="flex gap-5">
                      <div className="w-px bg-gray-500 h-6" />
                      <FontAwesomeIcon icon={faDownload} className="text-blue-400 text-xl" />
                    </div>
                  </label>
                  <button type="button" onClick={handleScan} disabled={loading || !selectedFile} className={`px-3 py-2 rounded-lg text-white transition-all duration-200 cursor-pointer ${loading ? 'bg-blue-200 cursor-not-allowed' : 'bg-gradient-to-r from-[#66aaed] via-[#4392e0] to-[#137ced] hover:scale-105'}`}>
                    {loading ? 'Scanning...' : 'Scan'}
                  </button>
                </form>
              </div>

              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-100"></div>
                <span className="px-3 text-gray-300 font-medium">OR</span>
                <div className="flex-1 h-px bg-gray-100"></div>
              </div>

              {/* Individual Input */}
              <div>
                <h1 className='text-[#789] leading-tight mb-4'>Individual Credibility Score</h1>
                <form action="" className="flex flex-col gap-3">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="" className="text-xs text-gray-500">Username</label>
                      <input type="text" className="border-0 outline-1 focus:outline-blue-400 transition-colors duration-200 rounded-lg px-3 py-2" />
                    </div>
                    <Select
                          options={social}
                          placeholder="Platform"
                          isSearchable={false}
                          components={{
                            IndicatorSeparator: () => null,
                          }}
                          styles={{
                          control: (base, state) => ({
                              ...base,
                              border: "none",
                              borderRadius: "4px",
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
                  <div className="flex flex-col gap-1 mb-2">
                    <label htmlFor="" className="text-xs text-gray-500">Email</label>
                    <input type="email" className="border-0 outline-1 focus:outline-blue-400 transition-colors duration-200 rounded-lg px-3 py-2" />
                  </div>
                  <button className="bg-gradient-to-r from-[#66aaed] via-[#4392e0] to-[#137ced] px-3 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200 cursor-pointer shadow">Scan</button>
                </form>
              </div>
            </div>
          </div>

          {/* Smith Screen */}
          <div className='hidden xl:flex flex-col xl:col-span-3 rounded-3xl p-6 bg-white' id='file-reader'>
            <div className="flex flex-col">
              <h1 className="text-3xl text-[#789] font-semibold">Smith Screen</h1>
              <p className="text-[#789]">Scanning of your profile or scapping of profile can be seen here</p>
            </div>
            {/* Simulator Here */}
            <div className=" mt-4 h-full overflow-y-auto">
              {fileContent ? (
                <FileReaderSimulator key={fileName} fileContent={fileContent} />
              ) : (
                <div className="p-6 h-full text-[#81acd7] font-mono bg-black rounded-lg border border-gray-600">
                  ----SMITHING YOUR FILE HERE----
                </div>
              )
              }
            </div>
          </div>
        </div>

        {/* File-Features */}
        <div className="p-6 bg-white rounded-3xl grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">

          {/* Left Column */}
          <div className="flex flex-col gap-2 h-full">

            <FileFeatureCards heading={"Model Confidence Score"}>
              <p className="text-sm text-gray-500 mt-4">Represents the mean suspicion score of all profiles flagged above the 30% risk threshold.</p>
                <h1 className="text-[2.8rem] font-semibold">{averageSuspicion}% <span className="text-sm text-blue-400 font-normal">Confidence</span></h1>
              <StraightLineMeter value={averageSuspicion} min={0} max={100} width={700} ticks={10} />
            </FileFeatureCards>

            <FileFeatureCards heading={"Data Integrity & Completness"}>
              <h1 className="text-[2.8rem] font-semibold mt-4">{currentResults.completness_score}/{currentResults.completness_total}<span className="text-sm text-[#3c5772] font-normal"> ({completnessData.title})</span></h1>   
              {/* features inside the dataset */}
              <p className={`text-lg ${completnessData.text} leading-tight`}>{completnessData.description}</p>
            </FileFeatureCards>

          </div>

          {/* Right Column */}
          <div className="flex flex-col h-full">
            <FileFeatureCards heading={"Suspicious Profiles"} className={"flex flex-col flex-1"}>
            <div className="grid grid-cols-4 w-full items-center px-2 py-4 bg-gray-200 font-semibold">
              <h1>ID</h1>
              <h1>Name/ Handle</h1>
              <h1>Score</h1>
              <h1>Risk</h1>
            </div>
            {/* Internal table content */}
            <div className="overflow-y-auto h-[38vh]">
              <div className="divide-y divide-gray-100 h-full">
                {currentResults.profiles.length > 0 ? (
                  currentResults.profiles.map((profile) => (
                    <div key={profile.Profile_ID} className={`grid grid-cols-4 w-full items-center text-sm p-2 transition-colors duration-100 ${profile.Risk_Color === 'red' ? 'bg-red-50 hover:bg-red-100' : profile.Risk_Color === 'amber' ? 'bg-amber-50 hover:bg-amber-100' : profile.Risk_Color === 'yellow' ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      <span>{profile.Profile_ID || 'N/A'}</span>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 text-xs truncate">{profile.Name}</span>
                        <span className="text-xs text-gray-500 truncate">@{profile.Handle}</span>
                      </div>
                      <span className="font-bold text-gray-800 text-xs">{profile.Suspicion_Score}%</span>
                      <span className={`py-0.5 text-xs font-semibold rounded-full ${'risk-color-' + profile.Risk_Color}`}>
                        {profile.Risk_Category}
                      </span>
                    </div>
                  ))
                ):(
                  <div className="flex h-full justify-center items-center">
                    <p className="text-gray-500 text-xs text-center">No profiles were flagged as suspicious (Score &gt; 30%) in this batch.</p>
                  </div>
                )}
              </div>
            </div>
          </FileFeatureCards>

          </div>
          
        </div>
      </div>
    </div>
    
  )
}

export default Analyze