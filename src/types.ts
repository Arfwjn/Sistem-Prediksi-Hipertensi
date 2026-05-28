export interface BPHistoryEntry {
  date: string;
  systolic: number;
  diastolic: number;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'L' | 'P';
  phone: string;
  email: string;
  address: string;
  status: 'Normal' | 'Pra Hipertensi' | 'Tingkat 1' | 'Tingkat 2' | 'Krisis Hipertensi';
  lastChecked: string;
  bpHistory: BPHistoryEntry[];
}

export interface PredictionRecord {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  modelUsed: 'Random Forest' | 'Decision Tree' | 'Logistic Regression';
  confidenceScore: number;
  systolic: number;
  diastolic: number;
  age: number;
  gender: 'L' | 'P';
  weight: number;
  height: number;
  bmi: number;
  result: 'Normal' | 'Pra Hipertensi' | 'Tingkat 1' | 'Tingkat 2' | 'Krisis Hipertensi';
}

export type ActiveTab = 'dashboard' | 'history' | 'patients' | 'settings';

export interface DoctorProfile {
  name: string;
  specialty: string;
  hospital: string;
  avatarUrl: string;
}

export interface AIModelConfig {
  activeModel: 'Random Forest' | 'Decision Tree' | 'Logistic Regression';
  rfTrees: number;
  rfMaxDepth: number;
  dtMinSamples: number;
  lrIterations: number;
  confidenceFactor: number; // multiplier for realism tweaking
}
