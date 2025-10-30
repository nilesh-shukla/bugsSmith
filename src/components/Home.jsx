import Solutions from './Solutions'
import Header from './Header'
import Cards from './Cards'
import Article from './Article'

import chipSetImg from '/chipSetImg.png'
import article1 from '/ArticleImage/article1.jpg'
import article2 from '/ArticleImage/article2.webp'
import article3 from '/ArticleImage/article3.webp'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown, faHeadSideVirus, faLockOpen, faFolder } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Footer from './Footer'


function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className='w-screen flex flex-col gap-y-14 lg:gap-y-20 xl:gap-y-32 xl:px-12 lg:px-8 px-4 pt-35 pb-15'>

        <Header />

        {/* Problem */}
        <div>
          <div className='w-fit p-2 bg-[#294281] rounded-full mb-6 xl:mb-3'>
            <h1 className='text-blue-300 text-sm outfit-font'>Problems</h1>
          </div>
          <div className='flex flex-col gap-20'>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-16 xl:gap-24 justify-between lg:items-center'>
              <h1 className='text-white text-[2.6em] xl:text-[3.3em] lg:w-1/2 outfit-font tracking-tight leading-12 lg:leading-14'>The Invisible Drain on Trust, Revenue, and Reputation</h1>
              <p className='lg:w-1/3 text-[#A0AEC0]'>Organizations face mounting losses as fake accounts inflate numbers, skew analytics, and create blind spots in decision-making</p>
            </div>
            <div className='grid grid-rows-3 grid-cols-1 lg:grid-rows-1 lg:grid-cols-3 gap-4'>
              <Cards icon={faThumbsDown} iconHeading={"Trust Erosion"} figures={"1/5"} description={"active accounts on social media is likely fake or spam, undermining faith in platform authenticity and interaction"} />
              <Cards icon={faHeadSideVirus} iconHeading={"Platform Distortion"} figures={"39%"} description={"of discussions in a backlash campaign were driven by fake users"} />
              <Cards icon={faLockOpen} iconHeading={"Security Threats"} figures={"25,000"} description={"fraudulent login attempts every hour, highlighting the constant threat fake accounts pose to user security"} />
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className='outfit-font'>
          <div className='w-fit p-2 mb-6 xl:mb-3 bg-[#294281] rounded-full'>
            <h1 className='text-blue-300 text-sm'>Solutions</h1>
          </div>
          <div className='flex flex-col gap-10 lg:gap-20'>
            <div className='flex flex-col lg:flex-row gap-4 lg:gap-16 xl:gap-24 justify-between lg:items-center'>
              <h1 className='text-white text-[2.6em] lg:text-[3.3em] lg:w-1/2 outfit-font tracking-tight leading-12 lg:leading-14'>The AI Solution for Smarter, More Effective Response</h1>
              <p className='lg:w-1/3 text-[#A0AEC0]'>Stronger verification systems ensure real users, preserve data accuracy, and restore platform credibility</p>
            </div>
            
            <div className='grid grid-rows-[auto_auto] xl:grid-cols-2 gap-10'>
              
              {/* Left/Bottom */}
              <div className='flex flex-col lg:px-4 gap-2 order-2 lg:order-1'>
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

                  <a href="https://i4c.mha.gov.in/about.aspx" target='blank'>
                    <button className='bg-white hover:bg-gray-300 cursor-pointer transition-all duration-300 p-4 w-fit rounded-full mt-4'>Join Community</button>
                  </a>

              </div>

              {/* Right */}
              <div className='border-2 aspect-square border-[#1e3a4f] bg-cover bg-center bg-no-repeat opacity-40 relative group rounded-xl order-1 lg:order-2' style={{backgroundImage: `url(${chipSetImg})`}} />

            </div>
          </div>
          
        </div>

        <div className='outfit-font flex flex-col'>
          <div className='w-fit p-2 mb-4 bg-[#294281] rounded-full'>
            <h1 className='text-blue-300 text-sm'>Fequently Asked</h1>
          </div>
          <div>
            <div className='grid grid-rows-[auto_auto] grid-cols-1 lg:grid-rows-1 lg:grid-cols-2 gap-6 lg:gap-2 lg:items-center'>
              {/* Heading */}
              <h1 className='text-white text-[2.6em] lg:text-[3.3em] tracking-tight h-fit leading-12 lg:leading-14'>You Have Questions, We Have Answers</h1>
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
          <h1 className='text-white text-[2.6em] lg:text-[3.3em] tracking-tight leading-12 lg:leading-14'>Some Famous Articles</h1>
          <div className='grid grid-rows-3 grid-cols-1 md:grid-rows-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-4'>

            <Article image={article1} link={"https://www.mdpi.com/1999-4893/17/10/425"} title={"Artificial Intelligence"} heading={"Detecting Fake Accounts on Instagram Using Machine Learning and Hybrid Optimization Algorithms"} description={"Proposes a hybrid approach combining Grey Wolf Optimization + Particle Swarm Optimization for feature selection, along with models like SVM, KNN, ANN, and Logistic Regression. Tested on 65,329 accounts with impressive results"}/>
            <Article image={article2} link={"https://arxiv.org/abs/2307.11864"} title={"Threats and Application"} heading={"The Looming Threat of Fake and LLM-generated LinkedIn Profiles"} description={"A 2023 study proposes an innovative method to identify fake or AI-generated profiles on LinkedIn. It uses a technique called Section and Subsection Tag Embedding (SSTE) to analyze textual content during profile creation—achieving around 95% accuracy in detecting fake accounts and 90% accuracy with limited LLM-generated samples"} />
            <Article image={article3} link={"https://arxiv.org/abs/2004.04834"} title={"Apllication"} heading={"Friend or Faux: Graph-Based Early Detection of Fake Accounts on Social Networks"}  className={"block md:hidden xl:block"}  description={"This paper introduces SybilEdge, a graph-based approach that examines the friend request patterns and their targets’ responses to detect Sybil (fake) accounts right from the early stages. It achieves AUC > 0.9 even for brand-new accounts with few connections, showing robustness at scale"}/>

          </div>
        </div>

        <Footer />
    </div>
  )
}

export default Home