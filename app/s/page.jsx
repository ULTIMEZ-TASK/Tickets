'use client';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, 
  Plus, 
  Trash2, 
  Copy, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  ExternalLink, 
  Globe, 
  Twitter 
} from 'lucide-react';

const SeoDetails = () => {
  // --- STATE MANAGEMENT: CORE SEO ---
  const [title, setTitle] = useState("Niparz Technologies – Blockchain & Web3 Innovation Company");
  const [description, setDescription] = useState("Niparz Technologies is a blockchain and Web3 innovation company delivering powerful decentralized solutions, crypto tools, and digital products");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState(["Niparz Technologies", "Web3 Development"]);

  // --- STATE MANAGEMENT: ADVANCED SEO ---
  const [canonicalUrl, setCanonicalUrl] = useState("https://niparz.com/solutions/blockchain");
  const [h1Tag, setH1Tag] = useState("Blockchain Innovation Partner");
  const [headerStructure, setHeaderStructure] = useState("## Our Solutions\n### DeFi Development\n### NFT Marketplaces");
  
  // E-E-A-T & Indexing
  const [authorName, setAuthorName] = useState("Coinpedia Editor");
  const [publishDate, setPublishDate] = useState(""); // Date Override
  const [robotsIndex, setRobotsIndex] = useState("index");
  const [robotsFollow, setRobotsFollow] = useState("follow");
  
  // FIXED Page Type
  const [pageType] = useState("News Article"); 

  // MULTIPLE SCHEMAS
  const [availableSchema, setAvailableSchema] = useState("Organization"); 
  const [selectedSchemas, setSelectedSchemas] = useState(["NewsArticle", "Organization"]); 

  // --- STATE MANAGEMENT: SOCIAL MEDIA ---
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogType, setOgType] = useState("website");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterSite, setTwitterSite] = useState("@NiparzTech");
  
  // --- STATE MANAGEMENT: PREVIEW ---
  const [previewTab, setPreviewTab] = useState("google"); 
  const [deviceView, setDeviceView] = useState("desktop"); 
  const [jsonLdCode, setJsonLdCode] = useState("");

  // --- CONFIGURATION ---
  const TITLE_MIN = 15;
  const TITLE_MAX = 60;
  const DESC_MIN = 120;
  const DESC_MAX = 160;

  // --- HANDLERS ---
  const handleAddKeyword = () => {
    const trimmed = keywordInput.trim();
    if (trimmed !== "" && !keywords.includes(trimmed)) {
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

  // --- JSON-LD GENERATOR ---
  useEffect(() => {
    const schemaGraph = {
      "@context": "https://schema.org",
      "@graph": []
    };

    const baseUrl = new URL(canonicalUrl).origin;
    const finalDate = publishDate ? new Date(publishDate).toISOString() : new Date().toISOString();

    selectedSchemas.forEach(type => {
      let schemaObj = { "@type": type };

      switch (type) {
        case "NewsArticle":
        case "Article":
          schemaObj = {
            ...schemaObj,
            "headline": title,
            "description": description,
            "image": ogImage || `${baseUrl}/default-og.jpg`,
            "datePublished": finalDate,
            "dateModified": new Date().toISOString(),
            "author": {
              "@type": "Person",
              "name": authorName 
            },
            "publisher": {
               "@type": "Organization",
               "name": "Coinpedia",
               "logo": {
                  "@type": "ImageObject",
                  "url": "https://image.coinpedia.org/wp-content/uploads/2020/08/cp-logo.png"
               }
            }
          };
          break;
        case "Organization":
          schemaObj = {
            ...schemaObj,
            "name": "Niparz Technologies",
            "url": baseUrl,
            "logo": `${baseUrl}/logo.png`,
            "sameAs": [
              `https://twitter.com/${twitterSite.replace('@','')}`,
              "https://linkedin.com/company/niparz"
            ]
          };
          break;
        case "BreadcrumbList":
          schemaObj = {
            ...schemaObj,
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": baseUrl },
              { "@type": "ListItem", "position": 2, "name": "News", "item": canonicalUrl }
            ]
          };
          break;
        default:
          schemaObj = { ...schemaObj, "name": title };
      }
      schemaGraph["@graph"].push(schemaObj);
    });

    setJsonLdCode(JSON.stringify(schemaGraph, null, 2));
  }, [selectedSchemas, title, description, ogImage, canonicalUrl, twitterSite, authorName, publishDate]);

  // --- VALIDATION HELPERS ---
  const getValidationStatus = (text, min, max) => {
    const len = text.length;
    if (len === 0) return 'neutral';
    if (len < min || len > max) return 'error';
    return 'success';
  };

  const titleStatus = getValidationStatus(title, TITLE_MIN, TITLE_MAX);
  const descStatus = getValidationStatus(description, DESC_MIN, DESC_MAX);

  const getBorderColor = (status) => {
    switch (status) {
      case 'error': return 'border-red-500 focus:ring-red-200';
      case 'success': return 'border-green-500 focus:ring-green-200';
      default: return 'border-gray-300 focus:ring-blue-200';
    }
  };

  const getCountColor = (status) => {
    switch (status) {
      case 'error': return 'text-red-500';
      case 'success': return 'text-green-600';
      default: return 'text-gray-500';
    }
  };
  
  const isKeywordInText = (keyword, text) => {
    return text.toLowerCase().includes(keyword.toLowerCase());
  };

  const getHostname = (url) => {
    try {
      return new URL(url).hostname;
    } catch {
      return "example.com";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      {/* SECTION 1: CORE & ADVANCED SEO */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 font-sans">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-slate-800">
            SEO Configuration
            <span className="ml-2 text-sm font-normal text-slate-400 italic">(Page & Meta)</span>
          </h2>
          <span className="text-slate-500 text-sm mt-2 sm:mt-0 bg-slate-50 px-3 py-1 rounded-full border border-slate-100 flex items-center gap-2">
            Content Score: <span className="font-semibold text-green-600">92/100</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT COLUMN: META TAGS */}
          <div className="space-y-8">
            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  Meta Title <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-medium ${getCountColor(titleStatus)} transition-colors duration-300`}>
                  {title.length} / {TITLE_MAX} Characters
                </span>
              </div>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full border rounded-md px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200 ${getBorderColor(titleStatus)}`}
                placeholder="Enter meta title..."
              />
              <div className="flex justify-between mt-2">
                <span className="text-xs text-slate-400">Min: {TITLE_MIN} & Max: {TITLE_MAX} Chars</span>
                {titleStatus === 'error' && (
                  <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> Optimization needed
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  Meta Description <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs font-medium ${getCountColor(descStatus)} transition-colors duration-300`}>
                  {description.length} / {DESC_MAX} Characters
                </span>
              </div>
              <textarea 
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full border rounded-md px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all duration-200 resize-none ${getBorderColor(descStatus)}`}
                placeholder="Enter meta description..."
              />
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">
                  Canonical URL <span className="text-slate-400 font-normal ml-1">(Prevents duplicate content)</span>
               </label>
               <div className="flex items-center border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                  <span className="bg-gray-50 text-gray-500 px-3 py-3 text-sm border-r border-gray-200">
                    <ExternalLink size={16} />
                  </span>
                  <input 
                    type="url" 
                    value={canonicalUrl} 
                    onChange={(e) => setCanonicalUrl(e.target.value)}
                    className="w-full px-4 py-3 text-slate-700 focus:outline-none"
                    placeholder="https://..."
                  />
               </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Robots Meta
                        </label>
                        <div className="flex items-center gap-2">
                            <select 
                                value={robotsIndex} 
                                onChange={(e) => setRobotsIndex(e.target.value)}
                                className={`flex-1 border rounded-md px-2 py-2 text-sm font-medium focus:outline-none ${robotsIndex === 'noindex' ? 'text-red-600 border-red-300 bg-red-50' : 'text-slate-700 border-gray-300'}`}
                            >
                                <option value="index">Index</option>
                                <option value="noindex">No Index</option>
                            </select>
                            <select 
                                value={robotsFollow} 
                                onChange={(e) => setRobotsFollow(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-md px-2 py-2 text-sm text-slate-700 focus:outline-none"
                            >
                                <option value="follow">Follow</option>
                                <option value="nofollow">No Follow</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Author Attribution
                        </label>
                        <input 
                            type="text" 
                            value={authorName} 
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="e.g. Satoshi Nakamoto"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Publish Date Override <span className="font-normal text-slate-400 text-xs">(Leave empty for "Now")</span>
                        </label>
                        <input 
                            type="datetime-local" 
                            value={publishDate} 
                            onChange={(e) => setPublishDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: KEYWORDS & STRUCTURE */}
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Meta Keywords
              </label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 border border-gray-300 rounded-md px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Type keyword..."
                />
                <button 
                  onClick={handleAddKeyword}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-1"
                >
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((tag, index) => {
                  const isPresent = isKeywordInText(tag, description);
                  return (
                    <span 
                      key={index} 
                      className={`inline-flex items-center border text-sm font-medium px-3 py-1 rounded-full transition-colors ${
                        isPresent 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}
                    >
                      {isPresent && <Check size={12} className="mr-1" />}
                      {tag}
                      <button onClick={() => handleRemoveKeyword(tag)} className={`ml-2 hover:text-red-500 ${isPresent ? 'text-green-400' : 'text-slate-400'}`}>
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                H1 Tag <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={h1Tag} 
                onChange={(e) => setH1Tag(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                placeholder="Main Page Heading"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Header Structure (H2/H3)
              </label>
              <textarea 
                rows="3"
                value={headerStructure}
                onChange={(e) => setHeaderStructure(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-slate-700 font-mono text-sm focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none"
                placeholder="## Heading 2&#10;### Heading 3"
              />
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">
                  Page Type <span className="text-xs font-normal text-slate-400">(Fixed)</span>
               </label>
               <div className="relative">
                  <select 
                    value={pageType} 
                    disabled={true}
                    className="w-full border border-gray-300 bg-gray-100 rounded-md px-4 py-3 text-slate-500 appearance-none focus:outline-none cursor-not-allowed font-medium"
                  >
                     <option value="News Article">News Article</option>
                  </select>
               </div>
            </div>

            <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">
                  Applied Schemas (JSON-LD)
               </label>
               
               <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                     <select 
                       value={availableSchema} 
                       onChange={(e) => setAvailableSchema(e.target.value)}
                       className="w-full border border-gray-300 rounded-md px-4 py-3 text-slate-700 appearance-none focus:outline-none focus:ring-4 focus:ring-blue-100 bg-white"
                     >
                        <option value="Organization">Organization</option>
                        <option value="Article">Article</option>
                        <option value="NewsArticle">NewsArticle</option>
                        <option value="BreadcrumbList">BreadcrumbList</option>
                        <option value="VideoObject">VideoObject</option>
                     </select>
                  </div>
                  <button 
                     onClick={handleAddSchema}
                     className="bg-slate-700 hover:bg-slate-800 text-white font-medium px-4 py-2 rounded-md transition-colors flex items-center gap-1"
                  >
                     <Plus size={16} /> Add Schema
                  </button>
               </div>

               <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border border-dashed border-gray-300 rounded-md bg-slate-50">
                  {selectedSchemas.length === 0 ? (
                     <span className="text-sm text-slate-400 italic p-1">No schemas selected. Add one from the list.</span>
                  ) : (
                     selectedSchemas.map((schema, index) => (
                        <span key={index} className="inline-flex items-center bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold px-3 py-1 rounded-md">
                           {schema}
                           <button 
                              onClick={() => handleRemoveSchema(schema)} 
                              className="ml-2 text-blue-400 hover:text-red-500 focus:outline-none"
                              title="Remove Schema"
                           >
                              <X size={14} />
                           </button>
                        </span>
                     ))
                  )}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SOCIAL MEDIA PROTOCOL */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 font-sans">
         <div className="mb-8 border-b border-gray-100 pb-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
             <span className="text-blue-500">
                <Globe size={20} />
             </span>
             Social Media Protocol
             <span className="ml-2 text-sm font-normal text-slate-400 italic hidden sm:inline">(Open Graph & Twitter)</span>
          </h2>
          <button 
            onClick={handleSyncSocial}
            className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-md hover:bg-blue-100 transition-colors"
          >
             <RefreshCw size={14} />
             Sync from SEO
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* LEFT: OPEN GRAPH */}
           <div className="space-y-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                Open Graph (Facebook/LinkedIn)
              </h3>
              
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">OG Title</label>
                 <input 
                    type="text" 
                    value={ogTitle || title} 
                    onChange={(e) => setOgTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                    placeholder="Same as Meta Title..."
                 />
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">OG Description</label>
                 <textarea 
                    rows="3"
                    value={ogDescription || description} 
                    onChange={(e) => setOgDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-none"
                    placeholder="Same as Meta Description..."
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">OG Type</label>
                    <select 
                       value={ogType} 
                       onChange={(e) => setOgType(e.target.value)}
                       className="w-full border border-gray-300 rounded-md px-4 py-3 text-slate-700 bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
                    >
                       <option value="website">Website</option>
                       <option value="article">Article</option>
                       <option value="video.other">Video</option>
                       <option value="profile">Profile</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">OG Image URL</label>
                    <input 
                       type="text" 
                       value={ogImage} 
                       onChange={(e) => setOgImage(e.target.value)}
                       className="w-full border border-gray-300 rounded-md px-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                       placeholder="https://..."
                    />
                 </div>
              </div>
           </div>

           {/* RIGHT: TWITTER */}
           <div className="space-y-6">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Twitter size={16} /> Twitter Card
              </h3>
              
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Twitter Card Type</label>
                 <div className="flex gap-4">
                    <label className={`flex-1 border rounded-md p-3 cursor-pointer transition-all ${twitterCard === 'summary' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
                       <input type="radio" name="twitterCard" value="summary" checked={twitterCard === 'summary'} onChange={() => setTwitterCard('summary')} className="hidden" />
                       <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-sm"></div>
                          <span className="text-sm font-medium text-slate-700">Summary</span>
                       </div>
                    </label>
                    <label className={`flex-1 border rounded-md p-3 cursor-pointer transition-all ${twitterCard === 'summary_large_image' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
                       <input type="radio" name="twitterCard" value="summary_large_image" checked={twitterCard === 'summary_large_image'} onChange={() => setTwitterCard('summary_large_image')} className="hidden" />
                       <div className="flex flex-col gap-2">
                          <div className="w-full h-8 bg-gray-200 rounded-sm"></div>
                          <span className="text-sm font-medium text-slate-700">Large Image</span>
                       </div>
                    </label>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Twitter Site (@handle)</label>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">@</span>
                    <input 
                       type="text" 
                       value={twitterSite} 
                       onChange={(e) => setTwitterSite(e.target.value.replace('@', ''))}
                       className="w-full border border-gray-300 rounded-md pl-8 pr-4 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                       placeholder="username"
                    />
                 </div>
              </div>

               {/* PREVIEW BOX */}
              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-md">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-xs font-bold text-slate-500 uppercase">Live Preview</p>
                    {/* Toggle Tabs */}
                    <div className="flex bg-gray-200 rounded-lg p-1">
                       <button 
                          onClick={() => setPreviewTab("google")}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${previewTab === 'google' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          Google
                       </button>
                       <button 
                          onClick={() => setPreviewTab("social")}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${previewTab === 'social' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          Social
                       </button>
                       <button 
                          onClick={() => setPreviewTab("schema")}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${previewTab === 'schema' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                       >
                          Schema JSON
                       </button>
                    </div>
                 </div>

                 {/* GOOGLE PREVIEW */}
                 {previewTab === 'google' && (
                    <div className="bg-white p-4 rounded-md border border-gray-100 shadow-sm max-w-xl">
                       <div className="flex justify-end mb-2">
                          <button onClick={() => setDeviceView('desktop')} className={`text-[10px] px-2 py-1 rounded-l-md border ${deviceView === 'desktop' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-400'}`}>Desktop</button>
                          <button onClick={() => setDeviceView('mobile')} className={`text-[10px] px-2 py-1 rounded-r-md border-t border-b border-r ${deviceView === 'mobile' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-gray-50 text-gray-400'}`}>Mobile</button>
                       </div>

                       <div className={`${deviceView === 'mobile' ? 'max-w-[360px] border-x px-2 mx-auto' : 'w-full'}`}>
                          <div className="flex items-center gap-2 mb-1">
                             <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500">N</div>
                             <div className="flex flex-col">
                                <span className="text-xs text-slate-800 font-medium">Niparz Technologies</span>
                                <span className="text-[10px] text-slate-500">{canonicalUrl}</span>
                             </div>
                          </div>
                          <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium truncate leading-tight mb-1">
                             {title || "Page Title"}
                          </h3>
                          <p className="text-sm text-[#4d5156] leading-snug">
                             <span className="text-gray-400">Dec 8, 2025 — </span>
                             {description.length > 155 ? description.substring(0, 155) + "..." : description}
                          </p>
                       </div>
                    </div>
                 )}

                 {/* SOCIAL PREVIEW */}
                 {previewTab === 'social' && (
                    <div className="bg-white border border-gray-200 rounded-md overflow-hidden max-w-sm mx-auto shadow-sm transition-all duration-300">
                       <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-400">
                          {ogImage ? <img src={ogImage} alt="Preview" className="w-full h-full object-cover" /> : "Image Preview"}
                       </div>
                       <div className="p-3">
                          <p className="text-sm font-bold text-slate-800 truncate">{ogTitle || title}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ogDescription || description}</p>
                          <p className="text-xs text-gray-400 mt-2 lowercase">{getHostname(canonicalUrl)}</p>
                       </div>
                    </div>
                 )}

                 {/* SCHEMA PREVIEW */}
                 {previewTab === 'schema' && (
                    <div className="relative group">
                       <pre className="bg-slate-900 text-green-400 p-4 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap max-h-64 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                          {jsonLdCode}
                       </pre>
                       <button 
                          onClick={() => {navigator.clipboard.writeText(jsonLdCode)}}
                          className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white p-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Copy to Clipboard"
                       >
                          <Copy size={14} />
                       </button>
                    </div>
                 )}
              </div>

           </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex justify-end pt-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md shadow-md hover:shadow-lg transform transition-all active:scale-95 duration-200 flex items-center gap-2">
          Save Configuration
        </button>
      </div>

    </div>
  );
};

// --- APP WRAPPER ---

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <SeoDetails />
    </div>
  );
}

// --- ENTRY POINT ---

const root = document.getElementById('root');
if (root) {
  ReactDOM.render(<App />, root);
} else {
  console.error("Root element not found");
}

export default SeoDetails;
