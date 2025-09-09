import {useState} from 'react'

import article1 from '/article1.jpg'
import article2 from '/article2.webp'
import article3 from '/article3.webp'

import Article from '../components/Article'
import Footer from '../components/Footer'

function Resources() {

  const [activeTab, setActiveTab] = useState("all");
  const articles = [
    {
      id: 1,
      link: "https://www.mdpi.com/1999-4893/17/10/425",
      category: "ai",
      image: article1,
      title: "Artificial Intelligence",
      heading:
        "Detecting Fake Accounts on Instagram Using Machine Learning and Hybrid Optimization Algorithms",
      description:
        "Proposes a hybrid approach combining Grey Wolf Optimization + Particle Swarm Optimization for feature selection, along with models like SVM, KNN, ANN, and Logistic Regression. Tested on 65,329 accounts with impressive results",
    },
    {
      id: 2,
      link: "https://arxiv.org/abs/2307.11864",
      category: "community",
      image: article2,
      title: "Threats",
      heading: "The Looming Threat of Fake and LLM-generated LinkedIn Profiles",
      description:
        "A 2023 study proposes an innovative method to identify fake or AI-generated profiles on LinkedIn. It uses a technique called Section and Subsection Tag Embedding (SSTE) to analyze textual content during profile creation—achieving around 95% accuracy in detecting fake accounts and 90% accuracy with limited LLM-generated samples",
    },
    {
      id: 3,
      link: "https://arxiv.org/abs/2004.04834",
      category: "ai",
      image: article3,
      title: "Application",
      heading:
        "Friend or Faux: Graph-Based Early Detection of Fake Accounts on Social Networks",
      description:
        "This paper introduces SybilEdge, a graph-based approach that examines the friend request patterns and their targets’ responses to detect Sybil (fake) accounts right from the early stages. It achieves AUC > 0.9 even for brand-new accounts with few connections, showing robustness at scale",
    },
    { 
      id: 4,
      link: "https://arxiv.org/abs/2307.16336",
      category: "community",
      image: article1, 
      title: "Community Post", 
      heading: "Anatomy of an AI-powered malicious social botnet", 
      description: "Case study uncovering a botnet of 1,140 AI-generated personas (likely leveraging ChatGPT) that spread deceptive content, spam, and harmful messages. Highlights how even cutting-edge detectors struggle, showcasing a real-world threat to communities" 
    },
    { 
      id: 5, 
      link: "https://link.springer.com/article/10.1007/s13278-024-01399-3",
      category: "uses", 
      image: article2, 
      title: "Use Cases", 
      heading: "Securing social spaces: machine learning techniques for fake profile detection on instagram", 
      description: "Features an empirical model utilizing DistilBERT + SMOTE + Random Forest to detect Instagram fake profiles based on user bio length. Achieved accuracy ≈ 83.8%, precision/recall ~80% for fakes, and ~86% for genuine profiles." 
    },
    { 
      id: 6, 
      link: "https://blog.axur.com/en-us/fake-profiles-on-social-media-how-to-protect-your-organization",
      category: "community", 
      image: article3, 
      title: "Social Problems", 
      heading: "Societal Trust Erosion & Weaponization", 
      description: "Fake profiles are tools in a broader arsenal used to undermine trust, tarnish reputations, and influence perceptions—especially when impersonating trusted figures or institutions" 
    },
    { 
      id: 7, 
      link: "https://timesofindia.indiatimes.com/city/mangaluru/reject-fake-and-provocative-messages-on-social-media-sp/articleshow/123737775.cms",
      category: "community", 
      image: article3, 
      title: "Misinformations and Defamation", 
      heading: "Public Disorder via Misinformation", 
      description: "Even outside political contexts, fake and provocative content has soured community harmony. In Mangaluru, multiple cases were filed after fake posts incited unrest, compelling authorities to urge the public to verify before sharing" 
    },
    { 
      id: 8, 
      link: "https://www.researchgate.net/publication/370109702_A_Review_Article_on_Detection_of_Fake_Profile_on_Social-Media",
      category: "uses", 
      image: article3, 
      title: "More Use Cases", 
      heading: "Fake Profile Detection Using Machine Learning Techniques", 
      description: "Covers foundational ML techniques for detecting fake, duplicate, or bot profiles, explaining how social media platforms are impacted by identity theft, rumors, and phishing campaigns" 
    },
    { 
      id: 9, 
      link: "https://journalofbigdata.springeropen.com/articles/10.1186/s40537-025-01254-y",
      category: "ai", 
      image: article3, 
      title: "Why to Use", 
      heading: "Unmasking deception: detection of fake profiles in online social ecosystems", 
      description: "A comprehensive systematic literature review (SLR) covering state-of-the-art detection approaches for various types of fake profiles—Sybil accounts, sock puppets, and social bots. Provides a structured taxonomy and analysis framework for understanding detection strategies across platforms like Facebook, Instagram, and Twitter" 
    },

    { 
      id: 10, 
      link: "https://www.mdpi.com/1999-5903/17/9/391",
      category: "uses", 
      image: article3, 
      title: "More Use Cases", 
      heading: "Safeguarding Brand and Platform Credibility Through AI-Based Multi-Model Fake Profile Detection", 
      description: "Highlights the broader threats that fake profiles pose—not just to individual users but also to public institutions and democratic processes. Stresses how AI-driven detection methods are crucial for preserving trust in digital ecosystems" 
    },

    { 
      id: 11, 
      link: "https://arxiv.org/abs/2311.06903",
      category: "uses", 
      image: article3, 
      title: "More Use Cases", 
      heading: "Spotting Fake Profiles in Social Networks via Keystroke Dynamics", 
      description: "Uses typing behavior patterns to distinguish genuine users from fakes. On platforms like Facebook, Instagram, and X, it achieved accuracy ranging from ~70% to 100%, even in cross-platform scenarios." 
    },

    { 
      id: 12, 
      link: "https://timesofindia.indiatimes.com/city/jaipur/man-held-for-creating-fake-social-media-a/cs-to-harass-women/articleshow/123150496.cms",
      category: "community", 
      image: article3, 
      title: "More Use Cases", 
      heading: "Real-World Harassment & Social Vulnerability", 
      description: "Fake profiles are not merely social nuisances—they pose direct personal threats. In Jaipur, a man was apprehended for creating fake Facebook accounts to harass women using obscene content and threatening imagery, causing widespread panic." 
    },

    { 
      id: 13, 
      link: "https://arxiv.org/abs/2102.02434",
      category: "community", 
      image: article3, 
      title: "More Use Cases", 
      heading: "Academic Perspective: Community Health & Vulnerabilities", 
      description: "Beyond high-profile incidents, academic work shows the network structures of communities affect how fake information spreads. For instance, boundary nodes—those connecting to outside users—can act as gateways, influencing core members and amplifying misinformation across the community." 
    },

    

  ];
  const filteredArticles = activeTab === "all" ? articles : articles.filter((a) => a.category === activeTab);

  return (
    <div className='px-15 pt-[20vh] pb-[5vh] outfit-font justify-center items-center flex flex-col gap-y-[15vh]'>
      <img src="/resource-bg.png" alt="logo-image" className='absolute w-4xl -top-1/3 -left-1/5 blur-xl z-0'/>
        <div className='relative flex justify-between items-center group p-10 border border-[#234567] rounded-2xl bg-gradient-to-br to-[#294281] from-transparent z-50'>
            <div className='p-8 w-1/2 flex flex-col gap-y-6'>
                <h1 className='text-[#0d84a8]'>Use Cases</h1>
                <h1 className='text-[4rem] tracking-tight leading-16 text-white group-hover:cursor-pointer group-hover:underline ' style={{fontWeight: 600}}>Protection Without Verification Is Just Assumption</h1>
                <p className='text-[#86acb1]'>High activity doesn’t always mean trust. Fake profiles can create noise, mislead users, and undermine platform integrity, revealing the hidden risks of unverified interactions.</p>
            </div>
            <div className='w-fit overflow-hidden rounded-2xl border border-[#234567] shadow-2xl z-50'>
              <img src="/resource-header.png" alt="resource-header Image" className='h-[60vh] object-fit group-hover:scale-110 transition-all ease-in-out duration-300'/>
            </div> 
        </div>
        
        <div className="flex gap-x-10">

          {/* Sidebar */}
          <div className="text-xl text-[#86acb1] whitespace-nowrap flex flex-col gap-y-10">
            <div
              onClick={() => setActiveTab("all")}
              className={`cursor-pointer ${
                activeTab === "all"
                  ? "border-l-2 border-blue-400 pl-2 font-bold"
                  : "font-bold"
              }`}
            >
              All Posts
            </div>
            <div
              onClick={() => setActiveTab("community")}
              className={`cursor-pointer ${
                activeTab === "community"
                  ? "border-l-2 border-blue-400 pl-2 transition-opacity duration-500 ease-in-out opacity-100 animate-fadeIn"
                  : ""
              }`}
            >
              Community
            </div>
            <div
              onClick={() => setActiveTab("ai")}
              className={`cursor-pointer ${
                activeTab === "ai"
                  ? "border-l-2 border-blue-400 pl-2 font-semibold"
                  : ""
              }`}
            >
              Artificial Intelligence
            </div>
            <div
              onClick={() => setActiveTab("uses")}
              className={`cursor-pointer ${
                activeTab === "uses"
                  ? "border-l-2 border-blue-400 pl-2 font-semibold"
                  : ""
              }`}
            >
              Use Cases
            </div>
          </div>

          {/* Articles */}
          <div 
            key={activeTab}
            className="grid grid-cols-2 gap-x-5 gap-y-10 px-10 transition-opacity duration-500 ease-in-out opacity-100 animate-fadeIn"
          >
            {filteredArticles.map((a) => (
              <Article
                key={a.id}
                link={a.link}
                image={a.image}
                title={a.title}
                heading={a.heading}
                description={a.description}
              />
            ))}
          </div>
        </div>

        <Footer />

    </div>
  )
}

export default Resources