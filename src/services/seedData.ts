import { addPatient } from './patientService';

const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const conditions = ['Hypertension', 'Diabetes Type 2', 'Asthma', 'Post-Op Recovery', 'None', 'Cardiac Arrhythmia', 'Chronic Migraine'];
const statuses = ['Stable', 'Critical', 'Under Observation', 'Discharged'] as const;

export const seedDummyPatients = async (): Promise<void> => {
  const promises = [];
  for (let i = 0; i < 15; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    promises.push(
      addPatient({
        patientId: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: `${fn} ${ln}`,
        age: Math.floor(Math.random() * 60) + 20,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        status: statuses[Math.floor(Math.random() * statuses.length)],
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        lastVisit: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
      })
    );
  }
  await Promise.all(promises);
};
