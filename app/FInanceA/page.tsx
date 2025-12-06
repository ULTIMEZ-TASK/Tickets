"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Sector 
} from 'recharts';
import { 
  Search, Info, Star, Scale, QrCode, Share2, UserPlus, Building2,
  Layers, List, TrendingUp, ChevronLeft, ChevronRight, ExternalLink, Calendar,
  Flag, X, ChevronDown, LucideIcon
} from 'lucide-react';

// --- Types & Interfaces ---

interface Investor {
  name: string;
  logo: string;
}

interface MilestoneData {
  date: string;
  amount: number;
  label?: string;
}

interface SplitData {
  name: string;
  value: number;
  color: string;
}

interface FundingRow {
  id: number;
  investors: Investor[];
  category: string;
  date: string;
  round: string;
  investedBy: string;
  raised: string;
}

interface InvestmentRow {
  id: number;
  name: string;
  logo: string;
  investedOn: string;
  category: string;
  round: string;
  amount: string;
}

interface RevenueRow {
  id: number;
  year: string;
  quarter: string;
  stream: string;
  generated: string;
  revenue: string;
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

const fundingMilestonesData: MilestoneData[] = [
  { date: 'Dec, 2022', amount: 2, label: 'Corp Round' },
  { date: 'Nov, 2023', amount: 11, label: 'Series B' },
  { date: 'Nov, 2024', amount: 4, label: 'Pre-Seed' },
  { date: 'Mar, 2025', amount: 8, label: 'Series D' },
];

const fundingSplitData: SplitData[] = [
  { name: 'Vertex Ventures', value: 60, color: '#3b82f6' },
  { name: 'Sequoia', value: 30, color: '#6366f1' },
  { name: 'Others', value: 10, color: '#cbd5e1' },
];

const fundingTableData: FundingRow[] = [
  { 
    id: 1, 
    investors: [{ name: 'MGX. Inc', logo: 'M' }],
    category: 'Venture Capitalists (VCs)', 
    date: 'Mar 1, 2025', 
    round: 'Series D', 
    investedBy: 'Company', 
    raised: 'Not Disclosed' 
  },
  { 
    id: 2, 
    investors: [
      { name: 'Sequoia Capital', logo: 'S' },
      { name: 'Andreessen Horowitz', logo: 'A' },
      { name: 'Coinbase Ventures', logo: 'C' }
    ],
    category: 'Venture Capitalists (VCs)', 
    date: 'Feb 15, 2025', 
    round: 'Series D', 
    investedBy: 'Company', 
    raised: '$ 50 M' 
  },
  { 
    id: 3, 
    investors: [{ name: 'Trustwallet', logo: 'T' }],
    category: 'Corporate Venture', 
    date: 'Nov 5, 2024', 
    round: 'Pre-Seed Round', 
    investedBy: 'Company', 
    raised: 'Not Disclosed' 
  },
  { 
    id: 4, 
    investors: [{ name: 'Binance Labs', logo: 'B' }],
    category: 'Corporate Venture', 
    date: 'Oct 20, 2024', 
    round: 'Pre-Seed Round', 
    investedBy: 'Company', 
    raised: '$ 5 M' 
  },
  { 
    id: 5, 
    investors: [{ name: 'Vertex Ventures', logo: 'V' }],
    category: 'Private Equity', 
    date: 'Nov 23, 2023', 
    round: 'Series B', 
    investedBy: 'Company', 
    raised: '$ 11 M' 
  },
  { 
    id: 6, 
    investors: [{ name: 'Tokocrypto', logo: 'TC' }],
    category: 'Acquisition', 
    date: 'Dec 13, 2022', 
    round: 'Corporate Round', 
    investedBy: 'Company', 
    raised: 'Not Disclosed' 
  }
];

const investmentMilestonesData: MilestoneData[] = [
  { date: 'Jul, 2017', amount: 0.5 },
  { date: 'Apr, 2020', amount: 0.8 },
  { date: 'May, 2020', amount: 1.2 },
  { date: 'Dec, 2024', amount: 10 },
  { date: 'Mar, 2025', amount: 5 },
  { date: 'Apr, 2025', amount: 4 },
  { date: 'Jun, 2025', amount: 9.5 },
];

const investmentSplitData: SplitData[] = [
  { name: 'Usual', value: 35.09, color: '#3b82f6' }, 
  { name: 'Concrete', value: 33.33, color: '#6366f1' }, 
  { name: 'Opinion Labs', value: 17.54, color: '#10b981' }, 
  { name: 'Gata', value: 14.04, color: '#f97316' }, 
];

const investmentTableData: InvestmentRow[] = [
  { id: 1, name: 'Concrete', logo: 'C', investedOn: 'Jun 23, 2025', category: 'Strategic Partnership', round: 'Corporate Round', amount: '$ 9.5 M' },
  { id: 2, name: 'Gata', logo: 'G', investedOn: 'Apr 30, 2025', category: 'Lead Investor', round: 'Seed Round', amount: '$ 4 M' },
  { id: 3, name: 'Opinion Labs', logo: 'O', investedOn: 'Mar 18, 2025', category: 'Lead Investor', round: 'Seed Round', amount: '$ 5 M' },
  { id: 4, name: 'Usual', logo: 'U', investedOn: 'Dec 23, 2024', category: 'Co-Lead Investor', round: 'Series A', amount: '$ 10 M' },
  { id: 5, name: 'Tokocrypto', logo: 'T', investedOn: 'May 12, 2020', category: 'Corporation', round: 'Corporate Round', amount: 'Not Disclosed' },
  { id: 6, name: 'Coinmarketcap', logo: 'CM', investedOn: 'Apr 1, 2020', category: 'Exchange Venture', round: 'Corporate Round', amount: 'Not Disclosed' },
  { id: 7, name: 'Trustwallet', logo: 'TW', investedOn: 'Jul 31, 2017', category: 'Corporate Venture', round: 'Venture Round', amount: 'Not Disclosed' },
];

const revenueMilestonesData: MilestoneData[] = [
  { date: '2021', amount: 8.5 },
  { date: '2022', amount: 12 },
  { date: '2023', amount: 16.8 },
  { date: '2024', amount: 20.2 },
];

const revenueTableData: RevenueRow[] = [
  { id: 1, year: '2023', quarter: 'Annually', stream: '-', generated: '-', revenue: '$ 16.8 B' },
  { id: 2, year: '2022', quarter: 'Annually', stream: '-', generated: '-', revenue: '$ 12 B' },
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
  onClick: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 rounded-md text-sm font-medium border transition-colors ${
      active
        ? 'bg-[#0f172a] text-white border-[#0f172a]'
        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
    }`}
  >
    {label}
  </button>
);

const StatBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
    {children}
  </span>
);

const IconButton: React.FC<{ icon: LucideIcon }> = ({ icon: Icon }) => (
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
           Comprehensive financial overview tracking real-time funding milestones, strategic investment portfolios, and annual revenue growth streams.
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

// --- MODAL COMPONENT ---

interface ReportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportDataModal: React.FC<ReportDataModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Flag size={18} className="text-red-500" />
            Report Data Inaccuracy
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Help us maintain accuracy. Please select the type of error you found.
          </p>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Issue Type</label>
            <select className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option>Incorrect Funding Amount</option>
              <option>Wrong Date / Year</option>
              <option>Missing Investor / Partner</option>
              <option>Incorrect Company Info</option>
              <option>Other</option>
            </select>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Description / Correct Data</label>
            <textarea 
              rows={4} 
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              placeholder="e.g. The Series B round was actually $15M led by..."
            ></textarea>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
                alert("Thank you! Your report has been submitted for review.");
                onClose();
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CHART COMPONENTS ---

const getYearFromDate = (dateStr: string): number => {
    if (!dateStr) return 0;
    if (/^\d{4}$/.test(dateStr)) return parseInt(dateStr);
    const parts = dateStr.split(',');
    if (parts.length > 1) return parseInt(parts[1].trim());
    return 0;
};

interface GenericBarChartProps {
  data: MilestoneData[];
  title: string;
  unit?: string;
  barColor?: string;
}

const GenericBarChart: React.FC<GenericBarChartProps> = ({ data, title, unit = 'M', barColor = "#3b82f6" }) => {
    const [timeRange, setTimeRange] = useState<string>('Overall');

    const filteredData = useMemo(() => {
        if (timeRange === 'Overall') return data;
        const currentYear = 2025; 
        let cutoffYear = currentYear;
        if (timeRange === '1 Yr') cutoffYear = currentYear - 1;
        if (timeRange === '3 Yr') cutoffYear = currentYear - 3;
        if (timeRange === '5 Yr') cutoffYear = currentYear - 5;
        if (timeRange === '10 Yr') cutoffYear = currentYear - 10;
        return data.filter(item => getYearFromDate(item.date) >= cutoffYear);
    }, [data, timeRange]);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden h-full flex flex-col">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
                <span className="text-9xl font-black text-gray-900 tracking-tighter">Binance</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {title} <TrendingUp size={16} className="text-green-500"/>
                </h2>
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
            <div className="flex-1 min-h-[280px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredData} barSize={filteredData.length < 5 ? 60 : 40}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value}${unit}`} />
                        <Tooltip cursor={{fill: '#f8fafc', opacity: 0.8}} content={({ active, payload, label }: any) => {
                                if (active && payload && payload.length) {
                                return (
                                    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 p-3 rounded-xl shadow-xl">
                                        <p className="text-xs text-gray-500 font-semibold mb-1">{label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-bold text-gray-900">${payload[0].value}</span>
                                            <span className="text-xs text-gray-500 font-medium">{unit === 'B' ? 'Billion' : 'Million'}</span>
                                        </div>
                                    </div>
                                );
                                }
                                return null;
                            }} />
                        <defs>
                            <linearGradient id={`gradient-${barColor}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={barColor} stopOpacity={1}/>
                                <stop offset="95%" stopColor={barColor} stopOpacity={0.8}/>
                            </linearGradient>
                        </defs>
                        <Bar dataKey="amount" fill={`url(#gradient-${barColor})`} radius={[6, 6, 0, 0]} animationDuration={1500} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
};

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={innerRadius - 6} outerRadius={outerRadius + 10} fill={fill} opacity={0.2} />
      </g>
    );
};

interface GenericSplitChartProps {
  data: SplitData[];
  title: string;
  totalValue: string;
  totalLabel: string;
}

const GenericSplitChart: React.FC<GenericSplitChartProps> = ({ data, title, totalValue, totalLabel }) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [centerText, setCenterText] = useState<{ value: string; label: string }>({ value: totalValue, label: totalLabel });

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
        setCenterText({ value: `${data[index].value}%`, label: data[index].name });
    };

    const onPieLeave = () => {
        setActiveIndex(null);
        setCenterText({ value: totalValue, label: totalLabel });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
            <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
            <div className="flex-1 flex flex-col items-center justify-between relative">
                <div className="w-full grid grid-cols-2 gap-2 mb-2 px-2">
                    {data.map((item, idx) => (
                        <div key={idx} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${activeIndex === idx ? 'bg-gray-50' : ''}`} onMouseEnter={() => onPieEnter(null, idx)} onMouseLeave={onPieLeave}>
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor: item.color}}></div>
                                <span className={`text-xs font-medium truncate ${activeIndex === idx ? 'text-gray-900' : 'text-gray-600'}`}>{item.name}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
                <div className="relative w-full h-[220px] flex items-end justify-center overflow-hidden">
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie activeIndex={activeIndex} activeShape={renderActiveShape} data={data} cx="50%" cy="80%" startAngle={180} endAngle={0} innerRadius={85} outerRadius={125} paddingAngle={3} dataKey="value" onMouseEnter={onPieEnter} onMouseLeave={onPieLeave} cursor="pointer">
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none transition-all duration-300">
                        <div className={`text-2xl font-black text-gray-900 ${activeIndex !== null ? 'scale-110' : ''} transition-transform`}>{centerText.value}</div>
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">{centerText.label}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Table Components ---

// Reusable Filter Button Component
interface FilterDropdownProps {
  label: string;
  icon?: LucideIcon;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, icon: Icon = ChevronDown }) => (
  <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 flex items-center gap-2 transition-colors whitespace-nowrap">
    {label}
    <Icon size={14} className="text-gray-400" />
  </button>
);

// Updated ReportButton to accept onClick
interface ReportButtonProps {
  onClick?: () => void;
}

const ReportButton: React.FC<ReportButtonProps> = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="px-3 py-1.5 border border-red-200 rounded-md text-sm text-red-600 bg-red-50 hover:bg-red-100 flex items-center gap-2 transition-colors whitespace-nowrap ml-2" 
    title="Report Inaccurate Data"
  >
    <Flag size={14} /> Report Data inaccuracies
  </button>
);

const TablePagination: React.FC = () => (
  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
    <span className="text-xs text-gray-500">Showing 1-10 of 124 records</span>
    <div className="flex items-center gap-2">
      <button className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 disabled:opacity-50"><ChevronLeft size={16} /></button>
      <div className="flex items-center gap-1">
        <button className="w-7 h-7 rounded-md bg-blue-600 text-white text-xs font-medium">1</button>
        <button className="w-7 h-7 rounded-md hover:bg-gray-200 text-gray-600 text-xs font-medium">2</button>
        <button className="w-7 h-7 rounded-md hover:bg-gray-200 text-gray-600 text-xs font-medium">3</button>
        <span className="text-gray-400 text-xs">...</span>
      </div>
      <button className="p-1.5 rounded-md hover:bg-gray-200 text-gray-500"><ChevronRight size={16} /></button>
    </div>
  </div>
);

const Badge: React.FC<{ text: string; type?: string }> = ({ text, type = 'blue' }) => {
  const styles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    gray: 'bg-gray-100 text-gray-700 border-gray-200'
  };
  
  let styleKey = type;
  if (text.includes('Series')) styleKey = 'blue';
  if (text.includes('Seed')) styleKey = 'green';
  if (text.includes('Corporate')) styleKey = 'gray';
  if (text.includes('Partnership')) styleKey = 'purple';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${styles[styleKey] || styles.gray}`}>
      {text}
    </span>
  );
};

interface TableProps {
  onReport?: () => void;
}

const FundingListTable: React.FC<TableProps> = ({ onReport }) => {
  const [viewMode, setViewMode] = useState<'list' | 'group'>('list');
  
  const groupedData = useMemo(() => {
    return fundingTableData.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, FundingRow[]>);
  }, []);
  const categories = Object.keys(groupedData);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Enhanced Header with Specific Filters */}
      <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">Funding List</h2>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setViewMode('list')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}><List size={14} /> List</button>
            <button onClick={() => setViewMode('group')} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'group' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}><Layers size={14} /> Group</button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown label="Select Funding Rounds" />
          <FilterDropdown label="Investor Type" />
          <FilterDropdown label="Type" />
          <FilterDropdown label="Start Date - End Date" icon={Calendar} />
          
          <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-auto" />
          </div>
          {/* Functional Report Button */}
          <ReportButton onClick={onReport} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 w-12 text-center">#</th>
              <th className="px-6 py-4">Investor Name</th>
              {viewMode === 'list' && <th className="px-6 py-4">Investor Category</th>}
              <th className="px-6 py-4">Funding Date</th>
              <th className="px-6 py-4">Round</th>
              <th className="px-6 py-4">By</th>
              <th className="px-6 py-4">Raised</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          {viewMode === 'list' ? (
            <tbody className="divide-y divide-gray-100">
              {fundingTableData.map((row) => (
                <tr key={row.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-4 text-gray-400 text-center align-middle">{row.id}</td>
                  <td className="px-6 py-4 align-middle">
                    <div className="flex flex-col gap-2">
                      {row.investors.map((investor, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0 shadow-sm">{investor.logo}</div>
                          <span className="font-semibold text-gray-900">{investor.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle"><span className="text-gray-600 text-xs font-medium">{row.category}</span></td>
                  <td className="px-6 py-4 text-gray-900 font-medium align-middle">{row.date}</td>
                  <td className="px-6 py-4 align-middle"><Badge text={row.round} /></td>
                  <td className="px-6 py-4 text-gray-600 align-middle">{row.investedBy}</td>
                  <td className="px-6 py-4 align-middle">
                    <span className={`font-bold ${row.raised.includes('$') ? 'text-gray-900' : 'text-gray-400 italic'}`}>{row.raised}</span>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <button className="p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"><ExternalLink size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            categories.map((category) => (
               <tbody key={category} className="border-b border-gray-100 last:border-0">
                <tr className="bg-gray-50/80"><td colSpan={8} className="px-6 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><Layers size={12}/> {category}</td></tr>
                {groupedData[category].map(row => (
                    <tr key={row.id} className="hover:bg-blue-50/50 group">
                        <td className="px-6 py-4 text-gray-400 text-center">{row.id}</td>
                        <td className="px-6 py-4"><div className="flex flex-col gap-2">{row.investors.map((inv, i) => <div key={i} className="flex items-center gap-2"><span className="font-semibold text-gray-900">{inv.name}</span></div>)}</div></td>
                        <td className="px-6 py-4 text-gray-900">{row.date}</td>
                        <td className="px-6 py-4"><Badge text={row.round} /></td>
                        <td className="px-6 py-4 text-gray-600">{row.investedBy}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{row.raised}</td>
                        <td className="px-6 py-4"><button className="p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100"><ExternalLink size={14} /></button></td>
                    </tr>
                ))}
               </tbody>
            ))
          )}
        </table>
      </div>
      <TablePagination />
    </div>
  );
};

// Accept onReport prop
const InvestmentTable: React.FC<TableProps> = ({ onReport }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      {/* Enhanced Header with Specific Filters */}
      <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900 whitespace-nowrap">Investments List</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          <FilterDropdown label="Select Funding Rounds" />
          <FilterDropdown label="Investor Category" />
          <FilterDropdown label="Start Date - End Date" icon={Calendar} />
          
          <div className="relative">
             <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
             <input type="text" placeholder="Search companies..." className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-auto" />
          </div>
          {/* Functional Report Button */}
          <ReportButton onClick={onReport} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 w-12 text-center">#</th>
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Invested On</th>
              <th className="px-6 py-4">Investor Category</th>
              <th className="px-6 py-4">Investment Rounds</th>
              <th className="px-6 py-4">Fund Invested</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {investmentTableData.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/50 transition-colors group">
                <td className="px-6 py-4 text-gray-400 text-center align-middle">{row.id}</td>
                <td className="px-6 py-4 align-middle">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 shrink-0 border border-blue-100">{row.logo}</div>
                    <span className="font-bold text-gray-900">{row.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-900 font-medium align-middle">{row.investedOn}</td>
                <td className="px-6 py-4 align-middle"><span className="text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs">{row.category}</span></td>
                <td className="px-6 py-4 align-middle"><Badge text={row.round} /></td>
                <td className="px-6 py-4 align-middle">
                    <span className={`font-bold ${row.amount.includes('$') ? 'text-gray-900' : 'text-gray-400 italic'}`}>{row.amount}</span>
                </td>
                <td className="px-6 py-4 align-middle">
                    <button className="p-2 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"><ExternalLink size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination />
    </div>
);

// Accept onReport prop
const RevenueTable: React.FC<TableProps> = ({ onReport }) => (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">Revenue Growth List</h2>
        <div className="flex items-center">
            {/* Functional Report Button */}
            <ReportButton onClick={onReport} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="px-6 py-4">Revenue Year</th>
              <th className="px-6 py-4">Quarter</th>
              <th className="px-6 py-4">Revenue Stream</th>
              <th className="px-6 py-4">Amount Generated</th>
              <th className="px-6 py-4 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {revenueTableData.map((row) => (
              <tr key={row.id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900">{row.year}</td>
                <td className="px-6 py-4 text-gray-600">{row.quarter}</td>
                <td className="px-6 py-4 text-gray-400">{row.stream}</td>
                <td className="px-6 py-4 text-gray-400">{row.generated}</td>
                <td className="px-6 py-4 font-bold text-gray-900 text-right">{row.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);

const SimilarCompanies: React.FC = () => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Companies</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {similarCompaniesData.map((company) => (
        <div key={company.name} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col h-full">
           <div className="flex justify-between items-start mb-4">
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded">Centralised Exchange</span>
              <button className="text-gray-300 hover:text-yellow-400"><Star size={16} /></button>
           </div>
           <div className="mb-4">
             <div className={`w-12 h-12 rounded-full ${company.color} flex items-center justify-center text-white font-bold text-xl mb-3`}>{company.icon}</div>
             <h3 className="font-bold text-lg text-gray-900 mb-1">{company.name}</h3>
             <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 min-h-[2.5em]">{company.desc}</p>
           </div>
           <div className="mt-auto pt-4 border-t border-gray-50">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300 overflow-hidden relative"><div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300"></div></div>
               <span className="text-xs font-semibold text-gray-700">{company.country}</span>
             </div>
             <button className="w-full bg-[#0052cc] hover:bg-blue-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">Follow</button>
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
        The financial data, company details, funding information, and related metrics presented on this page are compiled from publicly accessible sources, validated reports, and direct company releases. Coinpedia does not warrant the absolute accuracy, completeness, or timeliness of the information. The content is intended for informational purposes only and should not be interpreted as financial advice, investment guidance, or official verification of company performance. Coinpedia assumes no liability for errors, updates, or decisions made relying on this content
      </p>
    </div>
  </div>
);

export default function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState<string>('Finance');
  const [activeSubTab, setActiveSubTab] = useState<string>('Funding Rounds'); // 'Funding Rounds' | 'Investments' | 'Revenue Growth'
  const [isReportModalOpen, setReportModalOpen] = useState<boolean>(false);

  // --- Tab Information Data ---
  const tabContent: Record<string, { title: string; description: React.ReactNode }> = {
    'Funding Rounds': {
      title: "Capital Raised & Fundraising History",
      description: (
        <>
          Tracks the history of capital Binance has secured from external investors, including seed rounds, Series A-D, and strategic partnerships. Use this to gauge investor confidence and company valuation growth. If the data is inaccurate, <button onClick={() => setReportModalOpen(true)} className="text-red-600 hover:underline font-medium inline-flex items-center p-0 bg-transparent border-0 cursor-pointer">report to us</button>.
        </>
      )
    },
    'Investments': {
      title: "Strategic Portfolio & Holdings",
      description: "A comprehensive record of projects and startups backed by Binance (e.g., via Binance Labs). This section visualizes how the company is deploying capital to grow its ecosystem."
    },
    'Revenue Growth': {
      title: "Financial Performance & Income Streams",
      description: "An analysis of the company's generated income over fiscal years. This data highlights operational profitability, growth trends, and the sustainability of the business model."
    }
  };

  // --- SEO Update Hook ---
  useEffect(() => {
    document.title = "Binance Financial Intelligence | CoinPedia";
    let metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
    }
    metaDescription.content = "A comprehensive financial overview of Binance, tracking real-time funding milestones, strategic investment portfolios, and annual revenue growth streams.";
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <CompanyHeader />

        {/* --- Navigation Tabs --- */}
        <div className="border-b border-gray-200 mb-8 overflow-x-auto">
          <div className="flex min-w-max">
            {['About', 'Products & Holdings', 'Team members', 'Events', 'Finance', 'Youtube', 'Social Media'].map((tab) => (
              <HeaderTab key={tab} label={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)} />
            ))}
          </div>
        </div>
        
        {/* --- SUB TAB NAVIGATION (Funding/Investment/Revenue) --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <FilterPill label="Funding Rounds" active={activeSubTab === 'Funding Rounds'} onClick={() => setActiveSubTab('Funding Rounds')} />
            <FilterPill label="Investments" active={activeSubTab === 'Investments'} onClick={() => setActiveSubTab('Investments')} />
            <FilterPill label="Revenue Growth" active={activeSubTab === 'Revenue Growth'} onClick={() => setActiveSubTab('Revenue Growth')} />
          </div>
        </div>

        {/* --- SECTION SUB-HEADER --- */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100 flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
                <h2 className="text-sm font-bold text-gray-900">{tabContent[activeSubTab].title}</h2>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {tabContent[activeSubTab].description}
                </p>
            </div>
        </div>

        {/* --- DYNAMIC CONTENT BASED ON SUB-TAB --- */}

        {/* 1. FUNDING VIEW */}
        {activeSubTab === 'Funding Rounds' && (
            <>
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <StatBadge><span className="font-bold mr-1">6</span> Total Investors</StatBadge>
                    <StatBadge><span className="font-bold mr-1">$ 66,000,000</span> Total Fund Raised</StatBadge>
                    <StatBadge><span className="font-bold mr-1">5</span> Total Rounds</StatBadge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 h-full">
                        <GenericBarChart data={fundingMilestonesData} title="Funding Milestones" unit="M" barColor="#3b82f6" />
                    </div>
                    <GenericSplitChart data={fundingSplitData} title="Total Funding Split" totalValue="$ 11,000,000" totalLabel="Total Funds Raised" />
                </div>
                <FundingListTable onReport={() => setReportModalOpen(true)} />
            </>
        )}

        {/* 2. INVESTMENT VIEW */}
        {activeSubTab === 'Investments' && (
             <>
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <StatBadge><span className="font-bold mr-1">7</span> Invested Companies</StatBadge>
                    <StatBadge><span className="font-bold mr-1">$ 28,500,000</span> Total Investment</StatBadge>
                    <StatBadge><span className="font-bold mr-1">4</span> Total Rounds</StatBadge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                     <div className="lg:col-span-2 h-full">
                        <GenericBarChart data={investmentMilestonesData} title="Investment Milestones" unit="M" barColor="#6366f1" />
                     </div>
                    <GenericSplitChart data={investmentSplitData} title="Total Investment Split" totalValue="$ 28.5 M" totalLabel="Total Funds Invested" />
                </div>
                <InvestmentTable onReport={() => setReportModalOpen(true)} />
            </>
        )}

        {/* 3. REVENUE VIEW */}
        {activeSubTab === 'Revenue Growth' && (
             <>
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <StatBadge><span className="font-bold mr-1">1</span> Total Years</StatBadge>
                    <StatBadge><span className="font-bold mr-1">$ 28.8 B</span> Total Revenue</StatBadge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 h-full">
                         <GenericBarChart data={revenueMilestonesData} title="Revenue Milestones" unit="B" barColor="#3b82f6" />
                    </div>
                     {/* Placeholder for visual balance, or could be empty */}
                    <div className="hidden lg:block"></div> 
                </div>
                <RevenueTable onReport={() => setReportModalOpen(true)} />
            </>
        )}

        <SimilarCompanies />
        <DisclaimerBox />
        
        {/* --- Render Modal --- */}
        <ReportDataModal isOpen={isReportModalOpen} onClose={() => setReportModalOpen(false)} />
      </main>
    </div>
  );
}
