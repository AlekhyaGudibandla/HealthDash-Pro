import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Activity, Users, HeartPulse } from 'lucide-react';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#6b7280'];

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);

  const intakeData = useMemo(() => {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      data.push({
        name: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        patients: Math.floor(Math.random() * 20) + 40 + Math.floor(Math.sin(i / 3) * 15),
        discharged: Math.floor(Math.random() * 15) + 10 + Math.floor(Math.cos(i / 4) * 8),
      });
    }
    return data;
  }, []);

  const departmentData = useMemo(() => [
    { name: 'Cardiology', patients: 45, capacity: 60 },
    { name: 'Neurology', patients: 32, capacity: 40 },
    { name: 'Orthopedics', patients: 28, capacity: 50 },
    { name: 'Pediatrics', patients: 38, capacity: 45 },
    { name: 'Oncology', patients: 22, capacity: 35 },
    { name: 'ER', patients: 55, capacity: 70 },
  ], []);

  const statusDistribution = useMemo(() => [
    { name: 'Stable', value: 45 },
    { name: 'Critical', value: 12 },
    { name: 'Under Observation', value: 28 },
    { name: 'Discharged', value: 35 },
  ], []);

  const kpis = useMemo(() => [
    { label: 'Avg. Stay Duration', value: '4.2 days', trend: '-8%', positive: true, icon: Activity },
    { label: 'Patient Satisfaction', value: '94.5%', trend: '+2.1%', positive: true, icon: TrendingUp },
    { label: 'Readmission Rate', value: '3.2%', trend: '-1.5%', positive: true, icon: HeartPulse },
    { label: 'Bed Occupancy', value: '78%', trend: '+5%', positive: false, icon: Users },
  ], []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Analytics</h2>
        <p className="mt-1 text-sm text-gray-500">Patient intake, department load, and facility metrics.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardContent className="p-5 space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-7 w-16" /><Skeleton className="h-3 w-20" /></CardContent></Card>
        )) : kpis.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">{kpi.label}</span>
                <kpi.icon className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-1">
                {kpi.positive ? <TrendingDown className="w-3 h-3 text-green-600" /> : <TrendingUp className="w-3 h-3 text-red-500" />}
                <span className={`text-xs font-medium ${kpi.positive ? 'text-green-600' : 'text-red-500'}`}>{kpi.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Patient Intake Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[320px] w-full" /> : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={intakeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDischarged" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} interval={4} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '13px' }} />
                    <Area type="monotone" dataKey="patients" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPatients)" name="Admitted" />
                    <Area type="monotone" dataKey="discharged" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorDischarged)" name="Discharged" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status Distribution Pie */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[320px] w-full" /> : (
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusDistribution} cx="50%" cy="45%" innerRadius={60} outerRadius={95} paddingAngle={4} dataKey="value" stroke="none">
                      {statusDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value: string) => <span className="text-xs text-gray-600 ml-1">{value}</span>} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Load */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Department Patient Load</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-[300px] w-full" /> : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="patients" fill="#0ea5e9" radius={[6, 6, 0, 0]} name="Current" />
                    <Bar dataKey="capacity" fill="#e5e7eb" radius={[6, 6, 0, 0]} name="Capacity" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Load */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>System Load</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              {[
                { label: 'ICU Capacity', value: 75, color: 'bg-red-500' },
                { label: 'Outpatient Ward', value: 40, color: 'bg-teal-500' },
                { label: 'ER Wait Time', value: 35, suffix: '22 mins', color: 'bg-amber-500' },
                { label: 'Lab Processing', value: 60, color: 'bg-blue-500' },
                { label: 'Pharmacy Queue', value: 25, color: 'bg-violet-500' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.suffix || `${item.value}%`}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`${item.color} h-2.5 rounded-full transition-all duration-700`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
