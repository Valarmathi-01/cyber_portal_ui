import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

const dataRegion = [
  { name: 'North', complaints: 400 },
  { name: 'South', complaints: 300 },
  { name: 'East', complaints: 200 },
  { name: 'West', complaints: 370 },
  { name: 'Central', complaints: 150 },
];

const dataTime = [
  { time: '00:00', count: 10 },
  { time: '04:00', count: 5 },
  { time: '08:00', count: 35 },
  { time: '12:00', count: 80 },
  { time: '16:00', count: 70 },
  { time: '20:00', count: 90 },
  { time: '23:59', count: 40 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Advanced Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={dataRegion}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="complaints" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Peak Reporting Times</CardTitle>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={dataTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#82ca9d" fill="#82ca9d" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
