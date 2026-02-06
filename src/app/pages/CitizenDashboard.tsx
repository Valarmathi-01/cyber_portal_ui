import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Phone, Mail, FileText, User, AlertCircle, MapPin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChatAssistant } from '../components/ChatAssistant';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import citizenService, { ComplaintRecord } from '../../services/citizenService';

export function CitizenDashboard() {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.id) {
            const data = await citizenService.getMyComplaints(user.id);
            setComplaints(data || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch complaints", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Calculate stats
  const total = complaints.length;
  // Statuses from API sample: "SUBMITTED". 
  // Assuming "CLOSED" or "RESOLVED" for closed cases.
  const closed = complaints.filter(c => ['CLOSED', 'RESOLVED', 'REJECTED'].includes(c.status?.toUpperCase())).length;
  const pending = total - closed;
  
  const pieData = [
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Closed', value: closed, color: '#10b981' },
  ];

  const pendingPercent = total > 0 ? Math.round((pending/total)*100) : 0;
  const closedPercent = total > 0 ? Math.round((closed/total)*100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Citizen Dashboard</h1>
            <p className="text-slate-500 text-sm">Welcome back, {localStorage.getItem('userName') || 'Citizen'}</p>
          </div>
          <Link to="/report">
             <Button className="bg-orange-600 hover:bg-orange-700 text-white">
               <AlertCircle className="mr-2 h-4 w-4" /> Report New Complaint
             </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card className="border-l-4 border-l-blue-500 shadow-sm">
             <CardContent className="p-6">
               <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Complaints</p>
               <h3 className="text-3xl font-bold text-slate-900 mt-2">{total}</h3>
             </CardContent>
           </Card>
           
           <Card className="border-l-4 border-l-amber-500 shadow-sm">
             <CardContent className="p-6">
               <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Pending Cases</p>
               <h3 className="text-3xl font-bold text-slate-900 mt-2">{pending}</h3>
             </CardContent>
           </Card>
           
           <Card className="border-l-4 border-l-emerald-500 shadow-sm">
             <CardContent className="p-6">
               <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Closed Cases</p>
               <h3 className="text-3xl font-bold text-slate-900 mt-2">{closed}</h3>
             </CardContent>
           </Card>

           <Card className="shadow-sm overflow-hidden">
             <div className="h-full min-h-[120px] flex items-center justify-between p-4">
                <div className="w-24 h-24 shrink-0">
                    <PieChart width={96} height={96}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                </div>
                <div className="flex-1 pl-4 space-y-2">
                   <div className="flex items-center gap-2 text-xs text-slate-600">
                     <div className="w-3 h-3 rounded-full bg-amber-500"></div> 
                     <span>Pending ({pendingPercent}%)</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-600">
                     <div className="w-3 h-3 rounded-full bg-emerald-500"></div> 
                     <span>Closed ({closedPercent}%)</span>
                   </div>
                </div>
             </div>
           </Card>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Complaints List - Full Width */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-white sticky top-0 z-10">
                <CardTitle className="text-lg flex justify-between items-center">
                  Recent Complaints
                  <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{total} Total</span>
                </CardTitle>
              </CardHeader>
              <div className="divide-y divide-slate-100">
                 {isLoading ? (
                   <div className="p-8 text-center text-slate-500">Loading complaints...</div>
                 ) : complaints.length === 0 ? (
                   <div className="p-8 text-center text-slate-500">No complaints found.</div>
                 ) : (
                   complaints.map((c) => (
                     <Link 
                       key={c.id} 
                       to={`/citizen/complaint/${c.acknowledgementNo}`}
                       aria-label={`View details for complaint ${c.acknowledgementNo}`}
                       className="block p-5 hover:bg-slate-50 transition-colors group"
                     >
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         <div className="space-y-1">
                           <div className="flex items-center gap-3">
                             <span className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{c.acknowledgementNo}</span>
                             <Badge variant={c.status === 'CLOSED' ? 'default' : c.status === 'SUBMITTED' ? 'secondary' : 'destructive'} className="text-[10px] px-2 py-0.5">
                               {c.status}
                             </Badge>
                           </div>
                           <div className="flex items-center gap-4 text-sm text-slate-500">
                             <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {c.category}</span>
                             <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.policeStation || c.district}</span>
                           </div>
                           <p className="text-xs text-slate-400">Filed on: {new Date(c.incidentDate).toLocaleDateString()}</p>
                         </div>
                         <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors hidden sm:block" />
                       </div>
                     </Link>
                   ))
                 )}
              </div>
            </Card>

            {/* Helpline & Support Card */}
            <Card className="bg-gradient-to-r from-blue-900 to-slate-900 text-white border-none shadow-md overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Phone className="h-32 w-32" />
              </div>
              <CardContent className="p-6 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-1">Need Immediate Help?</h3>
                  <p className="text-blue-100 text-sm mb-4 max-w-md">
                    If you suspect financial fraud, call 1930 immediately to freeze the transaction. For other queries, reach out to our support team.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button size="sm" className="bg-white text-blue-900 hover:bg-blue-50 border-none font-bold">
                      <Phone className="h-4 w-4 mr-2" /> Call 1930
                    </Button>
                    <Button size="sm" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                      <Mail className="h-4 w-4 mr-2" /> support@cybercrime.gov.in
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Global Chat Assistant */}
      <ChatAssistant />
    </div>
  );
}
