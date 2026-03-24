import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

export interface Patient {
  id: string; // Document ID
  patientId: string; // Display ID e.g., PT-1001
  name: string;
  age: number;
  gender: string;
  status: 'Stable' | 'Critical' | 'Discharged' | 'Under Observation';
  condition?: string;
  lastVisit: string;
  createdAt?: any;
}

const PATIENTS_COLLECTION = 'patients';

export const getPatients = async (): Promise<Patient[]> => {
  try {
    const q = query(collection(db, PATIENTS_COLLECTION), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Patient));
  } catch (error) {
    console.error("Error fetching patients: ", error);
    return [];
  }
};

export const addPatient = async (patientData: Omit<Patient, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, PATIENTS_COLLECTION), {
    ...patientData,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updatePatientStatus = async (id: string, status: Patient['status']): Promise<void> => {
  const patientRef = doc(db, PATIENTS_COLLECTION, id);
  await updateDoc(patientRef, { status });
};
