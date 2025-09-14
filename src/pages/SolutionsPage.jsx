import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import FeatureCard from '../components/FeatureCard'
import Footer from '../components/Footer'
import { div, image } from 'framer-motion/client'

function SolutionsPage() {
    const cards = [
        { image:"/featureSolution-1.webp", heading: "AI-Powered Profile Analysis", describe: "Detects suspicious accounts by analyzing profile data, posting patterns, and engagement signals." },
        { image:"/featureSolution-2.png", heading: "Real-Time Fake Handle Alerts", describe: "Instant notifications when impersonators or fake profiles are detected." },
        { image:"/featureSolution-3.png", heading: "Behavioral Pattern Recognition", describe: "Identifies unusual activity such as spam posting or bot-like behavior." },
        { image:"/featureSolution-4.png", heading: "Cross-Platform Detection", describe: "Scans multiple social media platforms for comprehensive protection." },
        { image:"/featureSolution-5.png", heading: "Trust & Authenticity Score", describe: "Assigns authenticity scores to quickly judge whether a profile is genuine." },
        { image:"/featureSolution-6.png", heading: "Community & Brand Protection", describe: "Shields individuals and organizations from scams and impersonation." }
    ];

    const [currentIndex, setCurrentIndex] =useState(0);
    const [cardWidth, setCardWidth] = useState(0);
    const cardRef = useRef(null);

    useEffect(() => {
        if(cardRef.current){
            setCardWidth(cardRef.current.offsetWidth);
        }
        const handleResize = () => {
            if(cardRef.current) setCardWidth(cardRef.current.offsetWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const handleNext = () => {
        setCurrentIndex((prev) => (prev+1) % cards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev-1+cards.length) % cards.length);
    }

  return (
    <div className='pt-[20vh] px-15 flex flex-col gap-y-20 outfit-font'>
        <div className='flex flex-col gap-y-7 '>
            <h1 className='text-[#0d84a8]'>Smith for Industries</h1>
            <h1 className='text-[4rem] text-white tracking-tight leading-16 font-semibold w-1/2'>A Comprehensive Solution For Industries</h1>
            <p className='text-[#86acb1]'>Safeguard your digital presence with real-time alerts that expose imposters and protect genuine interactions</p>
            <button className='bg-white p-4 rounded-full w-fit font-semibold text-[#052553]'>Join Waitlist</button>
        </div>

        <div className='space-y-8'>
            <div className='space-y-4'>
                <img src="/SolutionsPage-img1.png" alt="" className='rounded-t-2xl' />
                <img src="/SolutionsPage-img2.png" alt="" className='rounded-b-2xl'/>
            </div>
            <p className='text-center text-4xl text-[#86acb1]'>As a social media user, brand, or community manager, you know how important it is to protect your online presence from fake accounts and impersonators. However, spotting fraudulent profiles, verifying authenticity, and staying ahead of scams can be overwhelming and time-consuming. Our platform simplifies this process by automatically detecting suspicious handles, sending real-time alerts, and safeguarding your digital community—so you can focus on building genuine connections with confidence</p>
        </div>

        {/* Feature Section */}
        <div className='space-y-4'>
            <div className='bg-[#86acb1] px-2 py-1 rounded-full w-fit'>
                <h1 className='text-[#1178b3] font-semibold'>Key Features</h1>
            </div>
            <div className='flex gap-4 w-full items-end'>
                <div>
                    <h1 className='text-[3rem] text-white '>Deliver an Exceptional Team Experience</h1>
                    <h1 className='text-[#86acb1]'>evolutionizes the way users stay safe online by detecting fake profiles and impersonators in real time. With powerful tools to verify authenticity and send instant alerts, BugsSmith protects communities, strengthens trust, and ensures genuine connections across social media</h1>
                </div>
                <div className='flex gap-4 justify-end w-[50%] text-[#86acb1]'>
                    <button className='border-2 border-[#86acb13d] rounded-full p-4 items-center hover:bg-[#9bbff1] hover:text-black transition-all duration-300' onClick={handlePrev}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </button>
                    <button className='border-2 border-[#86acb13d] rounded-full p-4 items-center hover:bg-[#9bbff1] hover:text-black transition-all duration-300' onClick={handleNext}>
                        <FontAwesomeIcon icon={faArrowRight}/>
                    </button>
                </div>
            </div>
  
            {/* Feature Cards */}
            <div className="overflow-hidden relative w-full">
                <div
                className="flex gap-5 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * cardWidth}px)` }}
                >
                {cards.map((card, index) => (
                    <div 
                        key={index} 
                        ref={index === 0 ? cardRef : null}
                        className="flex-shrink-0 flex justify-center">
                    <FeatureCard image={card.image} heading={card.heading} describe={card.describe} />
                    </div>
                ))}
                </div>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default SolutionsPage