import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  LayoutDashboard, PieChart as PieChartIcon, FileText, Settings, 
  Download, Search, Calendar, Filter, ArrowUp, ArrowDown, MapPin, Loader2 
} from 'lucide-react';
import jsPDF from 'jspdf';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { DashboardStats, getDashboardStats } from '../../services/adminService';
import analyticsService from '../../services/analyticsService';
import { toast } from 'sonner';

// --- Mock Data Constants ---
const MOCK_TREND_DATA = [
  { week: 'W1', avgDays: 12 },
  { week: 'W2', avgDays: 14 },
  { week: 'W3', avgDays: 10 },
  { week: 'W4', avgDays: 8 },
  { week: 'W5', avgDays: 15 },
  { week: 'W6', avgDays: 9 },
];

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30days');
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  // Chart Data States
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState(MOCK_TREND_DATA);
  const [regionData, setRegionData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all required data in parallel
        const [statsResponse, statusResponse, regionResponse] = await Promise.all([
             getDashboardStats(),
             analyticsService.getByStatus(),
             analyticsService.getByState()
        ]);

        const data = statsResponse?.data || {};
        const statusRawData = statusResponse?.data || {};
        const regionRawData = regionResponse?.data || {};
        
        // Ensure data is not null before setting state
        if (statsResponse?.data) {
             setStats(statsResponse.data);
        } else {
             console.warn("Stats data is missing", statsResponse);
        }

        // Transform Category Data
        // Add safety check for byCategory
        const catData = Object.entries(data.byCategory || {}).map(([name, count]) => ({
             name: name.replace(/_/g, ' '), 
             count: count as number
        }));
        setCategoryData(catData.length > 0 ? catData : []);

        // Transform Status Data from NEW service
        const COLORS = ['#0A2E5C', '#00B7C2', '#F97316', '#EF4444', '#8B5CF6'];
        const statData = Object.entries(statusRawData || {}).map(([name, value], index) => ({
             name: name.replace(/_/g, ' '),
             value: value as number,
             color: COLORS[index % COLORS.length]
        }));
        setStatusData(statData.length > 0 ? statData : []);

        // Transform Region Data from NEW service
        const total = data.totalComplaints || 1;
        const regData = Object.entries(regionRawData || {}).map(([name, count]) => ({
             name: name === "null" ? "Unknown" : name.replace(/_/g, ' '),
             count: count as number,
             percent: Math.round(((count as number) / total) * 100)
        })).sort((a,b) => b.count - a.count).slice(0, 5);
        setRegionData(regData.length > 0 ? regData : []);

      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    
    // Header
    doc.setFillColor(10, 46, 92); // Navy Blue
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('Cybercrime Analytics Report', 20, 25);
    doc.setFontSize(10);
    doc.text(`Generated on: ${date}`, 20, 35);
    
    // Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Executive Summary', 20, 60);
    
    doc.setFontSize(12);
    doc.text(`Total Complaints Processed: ${stats?.totalComplaints || 0}`, 20, 75);
    doc.text(`Pending Active Cases: ${stats?.pendingComplaints || 0}`, 20, 85);
    doc.text(`Closed Cases: ${stats?.resolvedComplaints || 0}`, 20, 95);
    doc.text(`Average Processing Time: 14 Days`, 20, 105);

    // Categories
    doc.setFontSize(16);
    doc.text('Top Crime Categories', 20, 130);
    doc.setFontSize(12);
    categoryData.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.name}: ${item.count} complaints`, 20, 145 + (index * 10));
    });

    // High Alert Regions
    doc.setFontSize(16);
    doc.text('High Alert Regions', 20, 210);
    doc.setFontSize(12);
    regionData.forEach((item, index) => {
      doc.text(`${item.name} (${item.count} cases)`, 20, 225 + (index * 10));
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('National Cyber Crime Reporting Portal - Confidential', 20, 280);
    
    doc.save('cybercrime_analytics_report.pdf');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F6F8FB]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0A2E5C] mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Fetching secure analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#F6F8FB]">
      {/* Left Sidebar Navigation - Removed as per request */}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#0A2E5C]">Dashboard with Visual Analytics</h1>
            <p className="text-slate-500 text-sm mt-1">Real-time insights and crime trend analysis</p>
          </div>
          
          <div className="flex flex-wrap gap-3">

          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            title="Total Complaints" 
            value={stats?.totalComplaints?.toLocaleString() || "0"} 
            trend="+12% from last month" 
            trendUp={true}
          />
          <SummaryCard 
            title="Pending Cases" 
            value={stats?.pendingComplaints?.toLocaleString() || "0"} 
            trend={`${stats?.totalComplaints ? Math.round((stats.pendingComplaints / stats.totalComplaints) * 100) : 0}% of total cases`} 
            trendUp={false} // Good that it's down, but visually down arrow
            color="text-orange-600"
          />
          <SummaryCard 
            title="Closed Cases" 
            value={stats?.resolvedComplaints?.toLocaleString() || "0"} 
            trend={`${stats?.totalComplaints ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100) : 0}% completion rate`} 
            trendUp={true}
            color="text-green-600"
          />
          <SummaryCard 
            title="Avg Processing Time" 
            value="14 Days" 
            trend="2 days faster" 
            trendUp={true} // Improvement
            color="text-[#00B7C2]"
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* A) Complaints by Category */}
          <Card className="lg:col-span-2 border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-[#0A2E5C]">Complaints by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      />
                      <Bar dataKey="count" fill="#0A2E5C" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* B) Closed vs Pending */}
          <Card className="lg:col-span-1 border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#0A2E5C]">Case Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative" style={{ width: '100%', height: 300, minWidth: 0 }}>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">No data available</div>
                )}
                
                {/* Center Text (Only show if data exists) */}
                {statusData.length > 0 && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center -mt-4">
                    <span className="text-3xl font-bold text-[#0A2E5C]">
                      {Math.round((stats?.resolvedComplaints! / (stats?.totalComplaints || 1)) * 100)}%
                    </span>
                    <p className="text-xs text-slate-500">Resolved</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Secondary Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* C) Top Regions */}
          <Card className="lg:col-span-3 border-slate-200 shadow-sm rounded-xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-[#0A2E5C]">Top Regions (High Alert)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {regionData.length > 0 ? (
                  regionData.map((region) => (
                    <div key={region.name}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-slate-700 flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-slate-400" /> {region.name}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{region.count}</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00B7C2] rounded-full" 
                          style={{ width: `${region.percent}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-400">No regional data available</div>
                )}
              </div>
            </CardContent>
          </Card>
        
        </div>

        {/* Footer Note */}
        <div className="mt-8 border-t border-slate-200 pt-6 text-center">
          <p className="text-sm text-slate-500">
            Analytics data updates every 24 hours. For emergency assistance call <span className="font-bold text-red-600">1930</span>.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            © 2024 National Cyber Crime Reporting Portal. All rights reserved.
          </p>
        </div>

      </main>
    </div>
  );
}

// --- Helper Components ---

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button 
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-[#E6F8F9] text-[#00B7C2]' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SummaryCard({ title, value, trend, trendUp, color = "text-[#0A2E5C]" }: any) {
  return (
    <Card className="border-slate-200 shadow-sm rounded-xl">
      <CardContent className="p-6">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className={`text-2xl font-bold mt-1 ${color}`}>{value}</h3>
        <div className="flex items-center gap-1 mt-2">
          {trendUp ? (
            <ArrowUp className="h-3 w-3 text-green-500" />
          ) : (
            <ArrowDown className="h-3 w-3 text-red-500" />
          )}
          <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
