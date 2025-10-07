import { div } from 'framer-motion/client';
import React, { useState, useEffect } from 'react'

function FileReaderSimulator({ fileContent }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLine, setCurrentLine] = useState("")
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  
  useEffect(() => {
    if(!fileContent) return;

    const lines = fileContent.split("\n");

    if(lineIndex < lines.length){
        if(charIndex < lines[lineIndex].length){
            const timeout = setTimeout(() => {
                setCurrentLine((prev) => prev+lines[lineIndex][charIndex]);
                setCharIndex((c) => c+1);
            }, 10);
            return () => clearTimeout(timeout);
        }
        else{
            const timeout = setTimeout(() => {
                setDisplayedLines((prev) => [...prev, lines[lineIndex]]);
                setCurrentLine("");
                setLineIndex((i) => i+1);
                setCharIndex(0);
            }, 300);
            return () => clearTimeout(timeout);
        }
    }
  }, [fileContent, lineIndex, charIndex])
    return (
        <div className='file-reader-container p-4 bg-black text-green-600 font-mono rounded-lg overflow-auto max-h-[40vh] sim-scroll-hide'>
        {displayedLines.map((line, idx) => (
            <div key={idx}>{line}</div>
        ))}
        <div>{currentLine}<span className='animate-pulse'>| </span></div>
    </div>
  );
}

export default FileReaderSimulator;