import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { FileText, Users, UserX, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { DashboardStats, AdminComplaint, getDashboardStats, getAllComplaints, getSuspectReportList, getVolunteersList } from '../../../services/adminService';
import { toast } from 'sonner';

const COLORS = ['#F97316', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<AdminComplaint[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [suspectCount, setSuspectCount] = useState<number>(0);
  const [volunteerCount, setVolunteerCount] = useState<number>(0);
  const [approvedVolunteerCount, setApprovedVolunteerCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Helper to safely fetch with partial error handling
      const safeFetch = async <T,>(promise: Promise<any>, fallback: T): Promise<T> => {
        try {
          const res = await promise;
          return res.data;
        } catch (error) {
          // Silent fallback for partial failures
          return fallback;
        }
      };

      const defaultStats: DashboardStats = {
        byCategory: {},
        resolvedComplaints: 0,
        byRegion: {},
        pendingComplaints: 0,
        byStatus: {},
        totalComplaints: 0
      };

      // Fetch all in parallel but handle errors individually
      const [statsData, complaintsData] = await Promise.all([
        safeFetch(getDashboardStats(), defaultStats),
        safeFetch(getAllComplaints(), []),
      ]);
      
      setStats(statsData);

      
      // Process Recent Complaints (Sorted by Incident Date or Created At)
      const sortedComplaints = Array.isArray(complaintsData) ? complaintsData
        .sort((a: AdminComplaint, b: AdminComplaint) => {
          const dateA = new Date(a.incidentDate || a.createdAt).getTime();
          const dateB = new Date(b.incidentDate || b.createdAt).getTime();
          return dateB - dateA;
        })
        .slice(0, 3) : [];
        
      setRecentComplaints(sortedComplaints);

      // Process Monthly Trend Data (Last 6 Months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const trendMap = new Map<string, number>();
      
      if (Array.isArray(complaintsData)) {
        complaintsData.forEach((complaint: AdminComplaint) => {
            const date = new Date(complaint.incidentDate || complaint.createdAt);
            const monthName = months[date.getMonth()];
            trendMap.set(monthName, (trendMap.get(monthName) || 0) + 1);
        });
      }

      // Generate last 6 months structure
      const today = new Date();
      const calculatedTrend = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthName = months[d.getMonth()];
        const count = trendMap.get(monthName) || 0;
        calculatedTrend.push({ month: monthName, complaints: count });
      }
      setTrendData(calculatedTrend);

    } catch (error) {
      console.error('Critical failure in dashboard:', error);
      toast.error('Failed to initialize dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Transform API data for charts
  const categoryData = stats ? Object.entries(stats.byCategory).map(([key, value]) => ({
    name: key.replace(/_/g, ' '),
    count: value
  })) : [];

  const statusData = stats ? Object.entries(stats.byStatus).map(([key, value]) => ({
    name: key.replace(/_/g, ' '),
    value: value
  })) : [];

  const kpiCards = [
    { 
      title: 'Total Complaints', 
      value: stats?.totalComplaints.toString() || '0', 
      icon: FileText, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Pending Actions', 
      value: stats?.pendingComplaints.toString() || '0', 
      icon: Clock, 
      color: 'text-orange-600', 
      bg: 'bg-orange-50' 
    },
    { 
      title: 'Resolved Cases', 
      value: stats?.resolvedComplaints.toString() || '0', 
      icon: CheckCircle, 
      color: 'text-green-600', 
      bg: 'bg-green-50' 
    },
    // { 
    //   title: 'Suspect Reports', 
    //   value: suspectCount.toString(),
    //   icon: UserX, 
    //   color: 'text-red-600', 
    //   bg: 'bg-red-50' 
    // },
    // { 
    //   title: 'Approved Volunteers', 
    //   value: approvedVolunteerCount.toString(),
    //   icon: Users, 
    //   color: 'text-purple-600', 
    //   bg: 'bg-purple-50' 
    // },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
        <div className="text-sm text-slate-500">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="border-l-4 border-l-blue-900 shadow-sm hover:shadow-md transition-shadow min-w-0">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
                {loading ? (
                   <div className="h-8 w-16 bg-slate-200 animate-pulse rounded mt-1"></div>
                ) : (
                   <h3 className="text-2xl font-bold text-slate-800 mt-1">{kpi.value}</h3>
                )}
              </div>
              <div className={`p-3 rounded-full ${kpi.bg}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm min-w-0">
          <CardHeader>
            <CardTitle className="text-lg">Complaints by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full min-h-[320px] min-w-0">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center text-slate-400">Loading chart...</div>
              ) : categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={categoryData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" tick={{fontSize: 12, fontWeight: 'bold', fill: '#64748b'}} />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={140} 
                      tick={{fontSize: 12, fontWeight: 'bold', fill: '#334155'}} 
                      interval={0}
                      tickFormatter={(value) => value.toString().replace(/_/g, ' ')}
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(226, 232, 240, 0.5)' }}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="count" fill="#1e3a8a" radius={[0, 4, 4, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm min-w-0">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full min-h-[320px] min-w-0">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
              ) : trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="complaints" stroke="#ea580c" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No trend data available</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="shadow-sm lg:col-span-1 min-w-0">
          <CardHeader>
            <CardTitle className="text-lg">Case Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full min-h-[400px] min-w-0">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400">Loading chart...</div>
              ) : statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart margin={{ top: 0, bottom: 20 }}>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="45%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      iconSize={10}
                      wrapperStyle={{ fontSize: '11px', paddingTop: '10px', width: '100%' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm lg:col-span-2 min-w-0">
          <CardHeader>
            <CardTitle className="text-lg">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-50 animate-pulse rounded-md border border-slate-100" />
                  ))}
                </div>
              ) : recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-md">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 text-sm">
                        New Complaint: {complaint.category.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-xs text-red-700 mt-1">
                        Reported by {complaint.citizenName || 'Anonymous'} in {complaint.state || 'Unknown State'} on {complaint.incidentDate ? new Date(complaint.incidentDate).toLocaleDateString() : new Date(complaint.createdAt).toLocaleDateString()}.
                        {complaint.additionalInfo && ` Note: ${complaint.additionalInfo.substring(0, 60)}${complaint.additionalInfo.length > 60 ? '...' : ''}`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p>No recent alerts or complaints found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}