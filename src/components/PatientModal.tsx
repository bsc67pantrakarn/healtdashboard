import React from 'react';
import { X, User, Heart, Activity, AlertTriangle, CheckCircle2, Droplet, Dumbbell, Cigarette, Wine, MapPin, Calendar, Sparkles, ShieldCheck } from 'lucide-react';
import { ParsedPatient } from '../types';

interface PatientModalProps {
  patient: ParsedPatient | null;
  onClose: () => void;
}

export const PatientModal: React.FC<PatientModalProps> = ({ patient, onClose }) => {
  if (!patient) return null;

  const isDiabetic = patient.bloodSugar > 126;
  const isHypertensive = patient.sbp >= 140 || patient.dbp >= 90;
  const isHighRisk = patient.riskLevel === 'สูง';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden">
        {/* Modal Header with vibrant gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 text-xl font-black font-mono shadow-inner">
              {patient.id}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-xl font-black tracking-tight">
                  เวชระเบียนผู้ป่วย {patient.id}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-xs ${
                    isHighRisk
                      ? 'bg-rose-500 text-white'
                      : patient.riskLevel === 'ปานกลาง'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-emerald-400 text-slate-900'
                  }`}
                >
                  ระดับความเสี่ยง: {patient.riskLevel}
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-1.5 flex items-center gap-3 flex-wrap font-medium">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> เพศ{patient.gender} • อายุ {patient.age} ปี
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> พื้นที่: {patient.area}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> วันที่: {patient.date}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Key Vitals Grid */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>ข้อมูลสัญญาณชีพและค่าทางคลินิก (Vital Signs & Clinical Data)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* BMI */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="text-[11px] text-slate-500 font-bold">ดัชนีมวลกาย (BMI)</div>
                <div className="text-2xl font-black font-mono text-slate-800 mt-1">
                  {patient.bmi}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  สูง {patient.height} cm / หนัก {patient.weight} kg
                </div>
              </div>

              {/* Blood Sugar */}
              <div className={`p-3.5 rounded-2xl border shadow-2xs ${
                isDiabetic ? 'bg-rose-50/80 border-rose-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[11px] font-bold ${isDiabetic ? 'text-rose-700' : 'text-slate-500'}`}>
                  น้ำตาลในเลือด (FBS)
                </div>
                <div className={`text-2xl font-black font-mono mt-1 ${isDiabetic ? 'text-rose-600' : 'text-slate-800'}`}>
                  {patient.bloodSugar}
                </div>
                <div className="text-[10px] mt-0.5 font-bold">
                  {isDiabetic ? (
                    <span className="text-rose-700">⚠️ เกิน 126 mg/dL</span>
                  ) : (
                    <span className="text-emerald-700">✓ ปกติ (&le;126)</span>
                  )}
                </div>
              </div>

              {/* Systolic BP */}
              <div className={`p-3.5 rounded-2xl border shadow-2xs ${
                isHypertensive ? 'bg-purple-50/80 border-purple-200' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`text-[11px] font-bold ${isHypertensive ? 'text-purple-700' : 'text-slate-500'}`}>
                  ความดันตัวบน (SBP)
                </div>
                <div className={`text-2xl font-black font-mono mt-1 ${isHypertensive ? 'text-purple-600' : 'text-slate-800'}`}>
                  {patient.sbp}
                </div>
                <div className="text-[10px] mt-0.5 font-bold">
                  {patient.sbp >= 140 ? (
                    <span className="text-purple-700">⚠️ &ge;140 mmHg</span>
                  ) : (
                    <span className="text-emerald-700">✓ ปกติ</span>
                  )}
                </div>
              </div>

              {/* Diastolic BP */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="text-[11px] text-slate-500 font-bold">ความดันตัวล่าง (DBP)</div>
                <div className="text-2xl font-black font-mono text-slate-800 mt-1">
                  {patient.dbp}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-medium">mmHg</div>
              </div>
            </div>
          </div>

          {/* Behaviors */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-pink-500" />
              <span>พฤติกรรมการใช้ชีวิต (Lifestyle Behaviors)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  patient.smoking === 'สูบ' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <Cigarette className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">พฤติกรรมสูบบุหรี่</div>
                  <div className="font-bold text-slate-800 text-sm">
                    {patient.smoking === 'สูบ' ? 'สูบบุหรี่เป็นประจำ' : 'ไม่สูบบุหรี่'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  patient.exercise === 'ไม่ออกกำลังกาย' ? 'bg-rose-100 text-rose-600' : 'bg-cyan-100 text-cyan-600'
                }`}>
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">การออกกำลังกาย</div>
                  <div className="font-bold text-slate-800 text-sm">{patient.exercise}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  patient.alcohol === 'ดื่ม' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                }`}>
                  <Wine className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">การดื่มแอลกอฮอล์</div>
                  <div className="font-bold text-slate-800 text-sm">{patient.alcohol}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-pink-50/50 border border-indigo-100">
            <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>ข้อเสนอแนะทางการแพทย์และการติดตามผล (Clinical Action Plan)</span>
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
              {isHighRisk && (
                <li className="text-rose-700 font-bold">
                  ผู้ป่วยอยู่ในกลุ่มเสี่ยงสูง ควรนัดหมายติดตามผล FBS และความดันโลหิตซ้ำภายใน 2 สัปดาห์
                </li>
              )}
              {isDiabetic && (
                <li>
                  ตรวจพบระดับน้ำตาลในเลือดเกินเกณฑ์เบาหวาน (&gt;126 mg/dL) แนะนำส่งต่อแพทย์ตรวจยืนยัน HbA1c
                </li>
              )}
              {patient.smoking === 'สูบ' && (
                <li>แนะนำเข้ารับการบำบัดเลิกบุหรี่ในคลินิกฟ้าใสเพื่อลดปัจจัยเสี่ยงหลอดเลือดและหัวใจ</li>
              )}
              {patient.exercise === 'ไม่ออกกำลังกาย' && (
                <li>ส่งเสริมกิจกรรมทางกายระดับปานกลางอย่างน้อย 150 นาทีต่อสัปดาห์</li>
              )}
              {!isHighRisk && !isDiabetic && (
                <li className="text-emerald-800 font-medium">
                  ผลการคัดกรองเบื้องต้นอยู่ในเกณฑ์ปลอดภัย ควรตรวจสุขภาพประจำปีอย่างต่อเนื่อง
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
