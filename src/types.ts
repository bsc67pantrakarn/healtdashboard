export type RiskLevel = 'ต่ำ' | 'ปานกลาง' | 'สูง';
export type AreaName = 'เมือง' | 'เหนือ' | 'ใต้' | 'ตะวันออก' | 'ตะวันตก';
export type Gender = 'ชาย' | 'หญิง';
export type ExerciseStatus = 'สม่ำเสมอ' | 'บางครั้ง' | 'ไม่ออกกำลังกาย';
export type YesNoStatus = 'สูบ' | 'ไม่สูบ' | 'ดื่ม' | 'ไม่ดื่ม';
export type ScreeningStatus = 'ไม่มี' | 'มีแนวโน้ม/เสี่ยง';

export interface PatientRecord {
  รหัสบุคคล: string;
  วันที่คัดกรอง: string;
  พื้นที่: string;
  เพศ: string;
  อายุ: string | number;
  ส่วนสูง_cm: string | number;
  น้ำหนัก_kg: string | number;
  BMI: string | number;
  SBP_mmHg: string | number;
  DBP_mmHg: string | number;
  ชีพจร_bpm: string | number;
  น้ำตาล_mg_dL: string | number;
  สูบบุหรี่: string;
  ดื่มแอลกอฮอล์: string;
  การออกกำลังกาย: string;
  เบาหวาน_คัดกรอง: string;
  ความดันโลหิตสูง_คัดกรอง: string;
  คะแนนความเสี่ยง: string | number;
  ระดับความเสี่ยง: string;
  เดือน: string;
}

export interface ParsedPatient {
  id: string;
  rowNumber?: number;
  uniqueKey?: string;
  date: string;
  area: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  sbp: number;
  dbp: number;
  pulse: number;
  bloodSugar: number;
  smoking: string;
  alcohol: string;
  exercise: string;
  diabetesScreening: string;
  hypertensionScreening: string;
  riskScore: number;
  riskLevel: RiskLevel;
  month: string;
  ageGroup: string;
}

export interface FilterState {
  ageGroup: string;
  area: string;
  riskLevel: string;
  month: string;
  gender: string;
  searchQuery: string;
}

export interface KPISummary {
  totalPatients: number;
  avgBMI: number;
  maxBloodSugar: number;
  highRiskCount: number;
  highRiskPercentage: number;
}
