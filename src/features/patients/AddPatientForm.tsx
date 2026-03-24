import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { addPatient } from '@/services/patientService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useNotificationStore } from '@/app/store/notificationStore';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  age: z.coerce.number().min(0, 'Invalid age').max(150),
  gender: z.string().min(1, 'Required'),
  status: z.enum(['Stable', 'Critical', 'Discharged', 'Under Observation']),
  condition: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function AddPatientForm({ onSuccess, onCancel }: { onSuccess: () => void, onCancel: () => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { status: 'Stable', gender: 'Male', condition: '' }
  });
  const [apiError, setApiError] = useState('');
  const addNotification = useNotificationStore(state => state.addNotification);

  const submit = async (data: FormValues) => {
    try {
      await addPatient({
        patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name,
        age: data.age,
        gender: data.gender,
        status: data.status as any,
        condition: data.condition || 'Not specified',
        lastVisit: new Date().toISOString().split('T')[0]
      });

      // In-app toast
      toast.success(`${data.name} added successfully!`);

      // Push to notification store (bell icon dropdown)
      addNotification({
        title: 'New Patient Registered',
        message: `${data.name} (${data.age} y/o) registered as ${data.status}.`,
        type: 'success'
      });

      // Critical patient alert
      if (data.status === 'Critical') {
        addNotification({
          title: 'Critical Patient Alert',
          message: `${data.name} has been admitted in CRITICAL condition. Immediate attention required.`,
          type: 'error'
        });
        toast.error(`ALERT: ${data.name} is in critical condition!`);
      }

      // Service Worker push notification
      if ('serviceWorker' in navigator && Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          registration.showNotification('New Patient Added', {
            body: `${data.name} has been successfully registered as ${data.status}.`,
            icon: '/vite.svg',
            badge: '/vite.svg'
          });
        });
      }

      onSuccess();
    } catch (err: any) {
      setApiError(err.message || 'Error adding patient to database');
      toast.error('Failed to add patient. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {apiError && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{apiError}</p>}
      <Input label="Full Name" {...register('name')} error={errors.name?.message} />

      <div className="grid grid-cols-2 gap-4">
        <Input label="Age" type="number" {...register('age')} error={errors.age?.message} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select {...register('gender')} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
        <select {...register('status')} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-shadow">
          <option value="Stable">Stable</option>
          <option value="Critical">Critical</option>
          <option value="Under Observation">Under Observation</option>
          <option value="Discharged">Discharged</option>
        </select>
      </div>

      <Input label="Medical Condition (Optional)" placeholder="e.g. Hypertension, Asthma" {...register('condition')} error={errors.condition?.message} />

      <div className="flex justify-end gap-2 pt-6">
        <Button variant="ghost" type="button" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>Create Patient</Button>
      </div>
    </form>
  );
}
