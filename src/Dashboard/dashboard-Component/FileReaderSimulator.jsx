import React from "react";

function FileReaderSimulator({
  processingIndex,
  total,
  percentage,
  currentProfile,
  isProcessing
}) {

  // accept logs prop via rest args if provided (backwards compatible)
  const logs = (arguments[0] && arguments[0].logs) || [];

  if (!isProcessing && processingIndex === 0) {
    return (
      <div className="file-reader-container h-full flex flex-col justify-center p-6 bg-black rounded-lg text-white font-mono sim-scroll-hide">
        ---- LOGS WILL BE DISPLAYED HERE ----
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col justify-start p-6 bg-black rounded-lg text-white font-mono">

      <div className="mb-3 space-y-1">
        {logs.map((line, idx) => (
          <div key={idx} className="text-gray-300 text-sm">{line}</div>
        ))}
      </div>

      <div className="flex justify-between mb-3">
        <span className="text-sm text-gray-400">Scanning Profiles</span>
        <span className="text-sm text-gray-400">{percentage}%</span>
      </div>

      <div className="w-full h-4 bg-gray-400 overflow-hidden">
        <div
          className="h-full bg-white transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="mt-4 text-sm text-gray-300">Progress: {processingIndex} of {total} profiles</div>

      {currentProfile && (
        <div className="mt-2 text-gray-300">
          <div className="text-sm">Currently Analyzing:</div>
          <div className="font-semibold mt-1">{currentProfile ? `@${currentProfile}` : '-'}</div>
        </div>
      )}

      {!isProcessing && total > 0 && (
        <div className="mt-auto text-sm text-green-400">[SUCCESS] Analysis Complete</div>
      )}
    </div>
  );
}

export default FileReaderSimulator;