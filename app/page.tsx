'use client';

import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, TooltipProps 
} from 'recharts';
import { 
  Search, ChevronDown, Info, Star, Scale, QrCode, Share2, 
  UserPlus, Building2, Layers, List, LucideIcon 
} from 'lucide-react';
// import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import Link from 'next/link';

// Inside your return JSX:
<Link href="/publish-timing" className="text-blue-600 underline">
  Go to Publish Tool
</Link>
// --- Interfaces & Types ---

interface FundingMilestone {
  date: string;
  amount: number;
  label: string;
  [key: string]: any; // <--- ADD THIS LINE (Fixes BarChart)
}

interface FundingSplit {
  name: string;
  value: number;
  color: string;
  [key: string]: any; // <--- ADD THIS LINE (Fixes PieChart error)
}

interface FundingTableItem {
  id: number;
  name: string;
  category: string;
  date: string;
  round: string;
  investedBy: string;
  raised: string;
  logo: string;
}

interface SimilarCompany {
  name: string;
  type: string;
  desc: string;
  country: string;
  color: string;
  icon: string;
}

// --- Mock Data ---

const fundingMilestonesData: FundingMilestone[] = [
  { date: 'Dec, 2022', amount: 0, label: 'Corp Round' },
  { date: 'Nov, 2023', amount: 11, label: 'Series B' },
  { date: 'Nov, 2024', amount: 0, label: 'Pre-Seed' },
  { date: 'Mar, 2025', amount: 0, label: 'Series D' },
];

const fundingSplitData: FundingSplit[] = [
  { name: 'Vertex Ventures', value: 100, color: '#3b82f6' },
];

const fundingTableData: FundingTableItem[] = [
  { id: 1, name: 'MGX. Inc', category: 'Venture Capitalists (VCs)', date: 'Mar 1, 2025', round: 'Series D', investedBy: 'Company', raised: 'Not Disclosed', logo: 'M' },
  { id: 2, name: 'Sequoia Capital', category: 'Venture Capitalists (VCs)', date: 'Feb 15, 2025', round: 'Series D', investedBy: 'Company', raised: '$ 50 M', logo: 'S' },
  { id: 3, name: 'Trustwallet', category: 'Corporate Venture', date: 'Nov 5, 2024', round: 'Pre-Seed Round', investedBy: 'Company', raised: 'Not Disclosed', logo: 'T' },
  { id: 4, name: 'Binance Labs', category: 'Corporate Venture', date: 'Oct 20, 2024', round: 'Pre-Seed Round', investedBy: 'Company', raised: '$ 5 M', logo: 'B' },
  { id: 5, name: 'Vertex Ventures', category: 'Private Equity', date: 'Nov 23, 2023', round: 'Series B', investedBy: 'Company', raised: '$ 11 M', logo: 'V' },
  { id: 6, name: 'Tokocrypto', category: 'Acquisition', date: 'Dec 13, 2022', round: 'Corporate Round', investedBy: 'Company', raised: 'Not Disclosed', logo: 'TC' },
];

const similarCompaniesData: SimilarCompany[] = [
  { name: 'BityPreco', type: 'Centralised Exchange', desc: "Bitypreco Is Latin America's First Cryptocurrency Marketplace", country: 'Brazil', color: 'bg-yellow-500', icon: 'B' },
  { name: 'Grinex', type: 'Centralised Exchange', desc: 'Grinex Is A New Cryptocurrency Exchange In Russia.', country: 'Russia', color: 'bg-orange-500', icon: 'G' },
  { name: 'Yellow Card', type: 'Centralised Exchange', desc: 'Yellow Card Is A Centralized Exchange In Africa.', country: 'United States', color: 'bg-yellow-400', icon: 'Y' },
  { name: 'Busha', type: 'Centralised Exchange', desc: 'Busha, A Well-Known Cryptocurrency Exchange In Nigeria.', country: 'Nigeria', color: 'bg-green-600', icon: 'B' },
];

// --- Sub-Components ---

interface HeaderTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const HeaderTab: React.FC<HeaderTabProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-1 py-4 text-sm font-medium transition-colors border-b-2 mx-4 whitespace-nowrap ${
      active
        ? 'border-blue-600 text-blue-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {label}
  </button>
);

interface FilterPillProps {
  label: string;
  active: boolean;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, active }) => (
  <button
    className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
      active
        ? 'bg-[#0f172a] text-white border-[#0f172a]'
        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

interface StatBadgeProps {
  children: React.ReactNode;
}

const StatBadge: React.FC<StatBadgeProps> = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
    {children}
  </span>
);

interface IconButtonProps {
  icon: LucideIcon;
}

const IconButton: React.FC<IconButtonProps> = ({ icon: Icon }) => (
  <button className="p-2 text-gray-400 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors">
    <Icon size={18} />
  </button>
);

const CompanyHeader: React.FC = () => (
  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
    <div className="flex gap-5">
      <div className="w-20 h-20 shrink-0 bg-[#1e2026] rounded-full flex items-center justify-center shadow-sm">
        <div className="w-10 h-10 border-4 border-[#F0B90B] transform rotate-45"></div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Binance</h1>
        <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
          Binance is the largest Cryptocurrency Exchange in the world also plays the role of an event organizer.
        </p>
      </div>
    </div>
    <div className="flex flex-col items-end gap-3 w-full md:w-auto">
      <div className="flex items-center gap-2">
        <IconButton icon={Star} />
        <IconButton icon={Scale} />
        <IconButton icon={QrCode} />
        <IconButton icon={Share2} />
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <UserPlus size={18} />
          Follow
        </button>
      </div>
      <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:underline">
        <Building2 size={16} />
        Claim Your Company
      </button>
    </div>
  </div>
);

interface MilestonesChartSectionProps {
  timeRange: string;
  setTimeRange: (range: string) => void;
}

const MilestonesChartSection: React.FC<MilestonesChartSectionProps> = ({ timeRange, setTimeRange }) => (
  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
      <span className="text-9xl font-black text-gray-900 tracking-tighter">Binance</span>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10">
      <h2 className="text-lg font-bold text-gray-900">Funding Milestones</h2>
      <div className="flex bg-gray-100 rounded-lg p-1 mt-2 sm:mt-0 w-fit">
        {['1 Yr', '3 Yr', '5 Yr', '10 Yr', 'Overall'].map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              timeRange === range
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>

    <div className="h-[280px] w-full relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={fundingMilestonesData as any} barSize={60}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#64748b', fontSize: 12}} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{fill: '#64748b', fontSize: 12}} 
            tickFormatter={(value: number) => `$ ${value} M`}
          />
          <Tooltip 
  cursor={{fill: 'transparent'}}
  content={({ active, payload, label }: any) => { // <--- FIXED: Changed to 'any'
      if (active && payload && payload.length) {
      return (
          <div className="bg-gray-900 text-white p-2 rounded text-xs">
              <p className="font-bold">{label}</p>
              <p>${payload[0].value} Million</p>
          </div>
      );
      }
      return null;
  }}
/>
          <defs>
            <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <Bar 
            dataKey="amount" 
            fill="url(#colorBlue)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const FundingSplitSection: React.FC = () => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
    <h2 className="text-lg font-bold text-gray-900 mb-6">Total Funding Split</h2>
    
    <div className="flex-1 flex flex-col items-center justify-between relative">
        <div className="w-full flex justify-between items-center mb-4 px-2">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-700">Vertex Ventures</span>
            </div>
            <span className="text-sm font-medium text-gray-900">100.00%</span>
        </div>

      <div className="relative w-full h-[200px] flex items-end justify-center overflow-hidden">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={fundingSplitData as any}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={130}
              paddingAngle={0}
              dataKey="value"
            >
              {fundingSplitData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute bottom-4 left-0 right-0 text-center">
            <div className="text-xl font-bold text-gray-900">$ 11,000,000</div>
            <div className="text-xs text-gray-500 font-medium">Total Funds Raised</div>
        </div>
      </div>
    </div>
  </div>
);

const FundingListTable: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'group'>('list');

  // Function to group data by category
  const groupedData = useMemo(() => {
    return fundingTableData.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, FundingTableItem[]>);
  }, []);

  const categories = Object.keys(groupedData);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">Funding List</h2>
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <List size={14} /> List
            </button>
            <button 
              onClick={() => setViewMode('group')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'group' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Layers size={14} /> Group by Industry
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 flex items-center gap-2">
              Select funding Rounds <ChevronDown size={14} />
          </button>
          <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                  type="text" 
                  placeholder="Search" 
                  className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 w-full md:w-auto"
              />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 w-12">#</th>
              <th className="px-6 py-4">Investor Name</th>
              {viewMode === 'list' && <th className="px-6 py-4">Investor Category</th>}
              <th className="px-6 py-4">Funding Date</th>
              <th className="px-6 py-4">Funding Round</th>
              <th className="px-6 py-4">Invested By</th>
              <th className="px-6 py-4">Fund Raised</th>
            </tr>
          </thead>
          
          {viewMode === 'list' ? (
            <tbody className="divide-y divide-gray-100">
              {fundingTableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500">{row.id}.</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">
                        {row.logo}
                      </div>
                      <span className="font-semibold text-gray-900">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{row.category}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{row.date}</td>
                  <td className="px-6 py-4 text-gray-600">{row.round}</td>
                  <td className="px-6 py-4 text-gray-600">{row.investedBy}</td>
                  <td className={`px-6 py-4 font-medium ${row.raised.includes('$') ? 'text-gray-900' : 'text-gray-400'}`}>
                    {row.raised}
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            // Grouped View
            categories.map((category) => (
              <tbody key={category} className="border-b border-gray-100 last:border-0">
                <tr className="bg-gray-50">
                  <td colSpan={7} className="px-6 py-3 font-bold text-gray-800 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Layers size={12} className="text-blue-500"/> {category}
                  </td>
                </tr>
                {groupedData[category].map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-500 pl-8">{row.id}.</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">
                          {row.logo}
                        </div>
                        <span className="font-semibold text-gray-900">{row.name}</span>
                      </div>
                    </td>
                    {/* Category Column Hidden in Grouped Mode */}
                    <td className="px-6 py-4 text-gray-900 font-medium">{row.date}</td>
                    <td className="px-6 py-4 text-gray-600">{row.round}</td>
                    <td className="px-6 py-4 text-gray-600">{row.investedBy}</td>
                    <td className={`px-6 py-4 font-medium ${row.raised.includes('$') ? 'text-gray-900' : 'text-gray-400'}`}>
                      {row.raised}
                    </td>
                  </tr>
                ))}
              </tbody>
            ))
          )}
        </table>
      </div>
    </div>
  );
};

const SimilarCompanies: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Companies</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {similarCompaniesData.map((company) => (
        <div key={company.name} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
           <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">
                Centralised Exchange
              </span>
              <button className="text-gray-300 hover:text-yellow-400">
                <Star size={16} />
              </button>
           </div>
           
           <div className="mb-4">
             <div className={`w-12 h-12 rounded-full ${company.color} flex items-center justify-center text-white font-bold text-xl mb-3`}>
               {company.icon}
             </div>
             <h3 className="font-bold text-lg text-gray-900 mb-1">{company.name}</h3>
             <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 min-h-[2.5em]">
               {company.desc}
             </p>
           </div>

           <div className="mt-auto pt-4 border-t border-gray-50">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300"></div>
               </div>
               <span className="text-xs font-semibold text-gray-700">{company.country}</span>
             </div>
             <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
               Follow
             </button>
           </div>
        </div>
      ))}
    </div>
  </div>
);

const DisclaimerBox: React.FC = () => (
  <div className="bg-[#f0f9ff] border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
    <Info className="text-[#0052cc] shrink-0 mt-0.5" size={18} />
    <div className="text-sm text-[#172b4d]">
      <p className="font-bold mb-1">Disclaimer</p>
      <p className="opacity-80 leading-relaxed text-xs sm:text-sm">
        The content provided on this dashboard is for informational purposes only and does not constitute financial, investment, or other professional advice. 
        CoinPedia does not guarantee the accuracy, completeness, or timeliness of the data displayed. 
        Please conduct your own independent research before making any investment decisions.
      </p>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('Finance');
  const [timeRange, setTimeRange] = useState<string>('Overall');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <CompanyHeader />

        {/* --- Navigation Tabs --- */}
        <div className="border-b border-gray-200 mb-8 overflow-x-auto">
          <div className="flex min-w-max">
            {['About', 'Products & Holdings', 'Team members', 'Events', 'Finance', 'Youtube', 'Social Media'].map((tab) => (
              <HeaderTab
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
        </div>
        
        {/* --- DASHBOARD CONTENT --- */}

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FilterPill label="Funding" active={true} />
            <FilterPill label="Investment" active={false} />
            <FilterPill label="Revenue" active={false} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <StatBadge>
            <span className="font-bold mr-1">6</span> Total Investors
          </StatBadge>
          <StatBadge>
            <span className="font-bold mr-1">$ 66,000,000</span> Total Fund Raised
          </StatBadge>
          <StatBadge>
            <span className="font-bold mr-1">5</span> Total Rounds
          </StatBadge>
        </div>

        {/* Top Section: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <MilestonesChartSection timeRange={timeRange} setTimeRange={setTimeRange} />
          <FundingSplitSection />
        </div>

        {/* Middle Section: Funding List Table */}
        <FundingListTable />

        {/* Bottom Section: Similar Companies */}
        <SimilarCompanies />

        {/* Footer: Disclaimer */}
        <DisclaimerBox />

      </main>
    </div>
  );
}