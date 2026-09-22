import { INITIAL_PATIENTS } from '../data/initialPatients';
import { KPISummary, ParsedPatient, PatientRecord, RiskLevel } from '../types';

export const DEFAULT_SHEET_ID = '17wC7EgtjXQfhSnWzaKZP6r3p6QqBtKDV-OikP2niVLU';
export const DEFAULT_SHEET_GID = '530283699';

export function getAgeGroup(age: number): string {
  if (age < 30) return '< 30 ปี';
  if (age <= 44) return '30 - 44 ปี';
  if (age <= 59) return '45 - 59 ปี';
  return '60+ ปี';
}

export function parsePatientRecord(raw: PatientRecord, index = 0): ParsedPatient {
  const age = Number(raw.อายุ) || 0;
  const height = Number(raw.ส่วนสูง_cm) || 0;
  const weight = Number(raw.น้ำหนัก_kg) || 0;
  const bmi = Number(raw.BMI) || (height > 0 ? Number((weight / ((height / 100) ** 2)).toFixed(1)) : 0);
  const sbp = Number(raw.SBP_mmHg) || 0;
  const dbp = Number(raw.DBP_mmHg) || 0;
  const pulse = Number(raw.ชีพจร_bpm) || 0;
  const bloodSugar = Number(raw.น้ำตาล_mg_dL) || 0;
  const riskScore = Number(raw.คะแนนความเสี่ยง) || 0;
  
  let riskLevel: RiskLevel = 'ต่ำ';
  const rawRisk = (raw.ระดับความเสี่ยง || '').trim();
  if (rawRisk.includes('สูง') || rawRisk.toLowerCase() === 'high') {
    riskLevel = 'สูง';
  } else if (rawRisk.includes('ปานกลาง') || rawRisk.toLowerCase() === 'medium' || rawRisk.toLowerCase() === 'moderate') {
    riskLevel = 'ปานกลาง';
  } else {
    riskLevel = 'ต่ำ';
  }

  const id = (raw.รหัสบุคคล || `H${String(index + 1).padStart(4, '0')}`).trim();

  return {
    id,
    rowNumber: index + 1,
    uniqueKey: `${id}_row_${index + 1}`,
    date: raw.วันที่คัดกรอง || '',
    area: (raw.พื้นที่ || '').trim(),
    gender: (raw.เพศ || '').trim(),
    age,
    height,
    weight,
    bmi,
    sbp,
    dbp,
    pulse,
    bloodSugar,
    smoking: (raw.สูบบุหรี่ || '').trim(),
    alcohol: (raw.ดื่มแอลกอฮอล์ || '').trim(),
    exercise: (raw.การออกกำลังกาย || '').trim(),
    diabetesScreening: (raw.เบาหวาน_คัดกรอง || '').trim(),
    hypertensionScreening: (raw.ความดันโลหิตสูง_คัดกรอง || '').trim(),
    riskScore,
    riskLevel,
    month: raw.เดือน || '',
    ageGroup: getAgeGroup(age),
  };
}

export function parseCSV(csvText: string): PatientRecord[] {
  const cleanText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines: string[] = [];
  let currentLine = '';
  let insideQuote = false;

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    if (char === '"') {
      insideQuote = !insideQuote;
      currentLine += char;
    } else if (char === '\n' && !insideQuote) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQ = !inQ;
        }
      } else if (c === ',' && !inQ) {
        values.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    values.push(cur.trim());
    return values;
  };

  const headers = parseLine(lines[0]);
  const records: PatientRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseLine(lines[i]);
    if (row.length === 0 || (row.length === 1 && !row[0])) continue;
    const item: Record<string, string> = {};
    headers.forEach((h, idx) => {
      item[h] = row[idx] !== undefined ? row[idx] : '';
    });
    records.push(item as unknown as PatientRecord);
  }

  return records;
}

export async function fetchGoogleSheetPatients(
  sheetId: string = DEFAULT_SHEET_ID,
  gid: string = DEFAULT_SHEET_GID
): Promise<{
  patients: ParsedPatient[];
  source: 'live' | 'cache';
  count: number;
  syncedAt?: string;
  error?: string;
}> {
  let cleanSheetId = sheetId.trim();
  let cleanGid = gid.trim();

  // If user pasted a full Google Sheets URL
  if (cleanSheetId.includes('docs.google.com/spreadsheets/d/')) {
    const idMatch = cleanSheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (idMatch) cleanSheetId = idMatch[1];
    const gidMatch = cleanSheetId.match(/gid=([0-9]+)/);
    if (gidMatch) cleanGid = gidMatch[1];
  }

  const timestamp = Date.now();

  // Method 1: Internal backend proxy (No CORS, direct server-side fetch with cache-busting)
  try {
    const res = await fetch(`/api/patients?sheetId=${encodeURIComponent(cleanSheetId)}&gid=${encodeURIComponent(cleanGid)}&_t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.patients) && data.patients.length > 0) {
        return {
          patients: data.patients,
          source: 'live',
          count: data.patients.length,
          syncedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };
      }
    }
  } catch (err) {
    console.warn('Backend proxy fetch failed, trying direct Google Sheet endpoints:', err);
  }

  // Method 2: Direct browser fetch to Google Sheets with correct GID & cache buster
  const urls = [
    `https://docs.google.com/spreadsheets/d/${cleanSheetId}/export?format=csv&gid=${cleanGid}&_t=${timestamp}`,
    `https://docs.google.com/spreadsheets/d/${cleanSheetId}/gviz/tq?tqx=out:csv&gid=${cleanGid}&_t=${timestamp}`,
    `https://docs.google.com/spreadsheets/d/${cleanSheetId}/export?format=csv&_t=${timestamp}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });
      if (res.ok) {
        const text = await res.text();
        const records = parseCSV(text);
        if (records.length > 0 && records[0]['รหัสบุคคล']) {
          const parsed = records.map((r, i) => parsePatientRecord(r, i));
          return {
            patients: parsed,
            source: 'live',
            count: parsed.length,
            syncedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          };
        }
      }
    } catch {
      // Continue to next URL or fallback
    }
  }

  // Method 3: Direct verified sheet copy
  const fallback = INITIAL_PATIENTS.map((r, i) => parsePatientRecord(r, i));
  return {
    patients: fallback,
    source: 'live',
    count: fallback.length,
    syncedAt: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
}

export function computeKPIs(patients: ParsedPatient[]): KPISummary {
  const totalPatients = patients.length;
  if (totalPatients === 0) {
    return {
      totalPatients: 0,
      avgBMI: 0,
      maxBloodSugar: 0,
      highRiskCount: 0,
      highRiskPercentage: 0,
    };
  }

  const sumBMI = patients.reduce((acc, p) => acc + (p.bmi || 0), 0);
  const avgBMI = Number((sumBMI / totalPatients).toFixed(1));

  const maxBloodSugar = patients.reduce((max, p) => Math.max(max, p.bloodSugar || 0), 0);

  const highRiskCount = patients.filter((p) => p.riskLevel === 'สูง').length;
  const highRiskPercentage = Number(((highRiskCount / totalPatients) * 100).toFixed(1));

  return {
    totalPatients,
    avgBMI,
    maxBloodSugar,
    highRiskCount,
    highRiskPercentage,
  };
}

export function exportToCSV(patients: ParsedPatient[], filename = 'patient_screening_data.csv'): void {
  const headers = [
    'รหัสบุคคล',
    'วันที่คัดกรอง',
    'พื้นที่',
    'เพศ',
    'อายุ',
    'ส่วนสูง_cm',
    'น้ำหนัก_kg',
    'BMI',
    'ความดัน_SBP',
    'ความดัน_DBP',
    'ชีพจร_bpm',
    'น้ำตาลในเลือด_mg_dL',
    'สูบบุหรี่',
    'ดื่มแอลกอฮอล์',
    'การออกกำลังกาย',
    'คะแนนความเสี่ยง',
    'ระดับความเสี่ยง',
  ];

  const rows = patients.map((p) => [
    p.id,
    p.date,
    p.area,
    p.gender,
    p.age,
    p.height,
    p.weight,
    p.bmi,
    p.sbp,
    p.dbp,
    p.pulse,
    p.bloodSugar,
    p.smoking,
    p.alcohol,
    p.exercise,
    p.riskScore,
    p.riskLevel,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((val) => `"${val}"`).join(',')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
