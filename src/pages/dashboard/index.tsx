import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Activity, HeartPulse, FileText, TrendingUp, Calendar, AlertTriangle, ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getPatients, Patient } from '@/services/patientService';
import { useNotificationStore } from '@/app/store/notificationStore';

const statusColors: Record<string, string> = {
  'Stable': 'bg-green-100 text-green-800',
  'Critical': 'bg-red-100 text-red-800',
  'Under Observation': 'bg-amber-100 text-amber-800',
  'Discharged': 'bg-gray-100 text-gray-800',
};

const appointments = [
  { name: 'Dr. Smith - Cardiology Follow-up', patient: 'James Brown', time: '10:00 AM', type: 'Follow-up' },
  { name: 'Dr. Patel - Lab Review', patient: 'Mary Johnson', time: '11:30 AM', type: 'Lab Review' },
  { name: 'Dr. Garcia - Initial Consult', patient: 'Robert Williams', time: '2:00 PM', type: 'New Patient' },
  { name: 'Dr. Lee - Physical Therapy', patient: 'Linda Davis', time: '3:30 PM', type: 'Therapy' },
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { notifications } = useNotificationStore();

  useEffect(() => {
    getPatients().then(data => {
      setPatients(data);
      setIsLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const total = patients.length;
    const critical = patients.filter(p => p.status === 'Critical').length;
    const active = patients.filter(p => p.status !== 'Discharged').length;
    const discharged = patients.filter(p => p.status === 'Discharged').length;
    return [
      { name: 'Total Patients', value: total, icon: Users, change: '+12%', changeType: 'positive', color: 'bg-blue-50 text-blue-600', link: '/dashboard/patients' },
      { name: 'Active Cases', value: active, icon: Activity, change: '+5%', changeType: 'positive', color: 'bg-emerald-50 text-emerald-600', link: '/dashboard/patients' },
      { name: 'Critical Alerts', value: critical, icon: HeartPulse, change: critical > 0 ? `${critical} active` : 'None', changeType: critical > 0 ? 'negative' : 'positive', color: 'bg-red-50 text-red-600', link: '/dashboard/patients' },
      { name: 'Discharged', value: discharged, icon: FileText, change: `${total > 0 ? Math.round(discharged / total * 100) : 0}% rate`, changeType: 'positive', color: 'bg-violet-50 text-violet-600', link: '/dashboard/patients' },
    ];
  }, [patients]);

  const criticalPatients = useMemo(() => patients.filter(p => p.status === 'Critical'), [patients]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Overview
        </h2>
        <p className="mt-1 text-sm text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-6 space-y-3"><Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-16" /><Skeleton className="h-3 w-32" /></CardContent></Card>
          ))
        ) : (
          stats.map((stat) => (
            <Card key={stat.name} className="group cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" onClick={() => navigate(stat.link)}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.name}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color} transition-transform group-hover:scale-110`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className={`w-3 h-3 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`} />
                  <p className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Critical Patients Alert */}
      {criticalPatients.length > 0 && (
        <Card className="border-red-200 bg-red-50/30 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <CardTitle className="text-red-900">Critical Patients ({criticalPatients.length})</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="text-red-700 border-red-300 hover:bg-red-100" onClick={() => navigate('/dashboard/patients')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {criticalPatients.slice(0, 6).map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-red-100 shadow-sm">
                  <div className="h-10 w-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                    {p.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.condition || p.patientId} &bull; {p.age} yrs</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <span className="text-xs text-gray-400 font-medium">Today</span>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.slice(0, 5).map((n) => (
                  <div key={n.id} className="flex items-start gap-3 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === 'error' ? 'bg-red-100' : n.type === 'success' ? 'bg-green-100' : 'bg-primary-100'}`}>
                      <Activity className={`h-4 w-4 ${n.type === 'error' ? 'text-red-600' : n.type === 'success' ? 'text-green-600' : 'text-primary-600'}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No recent activity. Add a patient to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Upcoming Appointments</CardTitle>
            <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <Calendar className="w-3 h-3" /> Today
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((apt, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                  <div className="flex-shrink-0 w-16 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-md px-2 py-1">
                      <Clock className="w-3 h-3" />{apt.time}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{apt.name}</p>
                    <p className="text-xs text-gray-500">Patient: {apt.patient}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">{apt.type}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
