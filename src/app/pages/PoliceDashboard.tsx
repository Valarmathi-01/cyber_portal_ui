import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { AlertCircle, FileText, CheckCircle, Users } from 'lucide-react';

const data = [
  { name: 'Mon', crimes: 12 },
  { name: 'Tue', crimes: 19 },
  { name: 'Wed', crimes: 15 },
  { name: 'Thu', crimes: 25 },
  { name: 'Fri', crimes: 32 },
  { name: 'Sat', crimes: 28 },
  { name: 'Sun', crimes: 20 },
];

const categoryData = [
  { name: 'Financial', value: 450 },
  { name: 'Social', value: 300 },
  { name: 'Identity', value: 120 },
  { name: 'Hacking', value: 80 },
];

export function PoliceDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Officer Dashboard</h1>
            <p className="text-sm text-slate-500">Cyber Crime Cell, New Delhi Region</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Reports</Button>
            <Button>+ Manual Entry</Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Assigned Cases" value="42" icon={<FileText className="h-4 w-4 text-blue-600" />} trend="+12%" />
          <StatCard title="Pending Review" value="18" icon={<AlertCircle className="h-4 w-4 text-orange-600" />} trend="+5%" />
          <StatCard title="Resolved (Month)" value="156" icon={<CheckCircle className="h-4 w-4 text-green-600" />} trend="+24%" />
          <StatCard title="Suspects Identified" value="8" icon={<Users className="h-4 w-4 text-purple-600" />} trend="New" />
        </div>

        {/* Charts & Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
             {/* Charts */}
             <Card>
               <CardHeader>
                 <CardTitle>Crime Trend (Weekly)</CardTitle>
               </CardHeader>
               <CardContent>
                 <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={data}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} />
                       <YAxis axisLine={false} tickLine={false} />
                       <Tooltip />
                       <Area type="monotone" dataKey="crimes" stroke="#ea580c" fill="#fff7ed" strokeWidth={2} />
                     </AreaChart>
                   </ResponsiveContainer>
                 </div>
               </CardContent>
             </Card>

             {/* Recent Cases Table */}
             <Card>
               <CardHeader><CardTitle>Recent Assignments</CardTitle></CardHeader>
               <CardContent>
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-slate-50 text-slate-500 font-medium">
                       <tr>
                         <th className="px-4 py-3 rounded-tl-lg">ID</th>
                         <th className="px-4 py-3">Type</th>
                         <th className="px-4 py-3">Victim</th>
                         <th className="px-4 py-3">Severity</th>
                         <th className="px-4 py-3 rounded-tr-lg">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       <TableRow id="CYB-129" type="Phishing" victim="Rahul Kumar" severity="High" />
                       <TableRow id="CYB-130" type="Stalking" victim="Anjali Singh" severity="Medium" />
                       <TableRow id="CYB-131" type="UPI Fraud" victim="Mohd. Irfan" severity="Critical" />
                       <TableRow id="CYB-132" type="Data Theft" victim="Tech Corp" severity="High" />
                     </tbody>
                   </table>
                 </div>
               </CardContent>
             </Card>
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader><CardTitle>Crime Distribution</CardTitle></CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                       <Tooltip />
                       <Bar dataKey="value" fill="#1e293b" radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                 <h3 className="font-bold text-orange-800 mb-2">Priority Alerts</h3>
                 <ul className="space-y-2 text-sm text-orange-700">
                   <li className="flex gap-2 items-start">• <span className="flex-1">New Ransomware variant detected in North Zone servers.</span></li>
                   <li className="flex gap-2 items-start">• <span className="flex-1">Mass phishing campaign targeting SBI users reported.</span></li>
                 </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        </div>
        <div className="mt-4 text-xs text-green-600 font-medium bg-green-50 inline-block px-2 py-1 rounded">
          {trend} from last month
        </div>
      </CardContent>
    </Card>
  );
}

function TableRow({ id, type, victim, severity }: any) {
  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 font-medium text-slate-900">{id}</td>
      <td className="px-4 py-3">{type}</td>
      <td className="px-4 py-3 text-slate-600">{victim}</td>
      <td className="px-4 py-3">
        <Badge variant={severity === 'Critical' ? 'destructive' : severity === 'High' ? 'secondary' : 'default'}>
          {severity}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
      </td>
    </tr>
  );
}
