import { useState } from "react"
import Select from 'react-select'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faDownload, faGavel, faL } from "@fortawesome/free-solid-svg-icons"
import FileReaderSimulator from "./dashboard-Component/FileReaderSimulator"

function Analyze() {

  const [fileName, setFileName] = useState("Smith Here");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    } else {
      setFileName("Smith Here");
      setSelectedFile(null);
    }
  };

  const handleScan = () => {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(selectedFile);
  };

  const social = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "threads", label: "Threads" },
    { value: "linkedin", label: "LinkedIn" },
  ];

  return (
    <div className='px-12 py-4'>
      <h1 className='text-[3rem] text-white font-semibold'>Analyze</h1>
      <p className='text-[#789] mb-8'>We analyze digital footprints to separate genuine users from imposters</p>
      <div className='grid grid-cols-5 gap-4'>

        {/* Input Form Field */}
        <div className='flex flex-col col-span-2 rounded-4xl p-6 bg-white' id='input-field'>
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
                  <input type="file" className="hidden" onChange={handleFileChange} />
                  <span className="text-gray-500">{fileName}</span>
                  <div className="flex gap-5">
                    <div className="w-px bg-gray-500 h-6" />
                    <FontAwesomeIcon icon={faDownload} className="text-blue-400 text-xl" />
                  </div>
                </label>
                <button type="button" onClick={handleScan} className="bg-gradient-to-r from-[#66aaed] via-[#4392e0] to-[#137ced] px-3 py-2 rounded-lg text-white hover:scale-105 transition-all duration-200 cursor-pointer shadow">Scan</button>
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
        <div className='flex flex-col col-span-3 rounded-3xl p-6 bg-white' id='file-reader'>
          <div className="flex flex-col">
            <h1 className="text-3xl text-[#789] font-semibold">Smith Screen</h1>
            <p className="text-[#789]">Scanning of your profile or scapping of profile can be seen here</p>
          </div>
          {/* Simulator Here */}
          <div className=" mt-4 max-h-full overflow-y-auto">
            {fileContent ? (
              <FileReaderSimulator key={fileName} fileContent={fileContent} />
            ) : (
              <div className="p-6 max-h-full text-[#81acd7] font-mono bg-black rounded-lg border border-gray-600">
                ----SMITHING YOUR FILE HERE----
              </div>
            )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analyze