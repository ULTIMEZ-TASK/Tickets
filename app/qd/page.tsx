import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// --- CONSTANTS & DATA ---
const LIMITS = {
  title: { min: 30, max: 60, absoluteMax: 70 },
  desc: { min: 110, max: 160, absoluteMax: 300 },
  ogTitle: { min: 30, max: 95 },
  ogDesc: { min: 50, max: 200 },
  keywords: { min: 3, max: 10, maxChar: 40 }
};

const HEADER_TEMPLATES = {
  "News Article": {
    h1: "Bitcoin Surpasses $100k: What This Means for Investors",
    structure: "## Why is the Price Rising Now?\n## Expert Opinions\n### Quote from BlackRock CEO\n## Future Outlook\n### Technical Analysis: Next Support Levels",
    tip: "Strategy: Inverted Pyramid. Start with the most important news, then drill down into details."
  },
  "Company Details": {
    h1: "Niparz Technologies – Leading Web3 & Blockchain Development Firm",
    structure: "## About Us\n## Our Services\n### Smart Contract Audits\n### dApp Development\n## Leadership\n### Meet Our Core Team\n## Contact",
    tip: "Strategy: Trust & Authority. Clearly define who you are, what you offer, and who leads the team."
  },
  "Professional Profile": {
    h1: "John Doe – Senior Solidity Engineer & Smart Contract Auditor",
    structure: "## Professional Summary\n## Core Skills & Tech Stack\n## Work Experience\n### Lead Dev at DeFi Protocol X\n## Publications & Talks",
    tip: "Strategy: Hireability. Highlight skills immediately followed by specific proof of experience."
  },
  "Event Page": {
    h1: "Global Web3 Summit 2025 – Dubai",
    structure: "## What to Expect\n## Speakers & Agenda\n### Keynote Speakers\n## Venue & Accommodation\n## FAQ\n### How do I buy tickets?\n### Is there a virtual option?",
    tip: "Strategy: Conversion & FAQ. Answer the 'Who, Where, How' questions to drive ticket sales."
  },
  "On-Chain Data": {
    h1: "Ethereum (ETH) Price, Charts, and Market Cap",
    structure: "## Real-Time Market Data\n### Trading Volume (24h)\n### Circulating Supply\n## Price Chart & Technicals\n## About the Asset\n### What is Ethereum?\n## On-Chain Activity\n### Top Holders & Whale Activity",
    tip: "Strategy: Data Consumption. Rigid structure for data first, followed by educational SEO text."
  }
};

// --- HELPER FUNCTIONS ---
const getValidation = (text, type) => {
  const len = text ? text.length : 0;
  const limit = LIMITS[type];
  if (!limit) return { status: 'neutral', msg: '' };
  
  if (len === 0) return { status: 'error', msg: 'Required' };
  if (len < limit.min) return { status: 'warning', msg: `Too short (Rec: ${limit.min}+)` };
  if (limit.absoluteMax && len > limit.absoluteMax) return { status: 'error', msg: `Truncated` };
  if (len > limit.max) return { status: 'warning', msg: `Truncated` };
  return { status: 'success', msg: 'Optimal' };
};

const isValidUrl = (str) => {
  try { new URL(str); return true; } catch (_) { return false; }
};

const getHostname = (url) => {
  try { return new URL(url).hostname; } catch { return "example.com"; }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'error': return 'border-red-500 focus:ring-red-100 bg-red-50 text-red-700';
    case 'warning': return 'border-yellow-500 focus:ring-yellow-100 bg-yellow-50 text-yellow-700';
    case 'success': return 'border-green-500 focus:ring-green-100 bg-white text-slate-700';
    default: return 'border-gray-300 focus:ring-blue-100 bg-white text-slate-700';
  }
};

const analyzeHeaderStructure = (structure) => {
  const lines = structure.split('\n');
  const headers = lines.filter(l => l.trim().startsWith('#'));
  
  const h2Count = headers.filter(h => h.match(/^##\s/)).length;
  const h3Count = headers.filter(h => h.match(/^###\s/)).length;
  const hasQuestion = headers.some(h => h.includes('?'));
  
  let tips = [];
  if (h2Count < 2) tips.push({ type: 'warning', msg: "Thin structure. Add more H2s for depth." });
  if (!hasQuestion) tips.push({ type: 'info', msg: "AI Tip: Use question-based H2s to rank in AI Overviews." });
  if (headers.some(h => h.match(/^#\s/))) tips.push({ type: 'error', msg: "Do not use single # (H1) here." });
  if (headers.length > 0 && !headers[0].startsWith('## ')) tips.push({ type: 'warning', msg: "Start structure with an H2 (##)." });

  return { h2Count, h3Count, tips };
};

// --- COMPONENTS ---

const InfoTooltip = ({ content }) => (
  <div className="group relative inline-flex ml-1.5 cursor-help align-middle">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 hover:text-blue-600 transition-colors">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-[11px] font-medium leading-relaxed rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none transform group-hover:-translate-y-1 text-left">
      <ul className="list-disc pl-3 space-y-1">
        {Array.isArray(content) ? content.map((item, index) => (
          <li key={index}>{item}</li>
        )) : <li>{content}</li>}
      </ul>
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);

const FacebookPreview = ({ title, description, image, url, imageValid }) => (
  <div className="bg-[#f0f2f5] p-3 rounded-md w-full max-w-[375px] mx-auto font-sans">
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      <div className="p-3 flex items-center gap-2 mb-1">
         <div className="w-8 h-8 rounded-full bg-blue-100"></div>
         <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900">Your Page Name</span>
            <span className="text-xs text-slate-500">Sponsored · <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></span>
         </div>
      </div>
      <div className="px-3 pb-2 text-sm text-slate-800">Check out this link...</div>
      <div className="relative aspect-[1.91/1] bg-gray-100 overflow-hidden">
        {imageValid ? <img src={image} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 text-xs">1200 x 630</div>}
      </div>
      <div className="bg-[#f0f2f5] px-3 py-3 border-t border-gray-100">
        <p className="text-[10px] text-slate-500 uppercase tracking-wide">{getHostname(url)}</p>
        <p className="text-[16px] font-bold text-slate-900 leading-tight mt-0.5 line-clamp-2">{title}</p>
        <p className="text-sm text-slate-600 line-clamp-1 mt-1 hidden sm:block">{description}</p>
      </div>
    </div>
  </div>
);

const TwitterPreview = ({ title, description, image, url, twitterHandle, imageValid }) => (
  <div className="bg-white p-3 w-full max-w-[375px] mx-auto font-sans">
    <div className="flex gap-2 mb-1">
       <div className="w-9 h-9 rounded-full bg-slate-200"></div>
       <div className="flex flex-col">
          <span className="text-[13px] font-bold text-slate-900">Name <span className="font-normal text-slate-500">@{twitterHandle.replace('@','')} · 1h</span></span>
          <span className="text-[13px] text-slate-900">Just posted a new update! 👇</span>
       </div>
    </div>
    <div className="ml-11 mt-1 border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:bg-slate-50 transition-colors">
      <div className="relative aspect-[1.91/1] bg-gray-100 overflow-hidden">
         {imageValid ? <img src={image} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 text-xs">Image</div>}
      </div>
      <div className="p-3">
         <p className="text-xs text-slate-500">{getHostname(url)}</p>
         <p className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{title}</p>
         <p className="text-xs text-slate-500 mt-1 line-clamp-2">{description}</p>
      </div>
    </div>
  </div>
);

const LinkedInPreview = ({ title, url, image, imageValid }) => (
  <div className="bg-[#f3f2ef] p-3 rounded-md w-full max-w-[375px] mx-auto font-sans">
     <div className="bg-white rounded-lg shadow-sm border border-gray-300 overflow-hidden">
        <div className="p-3 flex gap-2">
           <div className="w-10 h-10 bg-slate-200 rounded"></div>
           <div>
              <p className="text-xs font-bold text-slate-900">Company Name</p>
              <p className="text-[10px] text-slate-500">1,234 followers</p>
              <p className="text-[10px] text-slate-500">1h • <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="inline"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></p>
           </div>
        </div>
        <div className="px-3 pb-2 text-sm text-slate-800">
           Check out our latest insights on blockchain technology.
        </div>
        <div className="relative aspect-[1.91/1] bg-gray-100 overflow-hidden">
           {imageValid ? <img src={image} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200 text-xs">Image Preview</div>}
        </div>
        <div className="bg-[#f9fafb] px-3 py-2 border-t border-gray-100">
           <p className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">{title}</p>
           <p className="text-xs text-slate-500 mt-0.5">{getHostname(url)}</p>
        </div>
     </div>
  </div>
);

const SeoDetails = () => {
  // --- STATE ---
  const [title, setTitle] = useState("Niparz Technologies – Blockchain & Web3 Innovation Company");
  const [description, setDescription] = useState("Niparz Technologies is a blockchain and Web3 innovation company delivering powerful decentralized solutions, crypto tools, and digital products");
  const [canonicalUrl, setCanonicalUrl] = useState("https://niparz.com/solutions/blockchain");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState(["Niparz Technologies", "Web3 Development"]);
  const [h1Tag, setH1Tag] = useState("Blockchain Innovation Partner");
  const [headerStructure, setHeaderStructure] = useState("## Our Solutions\n### DeFi Development\n### NFT Marketplaces\n## Why Choose Us?\n### Expertise & Experience");
  const [activeTemplate, setActiveTemplate] = useState("");
  const [robotsIndex, setRobotsIndex] = useState("index");
  const [robotsFollow, setRobotsFollow] = useState("follow");
  const [pageType, setPageType] = useState("News Article");
  const [language, setLanguage] = useState("en"); 
  const [authorName] = useState("Coinpedia Editor");
  const [publishDate] = useState(""); 
  const [availableSchema, setAvailableSchema] = useState("Organization"); 
  const [selectedSchemas, setSelectedSchemas] = useState(["NewsArticle", "Organization"]); 
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("https://niparz.com/assets/og-main.jpg");
  const [ogType, setOgType] = useState("website");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterSite, setTwitterSite] = useState("@NiparzTech");
  const [previewTab, setPreviewTab] = useState("google"); 
  const [socialPlatform, setSocialPlatform] = useState("facebook"); 
  const [fullJsonLd, setFullJsonLd] = useState("");

  // --- DERIVED STATE ---
  const titleVal = getValidation(title, 'title');
  const descVal = getValidation(description, 'desc');
  const urlValid = isValidUrl(canonicalUrl);
  const ogImageValid = isValidUrl(ogImage) && (ogImage.match(/\.(jpeg|jpg|gif|png|webp)$/) != null);
  const keywordCountStatus = keywords.length < LIMITS.keywords.min ? 'warning' : 'success';
  const currentKeywordLen = keywordInput.length;
  const isKeywordTooLong = currentKeywordLen > LIMITS.keywords.maxChar;
  const ogTitleVal = getValidation(ogTitle || title, 'ogTitle');
  const ogDescVal = getValidation(ogDescription || description, 'ogDesc');
  const headerStats = analyzeHeaderStructure(headerStructure);

  const checkRelevance = (tag) => {
    const content = `${title} ${description} ${h1Tag}`.toLowerCase();
    return content.includes(tag.toLowerCase());
  };

  const handleTemplateChange = (e) => {
    const type = e.target.value;
    setActiveTemplate(type);
    if (HEADER_TEMPLATES[type]) {
      setH1Tag(HEADER_TEMPLATES[type].h1);
      setHeaderStructure(HEADER_TEMPLATES[type].structure);
    }
  };

  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed === "") return;
    if (trimmed.length > LIMITS.keywords.maxChar) return;
    if (!keywords.includes(trimmed) && keywords.length < LIMITS.keywords.max) {
      setKeywords([...keywords, trimmed]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = (tagToRemove) => {
    setKeywords(keywords.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSyncSocial = () => {
    setOgTitle(title);
    setOgDescription(description);
  };

  const handleAddSchema = () => {
    if (!selectedSchemas.includes(availableSchema)) {
      setSelectedSchemas([...selectedSchemas, availableSchema]);
    }
  };

  const handleRemoveSchema = (schemaToRemove) => {
    setSelectedSchemas(selectedSchemas.filter((s) => s !== schemaToRemove));
  };

  const generateSchemaObject = (type) => {
    const baseUrl = isValidUrl(canonicalUrl) ? new URL(canonicalUrl).origin : "https://example.com";
    const finalDate = publishDate ? new Date(publishDate).toISOString() : new Date().toISOString();
    let schemaObj = { "@type": type };
    schemaObj.inLanguage = language;

    switch (type) {
      case "NewsArticle":
      case "Article":
        return {
          ...schemaObj,
          "headline": title,
          "description": description,
          "image": ogImage,
          "datePublished": finalDate,
          "dateModified": new Date().toISOString(),
          "author": { "@type": "Person", "name": authorName },
          "publisher": { "@type": "Organization", "name": "Coinpedia", "logo": { "@type": "ImageObject", "url": "https://image.coinpedia.org/logo.png" } }
        };
      case "Organization":
        return {
          ...schemaObj,
          "name": "Niparz Technologies",
          "url": baseUrl,
          "logo": `${baseUrl}/logo.png`,
          "sameAs": [`https://twitter.com/${twitterSite.replace('@','')}`, "https://linkedin.com/company/niparz"]
        };
      case "BreadcrumbList":
        return {
          ...schemaObj,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
            { "@type": "ListItem", "position": 2, "name": "News", "item": canonicalUrl }
          ]
        };
      case "VideoObject":
        return { ...schemaObj, "name": title, "description": description, "thumbnailUrl": [ogImage], "uploadDate": finalDate };
      default:
        return { ...schemaObj, "name": title };
    }
  };

  useEffect(() => {
    const graph = {
      "@context": "https://schema.org",
      "@graph": selectedSchemas.map(type => generateSchemaObject(type))
    };
    setFullJsonLd(JSON.stringify(graph, null, 2));
  }, [selectedSchemas, title, description, ogImage, canonicalUrl, twitterSite, authorName, publishDate, language]);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8 font-sans text-slate-800">
      
      {/* SECTION 1: SEO CONFIGURATION */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <h2 className="text-lg font-bold text-slate-800">SEO Configuration <span className="text-slate-400 font-normal text-sm ml-1">(Page & Meta)</span></h2>
        </div>
        
        <div className="p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* LEFT COLUMN: META */}
                <div className="space-y-6">
                    {/* TITLE */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="flex items-center text-sm font-bold text-slate-700">
                                Meta Title <span className="text-red-500 ml-1">*</span>
                                <InfoTooltip content={["Optimal: 30-60 chars.", "Include keyword.", "Avoid duplication."]} />
                            </label>
                            <div className="flex items-center gap-2">
                                {titleVal.msg && <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${titleVal.status === 'success' ? 'bg-green-100 text-green-700' : titleVal.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{titleVal.msg}</span>}
                                <span className={`text-xs ${title.length > LIMITS.title.max ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{title.length}/{LIMITS.title.max}</span>
                            </div>
                        </div>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full border rounded-md px-4 py-2.5 outline-none transition-all ${getStatusColor(titleVal.status)}`} placeholder="Page title..." />
                    </div>

                    {/* DESC */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="flex items-center text-sm font-bold text-slate-700">
                                Meta Description <span className="text-red-500 ml-1">*</span>
                                <InfoTooltip content={["Optimal: 110-160 chars.", "Summarize content.", "Include CTA."]} />
                            </label>
                            <div className="flex items-center gap-2">
                                {descVal.msg && <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${descVal.status === 'success' ? 'bg-green-100 text-green-700' : descVal.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{descVal.msg}</span>}
                                <span className={`text-xs ${description.length > LIMITS.desc.max ? 'text-red-500 font-bold' : 'text-slate-400'}`}>{description.length}/{LIMITS.desc.max}</span>
                            </div>
                        </div>
                        <textarea rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className={`w-full border rounded-md px-4 py-2.5 outline-none transition-all resize-none ${getStatusColor(descVal.status)}`} placeholder="Summarize content..." />
                    </div>

                    {/* KEYWORDS */}
                     <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="flex items-center text-sm font-bold text-slate-700">
                                Keywords <span className="text-slate-400 font-normal text-xs ml-1">(Max 10)</span>
                                <InfoTooltip content={["3-10 keywords.", "Green = Found.", "Max 40 chars."]} />
                            </label>
                            <span className={`text-xs font-bold ${keywordCountStatus === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>{keywords.length}/{LIMITS.keywords.max}</span>
                        </div>
                        <div className="relative mb-2">
                            <div className="flex gap-2">
                                <input type="text" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={handleKeyDown} disabled={keywords.length >= LIMITS.keywords.max} className={`flex-1 border rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 disabled:bg-gray-100 ${isKeywordTooLong ? 'border-red-500 focus:ring-red-100' : 'border-gray-300 focus:ring-blue-100'}`} placeholder="Add keyword..." />
                                <button onClick={handleAddKeyword} disabled={keywords.length >= LIMITS.keywords.max || isKeywordTooLong || !keywordInput.trim()} className="bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">Add</button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {keywords.map((tag, i) => {
                                const isRelevant = checkRelevance(tag);
                                return (
                                    <span key={i} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 border ${isRelevant ? 'bg-green-50 border-green-200 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`} title={isRelevant ? "Found" : "Not found"}>
                                        {tag}
                                        {isRelevant && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                                        <button onClick={() => handleRemoveKeyword(tag)} className="hover:text-red-500 ml-1">×</button>
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* CANONICAL */}
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2">Canonical URL <InfoTooltip content={["Self-referencing.", "Absolute URL.", "Starts with https://"]} /></label>
                        <input type="url" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} className={`w-full border rounded-md px-4 py-2.5 outline-none ${!urlValid ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-100'}`} />
                    </div>
                </div>

                {/* RIGHT COLUMN: STRUCTURE */}
                <div className="space-y-6">
                    {/* TEMPLATE */}
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Load Optimized Structure</label>
                        <select value={activeTemplate} onChange={handleTemplateChange} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100">
                            <option value="">-- Select Page Type --</option>
                            {Object.keys(HEADER_TEMPLATES).map(key => (<option key={key} value={key}>{key}</option>))}
                        </select>
                        {activeTemplate && <div className="mt-2 text-[10px] text-slate-600 italic bg-white p-2 rounded border border-slate-100"><span className="font-bold text-blue-600">💡 Tip:</span> {HEADER_TEMPLATES[activeTemplate].tip}</div>}
                    </div>

                    {/* H1 */}
                    <div>
                        <label className="flex items-center text-sm font-bold text-slate-700 mb-2">H1 Tag <span className="text-red-500 ml-1">*</span> <InfoTooltip content={["Single H1.", "Include keyword.", "Match Title intent."]} /></label>
                        <input type="text" value={h1Tag} onChange={(e) => setH1Tag(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                    </div>

                    {/* HEADER STRUCTURE */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="flex items-center text-sm font-bold text-slate-700">Header Structure <InfoTooltip content={["Hierarchy: H1>H2>H3.", "No skipped levels.", "Use questions in H2."]} /></label>
                             <div className="flex gap-2"><span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">H2: {headerStats.h2Count}</span><span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">H3: {headerStats.h3Count}</span></div>
                        </div>
                        <textarea rows="6" value={headerStructure} onChange={(e) => setHeaderStructure(e.target.value)} className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-slate-700 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none" placeholder="## H2 Title..." />
                        <div className="mt-2 space-y-1">
                            {headerStats.tips.map((tip, idx) => (
                                <div key={idx} className={`text-[10px] flex items-start gap-1.5 px-2 py-1 rounded ${tip.type === 'error' ? 'bg-red-50 text-red-600' : tip.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-blue-50 text-blue-700'}`}>
                                    <span className="font-bold">{tip.type === 'error' ? '✕' : tip.type === 'warning' ? '⚠' : 'ℹ'}</span>{tip.msg}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TECHNICAL SEO */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="flex items-center text-sm font-bold text-slate-700 mb-2">Robots <InfoTooltip content={["Index/Noindex.", "Follow/Nofollow."]} /></label>
                            <div className="flex gap-2">
                                <select value={robotsIndex} onChange={(e) => setRobotsIndex(e.target.value)} className="flex-1 border rounded-md px-2 py-2 text-sm focus:outline-none border-gray-300"><option value="index">Index</option><option value="noindex">No Index</option></select>
                                <select value={robotsFollow} onChange={(e) => setRobotsFollow(e.target.value)} className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none"><option value="follow">Follow</option><option value="nofollow">No Follow</option></select>
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-bold text-slate-700 mb-2">Language <InfoTooltip content={["Page language.", "ISO 639-1."]} /></label>
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                                <option value="en">English (en)</option>
                                <option value="es">Spanish (es)</option>
                                <option value="fr">French (fr)</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-bold text-slate-700 mb-2">Page Type <InfoTooltip content={["Schema type.", "e.g. Article."]} /></label>
                            <input type="text" value={pageType} disabled className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm text-slate-500 cursor-not-allowed" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION 2: SCHEMA ARCHITECTURE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                <h2 className="text-lg font-bold text-slate-800">Schema Architecture</h2>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                    <select value={availableSchema} onChange={(e) => setAvailableSchema(e.target.value)} className="w-full border border-gray-300 rounded-md pl-3 pr-8 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-100 bg-white">
                        <option value="Organization">Organization</option>
                        <option value="Article">Article</option>
                        <option value="NewsArticle">NewsArticle</option>
                        <option value="BreadcrumbList">BreadcrumbList</option>
                        <option value="VideoObject">VideoObject</option>
                    </select>
                </div>
                <button onClick={handleAddSchema} className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors">Add</button>
            </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
            {selectedSchemas.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-gray-300 text-slate-400">No active schemas.</div>
            ) : (
                selectedSchemas.map((schema, index) => {
                    const schemaData = generateSchemaObject(schema);
                    const attributes = Object.entries(schemaData).filter(([key]) => key !== '@context' && key !== '@type');
                    
                    return (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-slate-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">Active</span>
                                    <h3 className="font-bold text-slate-800 text-sm">{schema}</h3>
                                </div>
                                <button onClick={() => handleRemoveSchema(schema)} className="text-slate-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-4 border-b lg:border-b-0 lg:border-r border-gray-100 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase">Attributes & Values</h4>
                                    {attributes.slice(0, 5).map(([key, value]) => (
                                        <div key={key} className="flex flex-col text-sm">
                                            <span className="font-semibold text-slate-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                            <span className="text-slate-500 truncate font-mono text-xs bg-slate-50 px-2 py-1 rounded mt-1">{typeof value === 'object' ? JSON.stringify(value).substring(0, 40) + '...' : value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-slate-900 p-4 relative group">
                                    <div className="flex justify-between items-center mb-2">
                                         <h4 className="text-xs font-bold text-slate-500 uppercase">JSON-LD Snippet</h4>
                                         <span className="text-[10px] text-green-500 font-mono">application/ld+json</span>
                                    </div>
                                    <pre className="text-green-400 text-[10px] font-mono whitespace-pre-wrap h-40 overflow-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">{JSON.stringify(schemaData, null, 2)}</pre>
                                    <button onClick={() => navigator.clipboard.writeText(JSON.stringify(schemaData, null, 2))} className="absolute bottom-3 right-3 bg-white/10 hover:bg-white/20 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* SECTION 3: SOCIAL MEDIA PROTOCOL */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-600"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                <h2 className="text-lg font-bold text-slate-800">Social Media Protocol</h2>
            </div>
            <button onClick={handleSyncSocial} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors">Sync from Meta</button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* LEFT: Inputs */}
           <div className="space-y-6">
              <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center text-sm font-bold text-slate-700">
                        OG Title <InfoTooltip content={["Title for social.", "60-90 chars.", "Catchy."]} />
                    </label>
                    <div className="flex items-center gap-2">
                        {ogTitleVal.msg && <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${ogTitleVal.status === 'success' ? 'bg-green-100 text-green-700' : ogTitleVal.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{ogTitleVal.msg}</span>}
                        <span className={`text-xs ${ogTitle.length > LIMITS.ogTitle.max ? 'text-red-500' : 'text-slate-400'}`}>{ogTitle.length}/{LIMITS.ogTitle.max}</span>
                    </div>
                 </div>
                 <input type="text" value={ogTitle || title} onChange={(e) => setOgTitle(e.target.value)} className={`w-full border rounded-md px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 ${getStatusColor(ogTitleVal.status)}`} />
              </div>
              <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center text-sm font-bold text-slate-700">
                        OG Description <InfoTooltip content={["Desc for social.", "60-200 chars.", "No SEO rank."]} />
                    </label>
                    <div className="flex items-center gap-2">
                        {ogDescVal.msg && <span className={`text-[10px] uppercase font-bold px-1.5 rounded ${ogDescVal.status === 'success' ? 'bg-green-100 text-green-700' : ogDescVal.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{ogDescVal.msg}</span>}
                        <span className={`text-xs ${ogDescription.length > LIMITS.ogDesc.max ? 'text-red-500' : 'text-slate-400'}`}>{ogDescription.length}/{LIMITS.ogDesc.max}</span>
                    </div>
                 </div>
                 <textarea rows="3" value={ogDescription || description} onChange={(e) => setOgDescription(e.target.value)} className={`w-full border rounded-md px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 resize-none ${getStatusColor(ogDescVal.status)}`} />
              </div>
              <div>
                 <label className="flex items-center text-sm font-bold text-slate-700 mb-2">OG Image URL <InfoTooltip content={["Absolute URL.", "1200x630px.", "JPG/PNG."]} /></label>
                 <div className="relative">
                    <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} className={`w-full border rounded-md px-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 ${!ogImageValid ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`} />
                    {!ogImageValid && <span className="absolute right-3 top-3 text-yellow-600 text-[10px] font-bold">Check Format</span>}
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2">OG Type <InfoTooltip content={["Object type.", "'website'/'article'."]} /></label>
                    <select value={ogType} onChange={(e) => setOgType(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100">
                       <option value="website">Website</option>
                       <option value="article">Article</option>
                       <option value="video.other">Video</option>
                    </select>
                 </div>
                 <div>
                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2">Twitter Handle <InfoTooltip content={["@username.", "For attribution."]} /></label>
                    <input type="text" value={twitterSite} onChange={(e) => setTwitterSite(e.target.value)} placeholder="@handle" className="w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100" />
                 </div>
              </div>
           </div>

           {/* RIGHT: Live Preview */}
           <div className="bg-slate-50 border border-slate-200 rounded-md p-4 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Live Preview</span>
                    <div className="flex bg-gray-200 rounded p-1 gap-1">
                        {['google', 'social', 'schema'].map(tab => (
                            <button key={tab} onClick={() => setPreviewTab(tab)} className={`px-3 py-1 text-xs font-bold rounded capitalize ${previewTab === tab ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>{tab}</button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center min-h-[200px]">
                    {previewTab === 'google' && (
                        <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm w-full max-w-md">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500">N</div>
                                <div className="flex flex-col"><span className="text-xs text-slate-800 font-medium">Niparz Technologies</span><span className="text-[10px] text-slate-500">{canonicalUrl}</span></div>
                            </div>
                            <h3 className="text-lg text-[#1a0dab] hover:underline font-medium truncate mb-1">{title}</h3>
                            <p className="text-sm text-[#4d5156] line-clamp-2"><span className="text-gray-400">Dec 8 — </span>{description}</p>
                        </div>
                    )}
                    {previewTab === 'social' && (
                        <div className="flex flex-col items-center w-full">
                            <div className="flex gap-2 mb-4 bg-gray-200 p-1 rounded-lg">
                                {['facebook', 'twitter', 'linkedin'].map(p => (
                                    <button key={p} onClick={() => setSocialPlatform(p)} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${socialPlatform === p ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{p}</button>
                                ))}
                            </div>
                            {socialPlatform === 'facebook' && <FacebookPreview title={ogTitle || title} description={ogDescription || description} image={ogImage} url={canonicalUrl} imageValid={ogImageValid} />}
                            {socialPlatform === 'twitter' && <TwitterPreview title={ogTitle || title} description={ogDescription || description} image={ogImage} url={canonicalUrl} twitterHandle={twitterSite} imageValid={ogImageValid} />}
                            {socialPlatform === 'linkedin' && <LinkedInPreview title={ogTitle || title} url={canonicalUrl} image={ogImage} imageValid={ogImageValid} />}
                        </div>
                    )}
                    {previewTab === 'schema' && (
                        <div className="relative w-full h-full group">
                            <pre className="bg-slate-900 text-green-400 p-4 rounded-md text-[10px] font-mono h-64 overflow-auto scrollbar-thin scrollbar-thumb-slate-700">{fullJsonLd}</pre>
                            <button onClick={() => navigator.clipboard.writeText(fullJsonLd)} className="absolute top-2 right-2 bg-white/10 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Copy</button>
                        </div>
                    )}
                </div>
           </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md shadow-md hover:shadow-lg transform transition-all active:scale-95 duration-200">Save Configuration</button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <SeoDetails />
    </div>
  );
}
