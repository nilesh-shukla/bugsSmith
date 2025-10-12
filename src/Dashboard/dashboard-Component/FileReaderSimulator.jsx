import { div, pre } from 'framer-motion/client';
import React, { useState, useEffect, useRef } from 'react'

function FileReaderSimulator({ fileContent }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [finishedMessage, setFinishedMessage] = useState("")
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentLine, setCurrentLine] = useState("")
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const contentRef = useRef(null);
  
  useEffect(() => {
    if(!fileContent) return;

    const lines = fileContent.split("\n");

    if(lineIndex < lines.length){
        if(!isPrinting) setIsPrinting(true);

        const current = lines[lineIndex];

        if(lineIndex < 50){
            if(charIndex < current.length){
                const timeout = setTimeout(() => {
                    setCurrentLine((prev) => prev+current[charIndex]);
                    setCharIndex((c) => c+1);
                }, 1);
                return () => clearTimeout(timeout);
            }
            else{
                const timeout = setTimeout(() => {
                    setDisplayedLines((prev) => [...prev, current]);
                    setCurrentLine("");
                    setLineIndex((i) => i+1);
                    setCharIndex(0);

                    if(lineIndex + 1 === lines.length){
                        setIsPrinting(false);
                    }
                }, 300);
                return () => clearTimeout(timeout);
            }
        }

        // Skipping the Chunk of 400 characters on every 50 lines
        if(lineIndex >= 50){
            const chunk = 400;
            if(charIndex < current.length){
                const timeout = setTimeout(() => {
                    setCurrentLine((prev) => prev+current.slice(charIndex, charIndex + chunk));
                    setCharIndex((c) => c+chunk);
                }, 1);
                return () => clearTimeout(timeout);
            }
            else{
                const timeout = setTimeout(() => {
                    setDisplayedLines((prev) => [...prev, current]);
                    setCurrentLine("");
                    setLineIndex((i) => i+1);
                    setCharIndex(0);
                }, 50);
                return () => clearTimeout(timeout);
            }
        }
    }
    else if(isPrinting){
        setIsPrinting(false)
        setFinishedMessage("----Process Complete----");
    }

  }, [fileContent, lineIndex, charIndex])


  // Auto-Scroll Ability for Terminal
  useEffect(() => {
    if(contentRef.current){
        contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayedLines, currentLine]);

    return (
        <div ref={contentRef} className={`file-reader-container p-4 bg-black text-white font-mono rounded-lg max-h-[40vh] sim-scroll-hide ${ isPrinting ? "overflow-y-hidden pointer-events-none" : "overflow-y-auto"}`}>
        {displayedLines.map((line, idx) => (
            <div key={idx}>{line}</div>
        ))}
        {isPrinting && (
            <div>
                {currentLine}
                <span className='animate-pulse text-green-400 text-2xl'>{"\u258B"}</span>
            </div>
        )}
        {!isPrinting && finishedMessage && (
            <div className='mt-2 text-green-400 font-semibold'>{finishedMessage}</div>
        )}
    </div>
  );
}

export default FileReaderSimulator;