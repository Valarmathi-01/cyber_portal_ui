import React, { useState, useEffect } from 'react';
import { Search, Globe, Phone, Mail, MessageCircle, Smartphone, User, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { getSuspectReportList } from '../../../services/adminService';
import { toast } from 'sonner';

export default function AdminSuspects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suspects, setSuspects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuspects();
  }, []);

  const fetchSuspects = async () => {
    try {
      setLoading(true);
      const response = await getSuspectReportList();
      
      const formattedSuspects = response.data.map(item => ({
        id: item.id,
        type: item.identifierType.replace(/_/g, ' '),
        identifier: item.identifierValue,
        state: item.incidentState?.replace(/_/g, ' ') || 'Unknown',
        reportedBy: `${item.reportCount} Report${item.reportCount !== 1 ? 's' : ''}`, // Using report count as proxy for reporter info
        date: new Date(item.lastReportedAt).toLocaleDateString(),
        status: 'Under Review', // Default status as API doesn't provide it yet
        description: item.description
      }));
      
      setSuspects(formattedSuspects);
    } catch (error: any) {
      if (error?.response?.status !== 500) {
        console.error('Failed to fetch suspects:', error);
      }
      toast.error('Failed to load suspect reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuspects = suspects.filter(s => 
    s.identifier.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('website') || lowerType.includes('url')) return <Globe className="w-4 h-4 text-blue-500" />;
    if (lowerType.includes('phone') || lowerType.includes('mobile')) return <Phone className="w-4 h-4 text-green-500" />;
    if (lowerType.includes('email')) return <Mail className="w-4 h-4 text-orange-500" />;
    if (lowerType.includes('whatsapp')) return <MessageCircle className="w-4 h-4 text-green-600" />;
    if (lowerType.includes('app')) return <Smartphone className="w-4 h-4 text-purple-500" />;
    if (lowerType.includes('social')) return <User className="w-4 h-4 text-pink-500" />;
    return <AlertTriangle className="w-4 h-4 text-slate-500" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-red-100 text-red-800 border-red-200'; // Confirmed suspect
      case 'Blocked': return 'bg-slate-800 text-white border-slate-900';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Suspect Repository Reports</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex gap-4">
            <div className="relative w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search identifier..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" onClick={fetchSuspects}>
                Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                <tr>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Identifier Value</th>
                  <th className="px-4 py-3 font-medium">State</th>
                  <th className="px-4 py-3 font-medium">Report Count</th>
                  <th className="px-4 py-3 font-medium">Last Reported</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                   <tr>
                     <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                       Loading suspects...
                     </td>
                   </tr>
                ) : filteredSuspects.length > 0 ? (
                  filteredSuspects.map((suspect) => (
                    <tr key={suspect.id} className="border-b hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(suspect.type)}
                          <span className="capitalize">{suspect.type.toLowerCase()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium font-mono text-slate-700">{suspect.identifier}</td>
                      <td className="px-4 py-3">{suspect.state}</td>
                      <td className="px-4 py-3 text-slate-500">{suspect.reportedBy}</td>
                      <td className="px-4 py-3">{suspect.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      No suspect reports found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
