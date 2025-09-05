import Solutions from './Solutions'
import Header from './Header'
import Cards from './Cards'
import Article from './Article'

import chipSetImg from '/chipSetImg.png'
import article1 from '/article1.jpg'
import article2 from '/article2.webp'
import article3 from '/article3.webp'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faHeadSideVirus, faLockOpen, faFolder } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Footer from './Footer'


function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className='flex flex-col gap-y-32 px-12 pt-35 pb-15'>
        <Header />

        {/* Problem */}
        <div>
          <div className='w-fit p-2 bg-[#294281] rounded-full mb-3'>
            <h1 className='text-blue-300 text-sm outfit-font'>Problems</h1>
          </div>
          <div className='flex flex-col gap-20'>
            <div className='flex gap-24 justify-between items-center'>
              <h1 className='text-white text-[3.3em] w-1/2 outfit-font tracking-tight leading-14'>The Invisible Drain on Trust, Revenue, and Reputation</h1>
              <p className='w-1/3 text-[#A0AEC0]'>Organizations face mounting losses as fake accounts inflate numbers, skew analytics, and create blind spots in decision-making</p>
            </div>
            <div className='grid grid-cols-3 gap-4'>
              <Cards icon={faThumbsDown} iconHeading={"Trust Erosion"} figures={"1/5"} description={"active accounts on social media is likely fake or spam, undermining faith in platform authenticity and interaction"} />
              <Cards icon={faHeadSideVirus} iconHeading={"Platform Distortion"} figures={"39%"} description={"of discussions in a backlash campaign were driven by fake users"} />
              <Cards icon={faLockOpen} iconHeading={"Security Threats"} figures={"25,000"} description={"fraudulent login attempts every hour, highlighting the constant threat fake accounts pose to user security"} />
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className='outfit-font'>
          <div className='w-fit p-2 mb-4 bg-[#294281] rounded-full'>
            <h1 className='text-blue-300 text-sm'>Solutions</h1>
          </div>
          <div className='flex flex-col gap-20'>
            <div className='flex gap-24 justify-between items-center'>
              <h1 className='text-white text-[3.3em] w-1/2 tracking-tight leading-14'>The AI Solution for Smarter, More Effective Response</h1>
              <p className='w-1/3 text-[#A0AEC0]'>Stronger verification systems ensure real users, preserve data accuracy, and restore platform credibility</p>
            </div>
            
            <div className='grid grid-cols-2 gap-10'>
              {/* Left */}
              <div className='flex flex-col px-4 gap-2'>
                  <Solutions 
                    sol_heading={"AI Driven Detection System"} 
                    describe={"Uses machine learning algorithms to identify suspicious patterns, automated behavior, and anomalies in user profiles and activities"}
                    isActive={activeIndex === 0}
                    onToggle={() => setActiveIndex(activeIndex === 0 ? -1 : 0)} />
                  <Solutions 
                    sol_heading={"Report-Block-Remove Strategy"} 
                    describe={"Streamlined process where users report suspicious profiles, admins verify and block, followed by systematic removal of confirmed fakes"}
                    isActive={activeIndex === 1}
                    onToggle={() => setActiveIndex(activeIndex === 1 ? -1 : 1)} />
                  <Solutions 
                    sol_heading={"Two-factor Authentication"} 
                    describe={"Additional security layer requiring users to verify identity through multiple methods, significantly reducing fake account creation"}
                    isActive={activeIndex === 2}
                    onToggle={() => setActiveIndex(activeIndex === 2 ? -1 : 2)} />
                  <Solutions 
                    sol_heading={"User Behavior Analytics"} 
                    describe={"Monitors and analyzes user activity patterns to detect suspicious behaviors and identify potentially fraudulent accounts"}
                    isActive={activeIndex === 3}
                    onToggle={() => setActiveIndex(activeIndex === 3 ? -1 : 3)} />

                    <button className='bg-white p-4 w-fit rounded-full'>Join Waitlist</button>
              </div>
              {/* Right */}
              <div className='border-2 border-[#1e3a4f] bg-cover bg-center bg-no-repeat opacity-40 relative group rounded-xl cursor-pointer' style={{backgroundImage: `url(${chipSetImg})`}}>
                <input 
                  type="file"
                  id='fileInput'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if(file){
                      console.log("File Selected:", file.name);
                    }
                  }}
                />
                <label 
                  htmlFor="fileInput"
                  className='absolute top-1/3 left-1/2 transform -translate-x-1/2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2'>
                    <FontAwesomeIcon icon={faFolder} className='text-[10rem] text-[#3e79b9]' />
                </label>
              </div>
            </div>
          </div>
          
        </div>

        <div className='outfit-font flex flex-col'>
          <div className='w-fit p-2 mb-4 bg-[#294281] rounded-full'>
            <h1 className='text-blue-300 text-sm'>FAQ</h1>
          </div>
          <div>
            <div className='grid grid-cols-2 gap-2 items-center'>
              {/* Heading */}
              <h1 className='text-white text-[3.3em] tracking-tight leading-14'>You Have Questions, We Have Answers</h1>
              {/* FAQ */}
              <div>
                <Solutions 
                  sol_heading={"How does the AI integeration help with fake profile detection?"} 
                  describe={"Our AI system uses advanced machine learning algorithms to analyze multiple data points including user behavior patterns, profile characteristics, and interaction history. It can identify suspicious patterns that human moderators might miss, such as automated posting behavior, unusual account creation patterns, and suspicious network connections. The AI continuously learns from new data, improving its accuracy over time."}
                  isActive={activeIndex === 0}
                  onToggle={() => setActiveIndex(activeIndex === 0 ? -1 : 0)}
                />
                <Solutions 
                  sol_heading={"What is the Report-Block-Remove Strategy?"} 
                  describe={"This is our three-step approach to handling suspicious accounts: 1) Users can report suspicious profiles through an intuitive interface, 2) Our automated system and human moderators verify these reports and block confirmed fake accounts, 3) Systematic removal process ensures complete elimination of fake profiles while preserving platform integrity. This strategy ensures community participation while maintaining professional oversight."}
                  isActive={activeIndex === 1}
                  onToggle={() => setActiveIndex(activeIndex === 1 ? -1 : 1)}
                />
                <Solutions 
                  sol_heading={"Is our data file and folder secure?"} 
                  describe={"Yes, we implement enterprise-grade security measures including end-to-end encryption, secure socket layers (SSL), and multiple authentication layers to protect your data. All files are stored in encrypted format, and access is strictly controlled through role-based permissions. We regularly perform security audits and maintain compliance with international data protection standards."}
                  isActive={activeIndex === 2}
                  onToggle={() => setActiveIndex(activeIndex === 2 ? -1 : 2)}
                />
                <Solutions 
                  sol_heading={"How does User Behavior Analytics enhance security?"} 
                  describe={"User Behavior Analytics (UBA) creates baseline profiles of normal user activity and identifies deviations that might indicate fraudulent behavior. It tracks patterns like login times, interaction frequency, content posting patterns, and network connections. When unusual patterns are detected, the system can automatically flag accounts for review or trigger additional verification steps, providing proactive security measures."}
                  isActive={activeIndex === 3}
                  onToggle={() => setActiveIndex(activeIndex === 3 ? -1 : 3)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className='outfit-font flex flex-col gap-y-10 justify-center items-center'>
          <div className='w-fit p-2 mb-4 bg-[#294281] rounded-full'>
            <h1 className='text-blue-300 text-sm'>Blogs</h1>
          </div>
          <h1 className='text-white text-[3.3em] tracking-tight leading-14'>Some Famous Articles</h1>
          <div className='grid grid-cols-3 gap-4'>
            <Article image={article1} title={"Artificial Intelligence"} heading={"Detecting Fake Accounts on Instagram Using Machine Learning and Hybrid Optimization Algorithms"} description={"Proposes a hybrid approach combining Grey Wolf Optimization + Particle Swarm Optimization for feature selection, along with models like SVM, KNN, ANN, and Logistic Regression. Tested on 65,329 accounts with impressive results"}/>
            <Article image={article2} title={"Threats and Application"} heading={"The Looming Threat of Fake and LLM-generated LinkedIn Profiles"} description={"A 2023 study proposes an innovative method to identify fake or AI-generated profiles on LinkedIn. It uses a technique called Section and Subsection Tag Embedding (SSTE) to analyze textual content during profile creation—achieving around 95% accuracy in detecting fake accounts and 90% accuracy with limited LLM-generated samples"} />
            <Article image={article3} title={"Apllication"} heading={"Friend or Faux: Graph-Based Early Detection of Fake Accounts on Social Networks"} description={"This paper introduces SybilEdge, a graph-based approach that examines the friend request patterns and their targets’ responses to detect Sybil (fake) accounts right from the early stages. It achieves AUC > 0.9 even for brand-new accounts with few connections, showing robustness at scale"}/>
          </div>
        </div>

        <Footer />
    </div>
  )
}

export default Home