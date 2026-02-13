import { div, pre } from 'framer-motion/client';
import React, { useState, useEffect, useRef } from 'react'

function FileReaderSimulator({ fileContent }) {
    const [displayedLines, setDisplayedLines] = useState([]);
    const [finishedMessage, setFinishedMessage] = useState("")
    const contentRef = useRef(null);

    useEffect(() => {
        if (!fileContent) {
            setDisplayedLines([]);
            setFinishedMessage("");
            return;
        }

        const lines = fileContent.split("\n");
        // Render entire file immediately
        setDisplayedLines(lines);
        setFinishedMessage("");
    }, [fileContent]);

    // Auto-scroll to bottom whenever content changes
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [displayedLines]);

    return (
        <div ref={contentRef} className={`file-reader-container p-4 bg-black text-white font-mono rounded-lg max-h-[40vh] sim-scroll-hide overflow-y-auto`}>
            {displayedLines.map((line, idx) => (
                <div key={idx}>{line}</div>
            ))}
            {finishedMessage && (
                <div className='mt-2 text-green-400 font-semibold'>{finishedMessage}</div>
            )}
        </div>
    );
}

export default FileReaderSimulator;