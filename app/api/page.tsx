import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  RefreshCw, 
  Server, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Globe, 
  Shield, 
  Database, 
  Cloud, 
  Settings,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  Zap,
  CreditCard,
  Calendar,
  PieChart
} from 'lucide-react';

// --- Mock Data Generator ---
const generateMockApis = () => {
  const getFutureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  return [
    { id: 1, name: 'Authentication Service', provider: 'Auth0', endpoint: 'https://auth.api.internal/v2/token', method: 'POST', status: 'operational', latency: 120, uptime: 99.99, lastChecked: new Date(), billingAmount: 1200.00, nextBillingDate: getFutureDate(12), credits: { used: 85420, total: 100000 } },
    { id: 2, name: 'Payment Gateway', provider: 'Stripe', endpoint: 'https://api.stripe.com/v1/charges', method: 'POST', status: 'operational', latency: 245, uptime: 99.95, lastChecked: new Date(), billingAmount: 450.50, nextBillingDate: getFutureDate(5), credits: { used: 4500, total: 50000 } },
    { id: 3, name: 'User Data Service', provider: 'Internal', endpoint: 'https://api.internal/users', method: 'GET', status: 'degraded', latency: 850, uptime: 98.50, lastChecked: new Date(), billingAmount: 0, nextBillingDate: null, credits: { used: 120500, total: -1 } },
    { id: 4, name: 'Email Notification', provider: 'SendGrid', endpoint: 'https://api.sendgrid.com/v3/mail/send', method: 'POST', status: 'operational', latency: 180, uptime: 99.90, lastChecked: new Date(), billingAmount: 89.00, nextBillingDate: getFutureDate(28), credits: { used: 985, total: 1000 } },
    { id: 5, name: 'Search Engine', provider: 'Elasticsearch', endpoint: 'https://search.internal/query', method: 'POST', status: 'operational', latency: 45, uptime: 99.99, lastChecked: new Date(), billingAmount: 350.00, nextBillingDate: getFutureDate(15), credits: { used: 250000, total: 5000000 } },
    { id: 6, name: 'File Storage', provider: 'AWS S3', endpoint: 'https://s3.aws.com/upload', method: 'PUT', status: 'downtime', latency: 0, uptime: 95.20, lastChecked: new Date(), billingAmount: 150.25, nextBillingDate: getFutureDate(2), credits: { used: 45, total: 100 } },
    { id: 7, name: 'Analytics Stream', provider: 'Segment', endpoint: 'https://api.segment.io/v1/track', method: 'POST', status: 'operational', latency: 155, uptime: 99.98, lastChecked: new Date(), billingAmount: 500.00, nextBillingDate: getFutureDate(20), credits: { used: 890000, total: 1000000 } },
    { id: 8, name: 'Inventory Sync', provider: 'Internal', endpoint: 'https://api.internal/inventory/sync', method: 'PATCH', status: 'maintenance', latency: 0, uptime: 99.00, lastChecked: new Date(), billingAmount: 0, nextBillingDate: null, credits: { used: 500, total: -1 } },
  ];
};

const ApiMonitorDashboard = () => {
  const [apis, setApis] = useState(generateMockApis());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // --- Actions ---

  const refreshStatuses = () => {
    setLoading(true);
    // Simulate network request delay
    setTimeout(() => {
      setApis(prevApis => prevApis.map(api => {
        // Randomize latency slightly to simulate live data
        const latencyFluctuation = Math.floor(Math.random() * 50) - 25;
        let newLatency = Math.max(0, api.latency + latencyFluctuation);
        
        // Random chance to change status for demo purposes
        let newStatus = api.status;
        const randomVal = Math.random();
        
        // If it was down, 80% chance it comes back up
        if (api.status === 'downtime' && randomVal > 0.2) newStatus = 'operational';
        // Small chance a healthy service degrades
        else if (api.status === 'operational' && randomVal > 0.95) newStatus = 'degraded';
        // Small chance a degraded service fails
        else if (api.status === 'degraded' && randomVal > 0.90) newStatus = 'downtime';

        if (newStatus === 'downtime') newLatency = 0;

        return {
          ...api,
          status: newStatus,
          latency: newStatus === 'downtime' ? 0 : newLatency,
          lastChecked: new Date()
        };
      }));
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  // --- Derived State ---
  const filteredApis = useMemo(() => {
    return apis.filter(api => {
      const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            api.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || api.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [apis, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const total = apis.length;
    const operational = apis.filter(a => a.status === 'operational').length;
    const issues = apis.filter(a => ['degraded', 'downtime'].includes(a.status)).length;
    const avgLatency = Math.round(apis.reduce((acc, curr) => acc + curr.latency, 0) / (total - apis.filter(a => a.status === 'downtime').length || 1));
    // Calculate total monthly billing
    const totalBilling = apis.reduce((acc, curr) => acc + curr.billingAmount, 0);
    
    return { total, operational, issues, avgLatency, totalBilling };
  }, [apis]);

  // --- Formatters ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDateShort = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  // --- Components ---

  const StatusBadge = ({ status }) => {
    const styles = {
      operational: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      degraded: 'bg-amber-100 text-amber-700 border-amber-200',
      downtime: 'bg-rose-100 text-rose-700 border-rose-200',
      maintenance: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const icons = {
      operational: <CheckCircle2 size={14} className="mr-1.5" />,
      degraded: <AlertCircle size={14} className="mr-1.5" />,
      downtime: <X size={14} className="mr-1.5" />,
      maintenance: <Clock size={14} className="mr-1.5" />,
    };

    const labels = {
      operational: 'Operational',
      degraded: 'Degraded',
      downtime: 'Downtime',
      maintenance: 'Maintenance',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.operational}`}>
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const MethodBadge = ({ method }) => {
    const colors = {
      GET: 'bg-blue-50 text-blue-700 border-blue-200',
      POST: 'bg-green-50 text-green-700 border-green-200',
      PUT: 'bg-orange-50 text-orange-700 border-orange-200',
      DELETE: 'bg-red-50 text-red-700 border-red-200',
      PATCH: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[method] || 'bg-gray-100 text-gray-700'}`}>
        {method}
      </span>
    );
  };

  const CreditsBar = ({ used, total }) => {
    if (total === -1) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          <Globe size={10} className="mr-1" /> Unlimited
        </span>
      );
    }

    const percentage = Math.min((used / total) * 100, 100);
    let colorClass = 'bg-emerald-500';
    if (percentage > 90) colorClass = 'bg-rose-500';
    else if (percentage > 70) colorClass = 'bg-amber-500';

    return (
      <div className="w-full max-w-[140px]">
        <div className="flex justify-between text-[10px] mb-1 text-gray-500">
          <span>{formatNumber(used)}</span>
          <span>{formatNumber(total)}</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${colorClass}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      
      {/* Sidebar - Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-slate-950">
          <div className="flex items-center gap-2 font-bold text-white text-xl">
            <Shield className="text-indigo-500" />
            <span>Admin<span className="text-indigo-500">Panel</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Platform</p>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
            <Activity size={18} /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md shadow-lg shadow-indigo-900/20">
            <Server size={18} /> API Monitor
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
            <Database size={18} /> Databases
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
            <Cloud size={18} /> Storage Buckets
          </a>
          
          <div className="pt-4 mt-4 border-t border-slate-800">
             <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Settings</p>
             <a href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-800 transition-colors">
              <Settings size={18} /> Configuration
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">API Integration Status</h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={refreshStatuses}
              disabled={loading}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Refreshing...' : 'Refresh Status'}
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total APIs</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                <p className="text-xs text-gray-400 mt-1">Across 4 providers</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Globe size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Monthly Billing</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalBilling)}</h3>
                <p className="text-xs text-gray-400 mt-1">Estimated for current month</p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CreditCard size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Critical Issues</p>
                <h3 className="text-2xl font-bold text-rose-600 mt-1">{stats.issues}</h3>
                <p className="text-xs text-gray-400 mt-1">Requires attention</p>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <AlertCircle size={24} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Avg. Latency</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.avgLatency}ms</h3>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <Zap size={10} fill="currentColor" /> -12ms vs last hour
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Activity size={24} />
              </div>
            </div>
          </div>

          {/* Filters & Toolbar */}
          <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search APIs by name or provider..." 
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="appearance-none pl-4 pr-10 py-2 text-sm font-medium bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="operational">Operational</option>
                  <option value="degraded">Degraded</option>
                  <option value="downtime">Downtime</option>
                  <option value="maintenance">Maintenance</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">API Service</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Endpoint</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Latency</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Billing</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits Usage</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Uptime (24h)</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApis.length > 0 ? (
                    filteredApis.map((api) => (
                      <tr key={api.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                              {api.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{api.name}</div>
                              <div className="text-xs text-gray-500">{api.provider}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <MethodBadge method={api.method} />
                              <span className="text-xs font-mono text-gray-600 truncate max-w-[150px]" title={api.endpoint}>
                                {api.endpoint}
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Updated {api.lastChecked.toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={api.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${
                              api.latency > 500 ? 'text-amber-600' : api.latency === 0 ? 'text-gray-400' : 'text-gray-900'
                            }`}>
                              {api.latency > 0 ? `${api.latency}ms` : '-'}
                            </span>
                            {api.latency > 0 && (
                              <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    api.latency < 200 ? 'bg-emerald-500' : api.latency < 500 ? 'bg-amber-500' : 'bg-rose-500'
                                  }`} 
                                  style={{ width: `${Math.min((api.latency / 1000) * 100, 100)}%` }}
                                ></div>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            {api.billingAmount > 0 ? (
                              <>
                                <span className="text-sm font-medium text-gray-900">
                                  {formatCurrency(api.billingAmount)}
                                </span>
                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                  <Calendar size={10} />
                                  Due {formatDateShort(api.nextBillingDate)}
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-gray-400 italic">Free Tier</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <CreditsBar used={api.credits.used} total={api.credits.total} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {api.uptime}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600" title="View Logs">
                              <Activity size={16} />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600" title="Visit Endpoint">
                              <ExternalLink size={16} />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <Search size={32} className="text-gray-300 mb-3" />
                          <p>No APIs found matching your criteria.</p>
                          <button 
                            onClick={() => {setSearchTerm(''); setFilterStatus('all');}} 
                            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Showing <span className="font-medium text-gray-900">1</span> to <span className="font-medium text-gray-900">{filteredApis.length}</span> of <span className="font-medium text-gray-900">{apis.length}</span> results
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-500 bg-white disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-500 bg-white hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ApiMonitorDashboard;
