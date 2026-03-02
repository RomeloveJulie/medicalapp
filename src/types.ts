export interface Submission {
  id: number;
  email: string;
  phone: string;
  data: FormData;
  status: 'Pending' | 'Completed' | 'Cancelled';
  staff_notes?: string;
  created_at: string;
}

export interface FormData {
  name: string;
  gender: 'male' | 'female';
  age: string;
  height: string;
  weight: string;
  occupation: string;
  address: string;
  phone: string;
  symptoms: string;
  onset: string;
  history: string;
  cold_heat: string[];
  sweat: string[];
  pain: string[];
  pain_location: string;
  eating: string[];
  taste: string[];
  thirst: string[];
  mouth_feeling: string[];
  sleep: string[];
  excretion: string[];
  effort_emotion: string[];
  head_throat: string[];
  chest_limbs: string[];
  women_health?: string[];
  tongue_body: string[];
  tongue_quality: string[];
  tongue_coating: string[];
  disease_pattern: string[];
  disease_pattern_custom: string;
}

export interface User {
  email: string;
  role: 'staff' | 'patient';
}
