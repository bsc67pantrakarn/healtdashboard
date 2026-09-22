import React, { useState } from 'react';
import { Sparkles, Heart, Zap, RefreshCw, Award, Smile, ShieldCheck } from 'lucide-react';
import { ParsedPatient } from '../types';
import { ThemeConfig } from '../theme';

interface HealthVitalityWidgetProps {
  patients: ParsedPatient[];
  theme: ThemeConfig;
  onSelectRisk?: (risk: string) => void;
}

export const HealthVitalityWidget: React.FC<HealthVitalityWidgetProps> = ({ patients, theme, onSelectRisk }) => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isSparkling, setIsSparkling] = useState(false);

  // Compute Vitality Metrics
  const total = patients.length || 1;
  const normalSugarCount = patients.filter((p) => p.bloodSugar <= 126).length;
  const normalBPCount = patients.filter((p) => p.sbp < 140 && p.dbp < 90).length;
  const activeExCount = patients.filter((p) => p.exercise === 'สม่ำเสมอ' || p.exercise === 'บางครั้ง').length;
  const lowRiskCount = patients.filter((p) => p.riskLevel === 'ต่ำ').length;

  // Vitality Score (0 - 100)
  const vitalityScore = Math.round(
    ((normalSugarCount / total) * 0.35 +
      (normalBPCount / total) * 0.35 +
      (activeExCount / total) * 0.15 +
      (lowRiskCount / total) * 0.15) *
      100
  );

  const tips = [
    {
      title: 'น้ำตาลและเมตาบอลิซึม',
      text: `ผู้ป่วยในชีทควบคุมน้ำตาลได้ดีถึง ${Math.round((normalSugarCount / total) * 100)}% — แนะนำส่งเสริมอาหารกากใยสูงและลดเครื่องดื่มรสหวานเพื่อรักษาระดับนี้`,
      tag: 'เคล็ดลับเบาหวาน 🥗',
    },
    {
      title: 'พลังแห่งการขยับกาย',
      text: `มีผู้คัดกรองออกกำลังกาย ${activeExCount} ราย (${Math.round((activeExCount / total) * 100)}%) — การเดินเร็วเพียง 20 นาทีต่อวันช่วยลดความดัน SBP ได้ถึง 5-8 mmHg`,
      tag: 'ฟิตเนสเพื่อหัวใจ 🏃',
    },
    {
      title: 'การป้องกันหลอดเลือดและหัวใจ',
      text: `กลุ่มที่มีความดันโลหิตปกติมี ${normalBPCount} ราย — แนะนำตรวจวัดซ้ำช่วงเช้าและหลีกเลี่ยงโซเดียมเกิน 2,000 มก./วัน`,
      tag: 'ความดันโลหิต 🩺',
    },
    {
      title: 'การคัดกรองเชิงรุกสม่ำเสมอ',
      text: `ข้อมูลอัปเดตตรงตาม Google Sheet ทั้งหมด ${total} ราย — การติดตามทุก 3-6 เดือนช่วยป้องกันภาวะแทรกซ้อน NCDs ได้ถึง 80%`,
      tag: 'เฝ้าระวังสุขภาพ 🌟',
    },
  ];

  const handleNextTip = () => {
    setIsSparkling(true);
    setTipIndex((prev) => (prev + 1) % tips.length);
    setTimeout(() => setIsSparkling(false), 500);
  };

  const currentTip = tips[tipIndex];

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden mb-6">
      {/* Decorative Glow Blob */}
      <div 
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: theme.primaryColor }}
      />
      <div 
        className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: theme.secondaryColor }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Health Vitality Gauge */}
        <div className="flex items-center gap-5 w-full lg:w-auto">
          {/* Animated Gauge Ring */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${vitalityScore}, 100`}
                strokeLinecap="round"
                stroke="url(#vitalityGradient)"
                fill="none"
                className="transition-all duration-1000 ease-out"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <defs>
                <linearGradient id="vitalityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={theme.primaryColor} />
                  <stop offset="100%" stopColor={theme.secondaryColor} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold font-mono tracking-tight text-slate-800">
                {vitalityScore}%
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase">Vitality</span>
            </div>
          </div>

          {/* Score Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                มาตรวัดดัชนีพลังสุขภาพชุมชน (Community Health Index)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                {vitalityScore >= 70 ? '✨ ยอดเยี่ยม' : vitalityScore >= 50 ? '🟡 ปานกลาง' : '⚡ เฝ้าระวัง'}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800 mt-0.5">
              สุขภาพกลุ่มประชากรภาพรวมอยู่ในเกณฑ์ <span style={{ color: theme.primaryColor }}>{vitalityScore >= 70 ? 'แข็งแรงและควบคุมโรคได้ดี' : 'ต้องเฝ้าระวังกลุ่มเสี่ยงต่อเนื่อง'}</span>
            </h3>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                น้ำตาลปกติ: <strong className="text-slate-700">{normalSugarCount}/{total}</strong> ราย
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                ความดันปกติ: <strong className="text-slate-700">{normalBPCount}/{total}</strong> ราย
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                เสี่ยงต่ำ: <strong className="text-slate-700">{lowRiskCount}</strong> ราย
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Tip / Insight Box ("ลูกเล่น") */}
        <div className="w-full lg:w-1/2 bg-slate-50/80 border border-slate-200/80 rounded-2xl p-3.5 relative overflow-hidden transition-all duration-300 hover:border-slate-300">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-700">
                <Sparkles className={`w-3.5 h-3.5 ${isSparkling ? 'animate-spin' : ''}`} />
              </span>
              <span className="text-xs font-bold text-slate-700">
                คำแนะนำสุขภาพอัจฉริยะประจำวัน
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {currentTip.tag}
              </span>
            </div>

            <button
              onClick={handleNextTip}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 transition cursor-pointer active:scale-95 shadow-2xs"
              title="สุ่มอ่านคำแนะนำสุขภาพข้อถัดไป"
            >
              <RefreshCw className={`w-3 h-3 ${isSparkling ? 'animate-spin' : ''}`} />
              <span>สุ่มข้อคิดถัดไป</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            "{currentTip.text}"
          </p>
        </div>
      </div>
    </div>
  );
};
