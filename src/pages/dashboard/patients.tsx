import { useState, useEffect, useMemo } from 'react';
import { Search, LayoutGrid, List as ListIcon, Users, Plus, Edit2, ArrowUpDown, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useUIStore } from '@/app/store/uiStore';
import { Skeleton } from '@/components/ui/Skeleton';
import { getPatients, updatePatientStatus, Patient } from '@/services/patientService';
import { useNotificationStore } from '@/app/store/notificationStore';
import { seedDummyPatients } from '@/services/seedData';
import { AddPatientForm } from '@/features/patients/AddPatientForm';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  'Stable': 'bg-green-100 text-green-800 ring-green-600/20',
  'Critical': 'bg-red-100 text-red-800 ring-red-600/20',
  'Discharged': 'bg-gray-100 text-gray-800 ring-gray-600/20',
  'Under Observation': 'bg-amber-100 text-amber-800 ring-amber-600/20',
};

type SortKey = 'name' | 'age' | 'status' | 'lastVisit';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 8;

export default function PatientsPage() {
  const { patientViewMode, setPatientViewMode } = useUIStore();
  const addNotification = useNotificationStore(s => s.addNotification);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSeeding, setIsSeeding] = useState(false);

  const fetchPatients = async () => {
    setIsLoading(true);
    const data = await getPatients();
    setPatients(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleStatusChange = async (patient: Patient, newStatus: Patient['status']) => {
    if (newStatus === patient.status) return;
    setUpdatingId(patient.id);

    // Optimistic update
    setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: newStatus } : p));

    try {
      await updatePatientStatus(patient.id, newStatus);
      toast.success(`${patient.name} status updated to ${newStatus}`);
      addNotification({
        title: 'Status Updated',
        message: `${patient.name} status changed from ${patient.status} to ${newStatus}.`,
        type: newStatus === 'Critical' ? 'error' : 'info'
      });
      if (newStatus === 'Critical') {
        toast.error(`ALERT: ${patient.name} is now Critical!`);
      }
    } catch {
      toast.error('Failed to update status');
      setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, status: patient.status } : p));
    }
    setUpdatingId(null);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    await seedDummyPatients();
    toast.success('15 demo patients added!');
    await fetchPatients();
    setIsSeeding(false);
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const processedPatients = useMemo(() => {
    let result = patients.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) || (p.condition || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'age') cmp = a.age - b.age;
      else if (sortKey === 'status') cmp = a.status.localeCompare(b.status);
      else if (sortKey === 'lastVisit') cmp = a.lastVisit.localeCompare(b.lastVisit);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [patients, searchTerm, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(processedPatients.length / PAGE_SIZE));
  const paginatedPatients = processedPatients.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter]);

  const SortButton = ({ label, field }: { label: string; field: SortKey }) => (
    <button onClick={() => handleSort(field)} className="inline-flex items-center gap-1 hover:text-gray-900 transition-colors font-semibold">
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortKey === field ? 'text-primary-600' : 'text-gray-400'}`} />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Patients
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {processedPatients.length} patient{processedPatients.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          {patients.length === 0 && !isLoading && (
            <Button variant="outline" className="gap-2" onClick={handleSeed} disabled={isSeeding}>
              <Database className="w-4 h-4" />
              {isSeeding ? 'Seeding...' : 'Load Demo Data'}
            </Button>
          )}
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input className="pl-10 h-10" placeholder="Search by name, ID, or condition..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm">
            <option value="All">All Statuses</option>
            <option value="Stable">Stable</option>
            <option value="Critical">Critical</option>
            <option value="Under Observation">Under Observation</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
          <button onClick={() => setPatientViewMode('grid')} className={`p-2 rounded-md transition-all duration-200 ${patientViewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button onClick={() => setPatientViewMode('list')} className={`p-2 rounded-md transition-all duration-200 ${patientViewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}>
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex justify-between items-center"><Skeleton className="h-12 w-12 rounded-full" /><Skeleton className="h-6 w-20 rounded-full" /></div>
              <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : processedPatients.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No patients found</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'All' ? 'Try adjusting your search or filter criteria.' : 'Get started by adding your first patient or loading demo data.'}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" className="gap-2" onClick={handleSeed} disabled={isSeeding}>
              <Database className="w-4 h-4" />{isSeeding ? 'Seeding...' : 'Load Demo Data'}
            </Button>
            <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4" />Add Patient
            </Button>
          </div>
        </div>
      ) : patientViewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedPatients.map((patient) => (
            <Card key={patient.id} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default">
              <CardContent className="pt-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-lg shadow-inner group-hover:shadow-md transition-shadow">
                    {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="flex items-center group/status relative">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${statusColors[patient.status]}`}>
                      {updatingId === patient.id ? 'Updating...' : patient.status}
                    </span>
                    <select value={patient.status} onChange={(e) => handleStatusChange(patient, e.target.value as any)} disabled={updatingId === patient.id} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" title="Update status">
                      <option value="Stable">Stable</option><option value="Critical">Critical</option><option value="Under Observation">Under Observation</option><option value="Discharged">Discharged</option>
                    </select>
                    <Edit2 className="w-3 h-3 ml-1 text-gray-400 opacity-0 group-hover/status:opacity-100 transition-opacity" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{patient.name}</h3>
                <p className="text-sm text-gray-500 font-mono mt-1">{patient.patientId}</p>
                {patient.condition && patient.condition !== 'Not specified' && (
                  <p className="text-xs text-gray-600 mt-2 bg-gray-50 px-2 py-1 rounded-md inline-block border border-gray-100">{patient.condition}</p>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                  <span>{patient.age} yrs &bull; {patient.gender}</span>
                  <span>{new Date(patient.lastVisit).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead><SortButton label="Name" field="name" /></TableHead>
                  <TableHead><SortButton label="Age" field="age" /></TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead><SortButton label="Status" field="status" /></TableHead>
                  <TableHead className="text-right"><SortButton label="Last Visit" field="lastVisit" /></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium font-mono text-gray-500 text-xs">{patient.patientId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{patient.name}</p>
                          <p className="text-xs text-gray-500">{patient.gender}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{patient.age}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{patient.condition || '-'}</TableCell>
                    <TableCell>
                      <div className="relative inline-flex items-center group">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer ring-1 ring-inset ${statusColors[patient.status]}`}>
                          {updatingId === patient.id ? 'Updating...' : patient.status}
                          <Edit2 className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100" />
                        </span>
                        <select value={patient.status} onChange={(e) => handleStatusChange(patient, e.target.value as any)} disabled={updatingId === patient.id} className="absolute inset-0 opacity-0 cursor-pointer w-full" title="Update status">
                          <option value="Stable">Stable</option><option value="Critical">Critical</option><option value="Under Observation">Under Observation</option><option value="Discharged">Discharged</option>
                        </select>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-gray-500 text-sm">{new Date(patient.lastVisit).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {processedPatients.length > PAGE_SIZE && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{(currentPage - 1) * PAGE_SIZE + 1}</span> to <span className="font-semibold">{Math.min(currentPage * PAGE_SIZE, processedPatients.length)}</span> of <span className="font-semibold">{processedPatients.length}</span>
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Previous</Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${currentPage === i + 1 ? 'bg-primary-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</Button>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Patient</h3>
            <AddPatientForm
              onCancel={() => setIsModalOpen(false)}
              onSuccess={() => { setIsModalOpen(false); fetchPatients(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
